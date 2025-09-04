// screens/SavedScreen.js
import React, { useEffect, useState, useCallback } from 'react';
import {
  FlatList,
  View,
  Text,
  ActivityIndicator,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Header from '../components/Header';
import ProductCard from '../components/ProductCard';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';
import { ROUTES } from '../helper/routes';

const parseFavKey = (key) => {
  if (!key || typeof key !== 'string') return { category: null, subCategory: null, productId: null };
  const [category, subCategory, ...rest] = key.split('|');
  return { category, subCategory, productId: rest.join('|') || null };
};

const buildCandidatePaths = (category, subCategory, productId) => {
  const cat = category || '';
  const sub = subCategory || '';
  const catLC = typeof cat === 'string' ? cat.toLowerCase() : cat;
  const subLC = typeof sub === 'string' ? sub.toLowerCase() : sub;

  const paths = new Set();
  paths.add(`categories/${cat}/${sub}/${productId}`);
  if (catLC) paths.add(`categories/${catLC}/${sub}/${productId}`);
  if (subLC) paths.add(`categories/${cat}/${subLC}/${productId}`);
  if (catLC && subLC) paths.add(`categories/${catLC}/${subLC}/${productId}`);
  if (cat && sub) {
    paths.add(`categories/${sub}/${cat}/${productId}`);
    paths.add(`categories/${subLC}/${catLC}/${productId}`);
  }
  return Array.from(paths);
};

const resolveProductFromFavKey = async (favKey) => {
  const { category, subCategory, productId } = parseFavKey(favKey);
  if (!productId) return { product: null, debug: { favKey, reason: 'invalid-favkey' } };

  const triedPaths = [];
  const candidates = buildCandidatePaths(category, subCategory, productId);

  for (const path of candidates) {
    triedPaths.push(path);
    try {
      const snap = await database().ref(path).once('value');
      if (snap.exists()) {
        const val = snap.val();
        const [_, usedCategory, usedSubCategory] = path.split('/');
        const product = {
          ...val,
          id: `${usedCategory}_${usedSubCategory}_${productId}`,
          firebaseId: productId,
          category: usedCategory,
          subCategory: usedSubCategory,
          favKey,
          isFavourite: true,
        };
        return { product, debug: { favKey, triedPaths, method: 'candidates' } };
      }
    } catch (err) {
      console.warn('[favorites] error querying', path, err);
    }
  }
  return { product: null, debug: { favKey, triedPaths, method: 'not-found' } };
};

const subscribeToFavorites = (userId, onUpdate) => {
  const ref = database().ref(`users/${userId}/favorites`);

  const handler = async (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate({ favorites: [], failedKeys: [] });
      return;
    }

    const raw = snapshot.val() || {};
    const favKeys = Object.keys(raw).filter((k) => raw[k]);

    const results = await Promise.all(
      favKeys.map(async (key) => {
        try {
          const { product, debug } = await resolveProductFromFavKey(key);
          return { key, product, debug };
        } catch (err) {
          return { key, product: null, debug: { key, error: String(err) } };
        }
      })
    );

    const favorites = results.filter((r) => r.product).map((r) => r.product);
    const failedKeys = results.filter((r) => !r.product).map((r) => ({ key: r.key, debug: r.debug }));

    onUpdate({ favorites, failedKeys });
  };

  ref.on('value', handler);
  return () => ref.off('value', handler);
};

const removeFavoriteFromDB = (userId, favKey) =>
  database().ref(`users/${userId}/favorites/${favKey}`).remove();

//
// ------------------ Custom Hook ------------------
//
const useFavorites = () => {
  const userId = auth().currentUser?.uid ?? null;
  const [favorites, setFavorites] = useState([]);
  const [failedKeys, setFailedKeys] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setFavorites([]);
      setFailedKeys([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToFavorites(userId, ({ favorites: favs, failedKeys: failed }) => {
      setFavorites(favs);
      setFailedKeys(failed);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userId]);

  const removeFavorite = useCallback(
    async (product) => {
      if (!userId) {
        Alert.alert('Login required', 'Please sign in to remove favourites.');
        return;
      }

      const favKey = product?.favKey;
      if (!favKey) return;

      // Optimistic UI
      setFavorites((prev) => prev.filter((p) => p.favKey !== favKey));
      setFailedKeys((prev) => prev.filter((f) => f.key !== favKey));

      try {
        await removeFavoriteFromDB(userId, favKey);
      } catch (err) {
        console.error('[useFavorites] remove failed', err);
        // rollback
        setFavorites((prev) =>
          prev.some((p) => p.favKey === favKey) ? prev : [...prev, { ...product, isFavourite: false }]
        );
      }
    },
    [userId]
  );

  return { favorites, failedKeys, loading, removeFavorite };
};

const SavedScreen = ({ navigation }) => {
  const { favorites, loading, failedKeys, removeFavorite } = useFavorites();

  const renderEmpty = () => (
    <View style={styles.emptyContainer}>
      <Image source={Heart} style={styles.staticHeartIcon} />
      <Text style={styles.emptyTitle}>No Saved Items!</Text>
      <Text style={styles.emptySubtitle}>You don’t have any saved items. Go to home and add some.</Text>
      {failedKeys.length > 0 && (
        <Text style={styles.debugText}>
          Some favourites could not be located — check console for details.
        </Text>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Header headerTitle="Saved Items" />
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle="Saved Items" />
      {favorites.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item, index) => item.id ?? item.firebaseId ?? item.favKey ?? `fav-${index}`}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={item.isFavourite ? HeartFill : Heart}
              onPress={() => navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })}
              onToggleFavourite={() => removeFavorite(item)}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },

  staticHeartIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
    marginBottom: 10,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
  },

  emptySubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 6,
    textAlign: 'center',
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  debugText: {
    marginTop: 12,
    color: 'gray',
    fontSize: 12,
    textAlign: 'center',
  },
});
