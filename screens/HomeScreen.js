// HomeScreen.js
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator, Alert, Text } from 'react-native';
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

import { useDispatch } from 'react-redux';
import { setProducts } from '../src/redux/slices/productsSlice';

import { getCategoryPath, productKeyOf } from '../utils/firebasePaths';
import { ROUTES } from '../helper/routes';

const CATEGORIES = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rawProducts, setRawProducts] = useState([]);
  const [favKeys, setFavKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const userId = auth().currentUser?.uid || null;

  // ✅ helper to validate products
  const isValidProduct = (product) => {
    if (!product || typeof product !== 'object') return false;
    if (!product.name || !product.price || !product.image) return false;
    return true;
  };

  // 1) Fetch products
  useEffect(() => {
    let isMounted = true;

    const fetchProducts = async () => {
      setLoading(true);
      try {
        const path = getCategoryPath(selectedCategory);
        const snapshot = await database().ref(path).once('value');

        if (!snapshot.exists()) {
          if (isMounted) setRawProducts([]);
          return;
        }

        const data = snapshot.val();
        const list = [];

        if (selectedCategory === 'All') {
          Object.entries(data || {}).forEach(([categoryName, subcats]) => {
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
                } else {
                  console.warn('🚨 Skipped invalid product', {
                    categoryName,
                    subCatName,
                    firebaseId,
                    product,
                  });
                }
              });
            });
          });
        } else {
          Object.entries(data || {}).forEach(([subCatName, productsObj]) => {
            Object.entries(productsObj || {}).forEach(([firebaseId, product]) => {
              if (isValidProduct(product)) {
                list.push({
                  ...product,
                  id: `${selectedCategory}_${subCatName}_${firebaseId}`,
                  firebaseId,
                  category: selectedCategory,
                  subCategory: subCatName,
                });
              } else {
                console.warn('🚨 Skipped invalid product', {
                  category: selectedCategory,
                  subCatName,
                  firebaseId,
                  product,
                });
              }
            });
          });
        }

        if (isMounted)
           setRawProducts(list);
          dispatch(setProducts(list));
      } catch (error) {
        console.error('🔥 Firebase fetch error:', error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProducts();
    return () => {
      isMounted = false;
    };
  }, [selectedCategory , dispatch]);

  // 2) Subscribe to favorites
  useEffect(() => {
    if (!userId) {
      setFavKeys(new Set());
      return;
    }
    const ref = database().ref(`users/${userId}/favorites`);
    const listener = ref.on('value', (snap) => {
      if (!snap.exists()) {
        setFavKeys(new Set());
      } else {
        const obj = snap.val(); // { "Mens|Shirts|prod123": true }
        setFavKeys(new Set(Object.keys(obj).filter((k) => obj[k])));
      }
    });
    return () => ref.off('value', listener);
  }, [userId]);

  // 3) Merge favorite status
  const products = useMemo(() => {
    return rawProducts.map((p) => {
      const key = productKeyOf(p.category, p.subCategory, p.firebaseId);
      return { ...p, isFavourite: favKeys.has(key) };
    });
  }, [rawProducts, favKeys]);

  // 4) Handle product click
  const handleProductPress = useCallback(
    (product) =>
      navigation.navigate(ROUTES.PRODUCT_DETAIL, {
        product,
        category: selectedCategory,
      }),
    [navigation, selectedCategory]
  );

  // 5) Toggle favorites
  const handleToggleFavourite = useCallback(
    async (product) => {
      if (!userId) {
        Alert.alert('Login required', 'Please sign in to save favorites.');
        return;
      }
      const favKey = productKeyOf(product.category, product.subCategory, product.firebaseId);
      const favRef = database().ref(`users/${userId}/favorites/${favKey}`);

      try {
        if (product.isFavourite) {
          await favRef.remove();
        } else {
          await favRef.set(true);
        }
      } catch (e) {
        console.error('Favorite toggle error:', e);
        Alert.alert('Error', 'Could not update favorite. Please try again.');
      }
    },
    [userId]
  );

  // 6) Render
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
