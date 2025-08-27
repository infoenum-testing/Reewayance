// screens/HomeScreen.js
import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import database from '@react-native-firebase/database';

// Components
import Header from '../components/HomeHeader';
import SearchBar from '../components/SearchBar';
import CategoryList from '../components/CategoryList';
import ProductCard from '../components/ProductCard';

// Assets
import Notification from '../assets/images/vector.png';
import Filter from '../assets/images/filter.png';
import Search from '../assets/images/search.png';
import Heart from '../assets/images/heart.png';

// Utils
import { getCategoryPath } from '../utils/firebasePaths';

const categories = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const path = getCategoryPath(selectedCategory);
    const ref = database().ref(path);

    const onValueChange = ref.on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let list = [];

        // Case 1: All → merge all main + subcategories
        if (selectedCategory === 'All') {
          Object.keys(data).forEach(mainCat => {
            const subcats = data[mainCat];
            Object.keys(subcats).forEach(subcatKey => {
              const subcat = subcats[subcatKey];
              Object.keys(subcat).forEach(productKey => {
                list.push({ id: productKey, ...subcat[productKey] });
              });
            });
          });
        }
        // Case 2: Main category (Mens/Womens/Kids/Unisex)
        else {
          Object.keys(data).forEach(subcatKey => {
            const subcat = data[subcatKey];
            Object.keys(subcat).forEach(productKey => {
              list.push({ id: productKey, ...subcat[productKey] });
            });
          });
        }

        setProducts(list);
        setFilteredProducts(list); // by default sab products dikhao
      } else {
        setProducts([]);
        setFilteredProducts([]);
      }
    });

    return () => ref.off('value', onValueChange);
  }, [selectedCategory]);

  // 🔍 Search function
  const handleSearch = text => {
    setSearchText(text);
    if (text.trim().length > 0) {
      const results = products.filter(item =>
        item.name.toLowerCase().includes(text.toLowerCase()),
      );
      setFilteredProducts(results);
    } else {
      setFilteredProducts(products);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Discover" rightIcon={Notification} />

        {/* ✅ SearchBar me text state pass kar do */}
        <SearchBar
          searchIcon={Search}
          filterIcon={Filter}
          value={searchText}
          onChangeText={handleSearch}
        />

        {/* ⬇️ Dropdown Results (only when typing) */}
        {searchText.length > 0 && (
          <View style={styles.dropdown}>
            {filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item, index) =>
                  item.id ? item.id.toString() : `dropdown-${index}`
                }
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSearchText(''); // clear search
                      navigation.navigate('ProductDetailScreen', {
                        product: item,
                      });
                    }}
                  >
                    <Text style={styles.dropdownText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noResult}>No results found</Text>
            )}
          </View>
        )}

        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) =>
            item.id ? item.id.toString() : `grid-${index}`
          }
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={Heart}
              onPress={() =>
                navigation.navigate('ProductDetailScreen', { product: item })
              }
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingHorizontal: 16 },
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
  dropdownText: {
    fontSize: 16,
    color: '#333',
  },
  noResult: {
    padding: 12,
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});
