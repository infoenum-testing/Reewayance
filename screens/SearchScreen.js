// screens/SearchScreen.js
import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Image,
  Keyboard,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Notification from '../assets/images/vector.png';
import BackIcon from '../assets/backButtonImage.png';

const searchIcon = require('../assets/images/search.png');

const SearchScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Get products from HomeScreen
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const routeProducts = route.params?.products || [];

  const [searchText, setSearchText] = useState('');
  const [recentSearches, setRecentSearches] = useState([]);

  // ✅ Memoize products (eslint dependency fix)
  const products = useMemo(() => routeProducts, [routeProducts]);

  // Load recent searches on mount
  useEffect(() => {
    AsyncStorage.getItem('recentSearches').then(res =>
      setRecentSearches(res ? JSON.parse(res) : []),
    );
  }, []);

  // Save a search term to recent
  const saveRecentSearch = async text => {
    if (!text.trim()) return;
    let updated = [
      text,
      ...recentSearches.filter(s => s.toLowerCase() !== text.toLowerCase()),
    ];
    if (updated.length > 6) updated = updated.slice(0, 6);
    setRecentSearches(updated);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Remove one recent search
  const removeRecentSearch = async idx => {
    const updated = recentSearches.filter((_, i) => i !== idx);
    setRecentSearches(updated);
    await AsyncStorage.setItem('recentSearches', JSON.stringify(updated));
  };

  // Clear all recent searches
  const clearAllRecent = async () => {
    setRecentSearches([]);
    await AsyncStorage.removeItem('recentSearches');
  };

  // ✅ Filtered results with memo
  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return [];
    return products.filter(item =>
      item?.name?.toLowerCase().includes(searchText.toLowerCase()),
    );
  }, [searchText, products]);

  // Handle selecting/searching a recent
  const handleRecentPress = query => {
    setSearchText(query);
    Keyboard.dismiss();
  };

  // Handle selecting a product result
  const handleProductPress = item => {
    saveRecentSearch(item?.name || '');
    setSearchText('');
    navigation.navigate('ProductDetailScreen', { product: item });
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>

        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity>
            <Image source={Notification} style={styles.icon} />
          </TouchableOpacity>
        </View>


        <View style={styles.searchBar}>
          <Image source={searchIcon} style={styles.searchIcon} />
          <TextInput
            style={styles.input}
            placeholder="Search for clothes..."
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
            onSubmitEditing={() => saveRecentSearch(searchText)}
            returnKeyType="search"
          />
        </View>


        {!searchText.trim() && recentSearches.length > 0 && (
          <View>
            <View style={styles.recentHeader}>
              <Text style={styles.recentTitle}>Recent Searches</Text>
              <TouchableOpacity onPress={clearAllRecent}>
                <Text style={styles.clearAll}>Clear all</Text>
              </TouchableOpacity>
            </View>
            {recentSearches.map((item, idx) => (
              <View style={styles.recentItemRow} key={item + idx}>
                <TouchableOpacity
                  style={{ flex: 1 }}
                  onPress={() => handleRecentPress(item)}
                >
                  <Text style={styles.recentItemText}>{item}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => removeRecentSearch(idx)}>
                  <Text style={styles.removeX}>✗</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}


        {!!searchText.trim() &&
          (filteredProducts.length > 0 ? (
            <FlatList
              style={{ marginTop: 8 }}
              data={filteredProducts}
              keyExtractor={(item, i) =>
                item?.id ? item.id.toString() : i.toString()
              }
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.resultRow}
                  onPress={() => handleProductPress(item)}
                >
                  <Image
                    source={{ uri: item?.image }}
                    style={styles.productImage}
                  />
                  <View style={styles.productData}>
                    <Text style={styles.productName}>{item?.name}</Text>
                    <View style={styles.productPriceRow}>
                      <Text style={styles.productPrice}>₹{item?.price}</Text>
                      {item?.discount && (
                        <Text style={styles.productDiscount}>
                          {item.discount}%
                        </Text>
                      )}
                    </View>
                  </View>
                  <Text style={styles.gotoIcon}>↗</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <View style={styles.noResultContainer}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.noResultTitle}>No Results Found!</Text>
              <Text style={styles.noResultSubtitle}>
                Try a similar word or something more general.
              </Text>
            </View>
          ))}
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: 'black',
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 22,
    fontWeight: 'bold',
    color: '#222',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    width: 20,
    height: 20,
    tintColor: '#999',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: '#222',
  },
  recentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 6,
  },
  recentTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#111',
  },
  clearAll: {
    color: '#1976D2',
    fontSize: 14,
    fontWeight: '500',
  },
  recentItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  recentItemText: {
    fontSize: 16,
    color: '#333',
    paddingLeft: 4,
  },
  removeX: {
    color: '#B0B0B0',
    fontSize: 18,
    paddingHorizontal: 8,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  productImage: {
    width: 45,
    height: 45,
    borderRadius: 4,
    marginRight: 14,
    backgroundColor: '#ddd',
  },
  productData: { flex: 1, justifyContent: 'center' },
  productName: {
    fontWeight: '500',
    fontSize: 16,
    marginBottom: 2,
    color: '#1a1a1a',
  },
  productPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 2,
  },
  productPrice: { fontSize: 15, color: '#1976D2', fontWeight: 'bold' },
  productDiscount: { fontSize: 14, color: '#E53935', marginLeft: 6 },
  gotoIcon: { fontSize: 18, color: '#222', marginLeft: 8 },
  noResultContainer: { alignItems: 'center', marginTop: 45 },
  emptyIcon: { fontSize: 48, marginBottom: 16, color: '#bbb' },
  noResultTitle: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#1E1E1E',
    marginBottom: 4,
  },
  noResultSubtitle: {
    color: '#888',
    fontSize: 15,
    textAlign: 'center',
  },
});
