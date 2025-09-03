// screens/HomeScreen.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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

import { getCategoryPath } from '../utils/firebasePaths';
import { ROUTES } from '../helper/routes';

const CATEGORIES = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const path = getCategoryPath(selectedCategory);
        const snapshot = await database().ref(path).once('value');

        if (!snapshot.exists()) {
          setProducts([]);
          return;
        }

        const data = snapshot.val();
        const list = [];

        if (selectedCategory === 'All') {
          Object.entries(data).forEach(([categoryName, subcats]) => {
            Object.entries(subcats).forEach(([subCatName, products]) => {
              Object.entries(products).forEach(([id, product]) => {
                list.push({
                  ...product, // spread first
                  id: `${categoryName}_${subCatName}_${id}`, // FlatList ID
                  firebaseId: id, // Firebase node ID
                  category: categoryName,
                  subCategory: subCatName,
                });
              });
            });
          });
        } else {
          Object.entries(data).forEach(([subCatName, products]) => {
            Object.entries(products).forEach(([id, product]) => {
              list.push({
                ...product,
                id: `${selectedCategory}_${subCatName}_${id}`,
                firebaseId: id,
                category: selectedCategory,
                subCategory: subCatName,
              });
            });
          });
        }

        setProducts(list);
      } catch (error) {
        console.error('🔥 Firebase fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // 🔹 Product detail navigation
  const handleProductPress = useCallback(
    product =>
      navigation.navigate(ROUTES.PRODUCT_DETAIL, {
        product,
        category: selectedCategory,
      }),
    [navigation, selectedCategory],
  );

  // 🔹 Toggle favourite
  const handleToggleFavourite = useCallback(product => {
    const productRef = database().ref(
      `categories/${product.category}/${product.subCategory}/${product.firebaseId}`,
    );

    // strip out client-only fields
    const { id, firebaseId, category, subCategory, ...productData } = product;

    productRef.set({
      ...productData,
      isFavourite: !product.isFavourite,
    });

    setProducts(prevProducts =>
      prevProducts.map(item =>
        item.id === product.id
          ? { ...item, isFavourite: !item.isFavourite }
          : item,
      ),
    );
  }, []);

  // 🔹 Render item
  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        HeartIcon={item.isFavourite ? HeartFill : Heart}
        onPress={() => handleProductPress(item)}
        onToggleFavourite={handleToggleFavourite}
      />
    ),
    [handleProductPress, handleToggleFavourite],
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="Discover" rightIcon={Notification} />

        {/* SearchBar → opens SearchScreen */}
        <SearchBar
          searchIcon={Search}
          filterIcon={Filter}
          value={''}
          onPress={() =>
            navigation.navigate(ROUTES.SEARCH_SCREEN, { products })
          }
        />

        {/* Category Tabs */}
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Products Grid */}
        {loading ? (
          <View style={styles.loaderWrapper}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : (
          <FlatList
            data={products}
            keyExtractor={item => item.id} // ✅ fixed
            renderItem={renderItem}
            numColumns={2}
            removeClippedSubviews={true}
            initialNumToRender={10}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 80 }}
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
