import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import database from '@react-native-firebase/database';
import Notification from '../assets/images/Vector.png';
import Filter from '../assets/images/Button.png';
import Search from '../assets/images/Search.png';
import Heart from '../assets/images/heart.png';

const categories = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let path = '/categories/mens/mensPants'; 

    if (selectedCategory === 'Mens') {
      path = '/categories/mens/mensPants';
    } else if (selectedCategory === 'Womens') {
      path = '/categories/womens/womensKurti';
    } else if (selectedCategory === 'Kids') {
      path = '/categories/kids/kidsCloths';
    } else if (selectedCategory === 'Unisex') {
      path = '/categories/unisex/bags';
    }

    const ref = database().ref(path);

    const onValueChange = ref.on('value', snapshot => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        const list = Object.keys(data).map(key => ({
          id: data[key].id || key,
          ...data[key],
        }));
        setProducts(list);
      } else {
        setProducts([]);
      }
    });

    return () => ref.off('value', onValueChange);
  }, [selectedCategory]); 


  const renderCategory = item => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item && styles.categoryButtonActive,
      ]}
      onPress={() => setSelectedCategory(item)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === item && styles.categoryTextActive,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate('ProductDetailScreen', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <TouchableOpacity style={styles.heartIcon}>
        <Image source={Heart} style={styles.HeartIcon} />
      </TouchableOpacity>
      <Text style={styles.productName}>{item.name}</Text>
      <View style={styles.priceRow}>
        <Text style={styles.productPrice}>${item.price}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Discover</Text>
          <Image source={Notification} style={styles.headerIcon} />
        </View>

        {/* Search Row */}
        <View style={styles.searchRow}>
          <View style={styles.searchContainer}>
            <Image source={Search} style={styles.searchIcon} />
            <TextInput
              placeholder="Search for clothes..."
              style={styles.searchInput}
            />
          </View>

          <TouchableOpacity style={styles.filterButton}>
            <Image
              source={Filter}
              style={{ width: 50, height: 30 , backgroundColor: 'black' }}
            />
          </TouchableOpacity>
        </View>

        {/* Categories */}
        <View style={styles.categories}>
          {categories.map(cat => renderCategory(cat))}
        </View>

        {/* Product List */}
        <FlatList
          data={products}
          keyExtractor={item => item.id.toString()}
          renderItem={renderProduct}
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

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    marginBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: 'bold' },
  headerIcon: { width: 22, height: 22, resizeMode: 'contain' },

  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: '#888',
    marginRight: 6,
  },
  HeartIcon: {
    width: 20,
    height: 20,
    tintColor: '#888',
    marginRight: 2,
    marginTop: 2
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    backgroundColor: 'black',
    borderRadius: 10,
    padding: 12,
    marginLeft: 10,
  },

  categories: {
    flexDirection: 'row',
    marginVertical: 15,
  },
  categoryButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryButtonActive: { backgroundColor: '#000', borderColor: '#000' },
  categoryText: { fontSize: 14, color: '#000' },
  categoryTextActive: { color: '#fff' },

  productCard: {
    backgroundColor: '#fff',
    width: '48%',
    borderRadius: 12,
    marginBottom: 15,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  productImage: { width: '100%', height: 150, borderRadius: 10 },
  heartIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    backgroundColor: '#fff',
    padding: 5,
    borderRadius: 20,
  },
  productName: { marginTop: 8, fontSize: 14, fontWeight: '500' },
  priceRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  productPrice: { fontSize: 14, fontWeight: 'bold' },
});
