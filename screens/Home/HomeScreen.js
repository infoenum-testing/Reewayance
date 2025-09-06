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

import Header from '../../components/HomeHeader';
import SearchBar from '../../components/SearchBar';
import CategoryList from '../../components/CategoryList';
import ProductCard from '../../components/ProductCard';

import  Images from '../../constants/images';

import { useDispatch } from 'react-redux';
import { setProducts } from '../../src/redux/slices/productsSlice';

import { getCategoryPath, productKeyOf } from '../../utils/firebasePaths';
import { ROUTES } from '../../helper/routes';

const CATEGORIES = ['All', 'Mens', 'Womens', 'Kids', 'Unisex'];
const PAGE_LIMIT = 10;

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [rawProducts, setRawProducts] = useState([]); // flattened products currently displayed (paginated)
  const [favKeys, setFavKeys] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastKey, setLastKey] = useState(null); // firebaseId of last appended page item (not strictly required for client-side pagination, kept for info)
  const [hasMore, setHasMore] = useState(true);

  const dispatch = useDispatch();
  const userId = auth().currentUser?.uid || null;

  // Track which firebaseIds have already been shown (to avoid duplicates across pages)
  const seenIdsRef = useRef(new Set());
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);


  const isValidProduct = useCallback((product) => {
    if (!product || typeof product !== 'object') return false;
    if (!product.name || !product.price || !product.image) return false;
    return true;
  }, []);

  const flattenProductsFromSnapshot = useCallback((data, category) => {
    const list = [];
    if (!data || typeof data !== 'object') return list;

    if (category === 'All') {
      // { categoryName: { subCatName: { productId: productObj } } }
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
            } else {
              console.warn('Skipped invalid product', { categoryName, subCatName, firebaseId, product });
            }
          });
        });
      });
    } else {
      // { subCatName: { productId: productObj } }
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
          } else {
            console.warn('Skipped invalid product', { category, subCatName, firebaseId, product });
          }
        });
      });
    }

    return list;
  }, [isValidProduct]);

  // --------------------
  // Fetch & paginate (client-side pagination)
  // - For nested structures it's safer to fetch the snapshot, flatten, then paginate client-side.
  // - This keeps behavior predictable across "All" and category-specific paths.
  // --------------------
  const fetchProducts = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) setLoadingMore(true);
        else setLoading(true);

        const path = getCategoryPath(selectedCategory);
        const snapshot = await database().ref(path).once('value');

        if (!snapshot.exists()) {
          if (!isLoadMore) {
            if (isMountedRef.current) setRawProducts([]);
            dispatch(setProducts([]));
          }
          if (isMountedRef.current) {
            setHasMore(false);
            setLoading(false);
            setLoadingMore(false);
          }
          return;
        }

        const data = snapshot.val();
        // Flatten the nested structure into a list of product objects
        let flatList = flattenProductsFromSnapshot(data, selectedCategory);

        // Sort deterministically by firebaseId if available
        flatList.sort((a, b) => {
          const aId = String(a.firebaseId ?? '');
          const bId = String(b.firebaseId ?? '');
          return aId.localeCompare(bId);
        });

        if (!isLoadMore) {
          // reset seen IDs and paging
          seenIdsRef.current = new Set();

          const pageItems = flatList.slice(0, PAGE_LIMIT);

          if (isMountedRef.current) {
            setRawProducts(pageItems);
            // mark as seen
            pageItems.forEach((it) => {
              if (it.firebaseId) seenIdsRef.current.add(it.firebaseId);
            });
            setLastKey(pageItems.length ? pageItems[pageItems.length - 1].firebaseId : null);
            setHasMore(flatList.length > PAGE_LIMIT);
            // Push the full flattened list to Redux (so search/store get full data)
            dispatch(setProducts(flatList));
          }
        } else {
          // load more: take next PAGE_LIMIT items excluding already-seen ids
          const remaining = flatList.filter((it) => !seenIdsRef.current.has(it.firebaseId));
          const pageItems = remaining.slice(0, PAGE_LIMIT);

          if (isMountedRef.current) {
            setRawProducts((prev) => [...prev, ...pageItems]);
            pageItems.forEach((it) => {
              if (it.firebaseId) seenIdsRef.current.add(it.firebaseId);
            });
            setLastKey((prev) => (pageItems.length ? pageItems[pageItems.length - 1].firebaseId : prev));
            setHasMore(remaining.length > PAGE_LIMIT);
            // We already dispatched full flatList on initial load; no need to dispatch again here.
          }
        }
      } catch (error) {
        console.error('🔥 Firebase fetch error:', error);
      } finally {
        if (isLoadMore) setLoadingMore(false);
        else setLoading(false);
      }
    },
    [selectedCategory, flattenProductsFromSnapshot, dispatch]
  );

  // Reset & fetch when category changes
  useEffect(() => {
    setRawProducts([]);
    setLastKey(null);
    setHasMore(true);
    seenIdsRef.current = new Set();

    // Trigger first page fetch
    fetchProducts(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory]);

  useEffect(() => {
    if (!userId) {
      setFavKeys(new Set());
      return;
    }
    const ref = database().ref(`users/${userId}/favorites`);
    const listener = ref.on('value', (snap) => {
      if (!snap.exists()) setFavKeys(new Set());
      else {
        const obj = snap.val() || {};
        const keys = Object.keys(obj).filter((k) => obj[k]);
        setFavKeys(new Set(keys));
      }
    });

    return () => {
      try {
        ref.off('value', listener);
      } catch (e) {
        // ignore cleanup errors
      }
    };
  }, [userId]);

  const products = useMemo(() => {
    return rawProducts.map((p) => {
      const key = productKeyOf(p.category, p.subCategory, p.firebaseId);
      return { ...p, isFavourite: favKeys.has(key) };
    });
  }, [rawProducts, favKeys]);

  const normalizeProductForFav = useCallback((product) => {
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
  }, []);

  const handleToggleFavourite = useCallback(
    async (product) => {
      if (!userId) {
        Alert.alert('Login required', 'Please sign in to save favorites.');
        return;
      }

      const { category, subCategory, firebaseId } = normalizeProductForFav(product);

      if (!firebaseId || !category || !subCategory) {
        console.error('[fav] ❌ Missing key parts for product', {
          product,
          category,
          subCategory,
          firebaseId,
        });
        Alert.alert('Error', 'Could not determine product identifier for favorites. Please try again.');
        return;
      }

      let favKey;
      try {
        favKey = productKeyOf(category, subCategory, firebaseId);
      } catch (err) {
        console.error('[fav] ❌ productKeyOf failed', { err, category, subCategory, firebaseId });
        Alert.alert('Error', 'Could not determine product identifier for favorites. Please try again.');
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
    [userId, normalizeProductForFav]
  );

  const handleProductPress = useCallback(
    (product) =>
      navigation.navigate(ROUTES.PRODUCT_DETAIL, {
        product,
        category: selectedCategory,
      }),
    [navigation, selectedCategory]
  );

  const renderItem = useCallback(
    ({ item }) => (
      <ProductCard
        product={item}
        HeartIcon={item.isFavourite ? Images.HeartFill : Images.Heart}
        onPress={() => handleProductPress(item)}
        onToggleFavourite={handleToggleFavourite}
      />
    ),
    [handleProductPress, handleToggleFavourite]
  );

  const handleLoadMore = () => {
    if (!loadingMore && hasMore && !loading) {
      fetchProducts(true);
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Discover" rightIcon={Images.Notification} />

        <SearchBar
          searchIcon={Images.Search}
          filterIcon={Images.Filter}
          value={''}
          onPress={() => navigation.navigate(ROUTES.SEARCH_SCREEN, { products })}
          editable={false}
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
            keyExtractor={(item) => item.id ?? item.firebaseId ?? Math.random().toString()}
            renderItem={renderItem}
            numColumns={2}
            columnWrapperStyle={{ justifyContent: 'space-between' }}
            contentContainerStyle={{ paddingBottom: 80, flexGrow: 1 }}
            onEndReached={handleLoadMore}
            onEndReachedThreshold={0.5}
            showsVerticalScrollIndicator={false}
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
