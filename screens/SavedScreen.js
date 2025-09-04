import React, { useEffect, useState } from 'react';
import {
  FlatList,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import ProductCard from '../components/ProductCard';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';
import { ROUTES } from '../helper/routes';
import Header from '../components/Header';

const SavedScreen = ({ navigation }) => {
  const [favourites, setFavourites] = useState([]);
  const [loading, setLoading] = useState(true);

  const userId = auth().currentUser?.uid || null;

 useEffect(() => {
  if (!userId) {
    setFavourites([]);
    setLoading(false);
    return;
  }

  const favRef = database().ref(`users/${userId}/favorites`);

  const handleSnapshot = async (snapshot) => {
    if (!snapshot.exists()) {
      setFavourites([]);
      setLoading(false);
      return;
    }

    const favKeys = Object.keys(snapshot.val());
    const products = [];

    for (const key of favKeys) {
      const [category, subCategory, productId] = key.split('|');
      if (!category || !subCategory || !productId) continue;

      const prodRef = database().ref(
        `categories/${category}/${subCategory}/${productId}`
      );
      const prodSnap = await prodRef.once('value');
      if (prodSnap.exists()) {
        products.push({
          id: productId,
          ...prodSnap.val(),
          category,
          subCategory,
          isFavourite: true,
        });
      }
    }

    setFavourites(products);
    setLoading(false);
  };

  favRef.on('value', handleSnapshot);

  return () => favRef.off('value', handleSnapshot); // ✅ exact reference
}, [userId]);


  const handleToggleFavourite = async (product) => {
    if (!userId) return;
    const favKey = `${product.category}|${product.subCategory}|${product.id}`;
    await database().ref(`users/${userId}/favorites/${favKey}`).remove();
    setFavourites((prev) => prev.filter((item) => item.id !== product.id));
  };

  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      <Image source={Heart} style={styles.staticHeartIcon} />
      <Text style={styles.emptyTitle}>No Saved Items!</Text>
      <Text style={styles.emptySubtitle}>
        You don’t have any saved items. Go to home and add some.
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.mainContainer}>
      <Header headerTitle={'Saved Items'} />
<View style={styles.container}>

      {loading ? (
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : favourites.length === 0 ? (
        renderEmptyComponent()
      ) : (
        <FlatList
          data={favourites}
          keyExtractor={(item, index) => item.id ?? `fav-${index}`}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={item.isFavourite ? HeartFill : Heart}
              onPress={() =>
                navigation.navigate(ROUTES.PRODUCT_DETAIL, { product: item })
              }
              onToggleFavourite={handleToggleFavourite}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      )}
</View>
    </SafeAreaView>
  );
};

export default SavedScreen;

const styles = StyleSheet.create({
    mainContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
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
});
