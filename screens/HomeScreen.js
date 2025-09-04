// HomeScreen.js
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
  Text,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Header from '../components/HomeHeader';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';

import Notification from '../assets/images/vector.png';
import Filter from '../assets/images/filter.png';
import Search from '../assets/images/search.png';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';

import { getCategoryPath, productKeyOf } from '../utils/firebasePaths';
import { ROUTES } from '../helper/routes';

const CATEGORIES = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];
const PAGE_LIMIT = 10;

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rawProducts, setRawProducts] = useState([]); // flattened items shown
  const [favKeys, setFavKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastKey, setLastKey] = useState(null); // last firebaseId of last appended page
  const [hasMore, setHasMore] = useState(true);

  const userId = auth().currentUser?.uid || null;

  // Use a ref to track firebaseIds we've already displayed (avoids duplicates)
  const seenIdsRef = useRef(new Set());

  // ✅ helper to validate products
  const isValidProduct = (product) => {
    if (!product || typeof product !== 'object') return false;
    if (!product.name || !product.price || !product.image) return false;
    return true;
  };

  // helper: flatten snapshot data (handles nested category/subcategory structure)
  const flattenProductsFromSnapshot = (data, category) => {
    const list = [];
    if (!data || typeof data !== 'object') return list;

    if (category === 'All') {
      // data structure: { categoryName: { subCatName: { productId: productObj } } }
      Object.entries(data).forEach(([categoryName, subcats]) => {
        Object.entries(subcats || {}).forEach(([subCatName, productsObj]) => {
          Object.entries(productsObj || {}).forEach(([firebaseId, product]) => {
            if (isValidProduct(product)) {
              list.push({
                ...product,
                id: `${categoryName}_${subCatName}_${firebaseId}`,
                firebaseId,
                category: categoryName,
                subCategory: subCatName,
              });
            }
          });
        });
      });
    } else {
      // data structure: { subCatName: { productId: productObj } }
      Object.entries(data || {}).forEach(([subCatName, productsObj]) => {
        Object.entries(productsObj || {}).forEach(([firebaseId, product]) => {
          if (isValidProduct(product)) {
            list.push({
              ...product,
              id: `${category}_${subCatName}_${firebaseId}`,
              firebaseId,
              category,
              subCategory: subCatName,
            });
          }
        });
      });
    }

    return list;
  };

  // --- Fetch products paginated ---
  const fetchProducts = async (isLoadMore = false) => {
    try {
      if (isLoadMore) setLoadingMore(true);
      else setLoading(true);

      const path = getCategoryPath(selectedCategory);
      const ref = database().ref(path);

      let query = ref.orderByKey();
      if (isLoadMore && lastKey) {
        query = query.startAt(lastKey).limitToFirst(PAGE_LIMIT + 1);
      } else {
        query = query.limitToFirst(PAGE_LIMIT);
      }

      const snapshot = await query.once('value');

      if (!snapshot.exists()) {
        if (!isLoadMore) setRawProducts([]);
        setHasMore(false);
        return;
      }

      const data = snapshot.val() || {};

      // Flatten the nested structure into a list of product objects
      let list = flattenProductsFromSnapshot(data, selectedCategory);

      list.sort((a, b) => a.firebaseId.localeCompare(b.firebaseId));

      // Remove already seen IDs and the duplicate lastKey when loading more
      if (isLoadMore) {
        while (list.length && (list[0].firebaseId === lastKey || seenIdsRef.current.has(list[0].firebaseId))) {
          list.shift();
        }
      } else {
        // For fresh loads also filter any previously seen ids (defensive)
        list = list.filter((it) => !seenIdsRef.current.has(it.firebaseId));
      }

      const pageItems = list.slice(0, PAGE_LIMIT);

      if (isLoadMore) {
        setRawProducts((prev) => [...prev, ...pageItems]);
      } else {
        setRawProducts(pageItems);
      }

      // Mark appended items as seen (to avoid duplicates across pages)
      pageItems.forEach((it) => seenIdsRef.current.add(it.firebaseId));

      // Update lastKey to the last item we actually appended (used as the cursor)
      if (pageItems.length > 0) {
        setLastKey(pageItems[pageItems.length - 1].firebaseId);
      }

      setHasMore(list.length > PAGE_LIMIT);
    } catch (error) {
      console.error('🔥 Firebase fetch error:', error);
    } finally {
      if (isLoadMore) setLoadingMore(false);
      else setLoading(false);
    }
  };

  // Reset on category change
  useEffect(() => {
    // reset paging + seen ids
    setRawProducts([]);
    setLastKey(null);
    setHasMore(true);
    seenIdsRef.current = new Set();

    // fetch first page for new category
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  // --- Subscribe to favorites ---
  useEffect(() => {
    if (!userId) {
      setFavKeys(new Set());
      return;
    }
    const ref = database().ref(`users/${userId}/favorites`);
    const listener = ref.on('value', (snap) => {
      if (!snap.exists()) setFavKeys(new Set());
      else {
        const obj = snap.val();
        setFavKeys(new Set(Object.keys(obj).filter((k) => obj[k])));
      }
    });
    return () => ref.off('value', listener);
  }, [userId]);

  // --- Merge favorites ---
  const products = useMemo(() => {
    return rawProducts.map((p) => {
      const key = productKeyOf(p.category, p.subCategory, p.firebaseId);
      return { ...p, isFavourite: favKeys.has(key) };
    });
  }, [rawProducts, favKeys]);

  // --- Handle product click ---
  const handleProductPress = useCallback(
    (product) =>
      navigation.navigate(ROUTES.PRODUCT_DETAIL, {
        product,
        category: selectedCategory,
      }),
    [navigation, selectedCategory]
  );

  // --- Helpers ---

// Robustly extract category, subCategory and firebaseId from a product object
const normalizeProductForFav = (product) => {
  if (!product || typeof product !== 'object') return { category: null, subCategory: null, firebaseId: null };

  let firebaseId = product.firebaseId ?? product.key ?? product.productId ?? null;
  let category = product.category ?? null;
  let subCategory = product.subCategory ?? null;

  if ((!firebaseId || !category || !subCategory) && product.id) {
    const parts = String(product.id).split('_');
    if (parts.length >= 3) {
      category = category ?? parts[0];
      subCategory = subCategory ?? parts[1];
      firebaseId = firebaseId ?? parts.slice(2).join('_');
    } else if (parts.length === 2) {
      category = category ?? parts[0];
      firebaseId = firebaseId ?? parts[1];
    }
  }

  if (typeof category === 'string') category = category.trim();
  if (typeof subCategory === 'string') subCategory = subCategory.trim();
  if (typeof firebaseId === 'string') firebaseId = firebaseId.trim();

  return { category, subCategory, firebaseId };
};

// --- Toggle favorite ---
// --- Toggle favorite ---
const handleToggleFavourite = useCallback(
  async (product) => {
    if (!userId) {
      Alert.alert('Login required', 'Please sign in to save favorites.');
      return;
    }

    // Normalization: always extract category, subCategory, firebaseId
    const { category, subCategory, firebaseId } = normalizeProductForFav(product);

    if (!firebaseId || !category || !subCategory) {
      console.error('[fav] ❌ Missing key parts for product', {
        product,
        category,
        subCategory,
        firebaseId,
      });
      Alert.alert(
        'Error',
        'Could not determine product identifier for favorites. Please try again.'
      );
      return;
    }

    let favKey;
    try {
      favKey = productKeyOf(category, subCategory, firebaseId);
    } catch (err) {
      console.error('[fav] ❌ productKeyOf failed', { err, category, subCategory, firebaseId });
      return;
    }

    const favRef = database().ref(`users/${userId}/favorites/${favKey}`);

    const currentlyFavourite = !!product.isFavourite;

    // Optimistic update
    setFavKeys((prev) => {
      const next = new Set(prev);
      if (currentlyFavourite) next.delete(favKey);
      else next.add(favKey);
      return next;
    });

    try {
      if (currentlyFavourite) {
        await favRef.remove();
        console.info('[fav] ✅ Removed favorite:', favKey);
      } else {
        await favRef.set(true);
        console.info('[fav] ✅ Added favorite:', favKey);
      }
    } catch (err) {
      // Rollback optimistic update
      setFavKeys((prev) => {
        const rollback = new Set(prev);
        if (currentlyFavourite) rollback.add(favKey);
        else rollback.delete(favKey);
        return rollback;
      });

      console.error('[fav] ❌ Firebase write failed', { favKey, err });
      Alert.alert('Error', 'Could not update favorite. Please try again.');
    }
  },
  [userId]
);

  // --- Render product ---
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        HeartIcon={item.isFavourite ? HeartFill : Heart}
        onPress={() => handleProductPress(item)}
        onToggleFavourite={handleToggleFavourite}
      />
    ),
    [handleProductPress, handleToggleFavourite]
  );

  // --- Handle pagination ---
  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      fetchProducts(true);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Discover" rightIcon={Notification} />

        <SearchBar
          searchIcon={Search}
          filterIcon={Filter}
          value={''}
          onPress={() => navigation.navigate(ROUTES.SEARCH_SCREEN, { products })}
        />

        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            ListFooterComponent={
              loadingMore ? (
                <View style={{ padding: 16 }}>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : !hasMore ? (
                <View style={{ padding: 12, alignItems: 'center' }}>
                  <Text style={{ color: 'gray' }}>No more products</Text>
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View style={{ flex: 1, alignItems: 'center', marginTop: 40 }}>
                <Text style={{ color: 'gray', fontSize: 16 }}>
                  No products found in this category
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },

  loaderWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    marginVertical: 6,
    maxHeight: 150,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  dropdownText: { fontSize: 16, color: '#333' },
  noResult: {
    padding: 12,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});
