import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import BackIcon from '../assets/backButtonImage.png';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';
import { getCategoryPath } from '../utils/firebasePaths';

const SIZES = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { product, category } = params;

  const [selectedSize, setSelectedSize] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [isFavourite, setIsFavourite] = useState(!!product?.isFavourite);

  const userId = auth().currentUser?.uid;

  // toggle favourite – same pattern as HomeScreen
  const toggleFavourite = useCallback(async () => {
    const ref = database().ref(
      `categories/${product.category || category}/${product.subCategory}/${
        product.id
      }`,
    );
    await ref.set({ ...product, isFavourite: !isFavourite });
    setIsFavourite(v => !v);
  }, [category, isFavourite, product]);

  // add to cart in Firebase
  const handleAddToCart = useCallback(async () => {
    if (!selectedSize) {
      alert('Please select size');
      return;
    }
    if (!userId) {
      alert('Please login first');
      return;
    }
    const key = `${product.id}_${selectedSize}`;
    const cartRef = database().ref(`users/${userId}/cart/${key}`);

    // if already exists, just increment
    const snap = await cartRef.once('value');
    if (snap.exists()) {
      const q = snap.val()?.quantity || 1;
      await cartRef.update({ quantity: q + 1 });
    } else {
      await cartRef.set({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        quantity: 1,
      });
    }
    alert('Added to cart');
  }, [product, selectedSize, userId]);

  // “you may also like”
  useEffect(() => {
    if (!category || category === 'All') return;
    const path = getCategoryPath(category);
    const ref = database().ref(path);

    const cb = snap => {
      if (!snap.exists()) {
        setSuggested([]);
        return;
      }
      const data = snap.val(); // { subCat: { id: product } }
      const list = [];
      Object.values(data).forEach(productsObj => {
        Object.entries(productsObj).forEach(([id, item]) => {
          if (id !== product.id) list.push({ id, ...item });
        });
      });
      // random 10
      setSuggested(list.sort(() => 0.5 - Math.random()).slice(0, 10));
    };

    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [category, product?.id]);

  const ratingText = useMemo(
    () => `⭐ ${product.rating ?? 4.0} (${product.reviews ?? 45} reviews)`,
    [product.rating, product.reviews],
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={BackIcon} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Details</Text>
        <TouchableOpacity onPress={toggleFavourite}>
          <Image
            source={isFavourite ? HeartFill : Heart}
            style={styles.headerIcon}
          />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.sectionPad}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.rating}>{ratingText}</Text>
          <Text style={styles.desc}>
            {product.description || 'No description available.'}
          </Text>

          <Text style={styles.sectionTitle}>Choose size</Text>
          <View style={styles.sizeRow}>
            {SIZES.map(size => {
              const active = selectedSize === size;
              return (
                <TouchableOpacity
                  key={size}
                  onPress={() => setSelectedSize(size)}
                  style={[styles.sizeBtn, active && styles.sizeBtnActive]}
                >
                  <Text style={[styles.sizeText, active && { color: '#fff' }]}>
                    {size}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {suggested.length > 0 && (
          <View style={{ marginTop: 20 }}>
            <Text style={[styles.sectionTitle, { marginLeft: 16 }]}>
              You may also like
            </Text>
            <FlatList
              data={suggested}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={it => it.id}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() =>
                    navigation.push('ProductDetailScreen', {
                      product: item,
                      category,
                    })
                  }
                  style={styles.suggestCard}
                >
                  <Image
                    source={{ uri: item.image }}
                    style={styles.suggestImg}
                  />
                  <Text numberOfLines={1} style={styles.suggestName}>
                    {item.name}
                  </Text>
                  <Text style={styles.suggestPrice}>${item.price}</Text>
                </TouchableOpacity>
              )}
              ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              contentContainerStyle={{ paddingHorizontal: 16 }}
            />
          </View>
        )}
      </ScrollView>

      <View style={styles.bottomRow}>
        <Text style={styles.price}>${product.price}</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
          <Text style={styles.cartText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  image: {
    width: '100%',
    height: 320,
    resizeMode: 'contain',
    backgroundColor: '#f9f9f9',
  },
  sectionPad: { paddingHorizontal: 16, marginTop: 16 },
  name: { fontSize: 22, fontWeight: 'bold', marginBottom: 6 },
  rating: { fontSize: 14, color: '#f97316', marginBottom: 12 },
  desc: { fontSize: 14, color: '#666', lineHeight: 20, marginBottom: 16 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  sizeRow: { flexDirection: 'row', marginBottom: 8 },
  sizeBtn: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  sizeBtnActive: { backgroundColor: '#000', borderColor: '#000' },
  sizeText: { fontWeight: '700', color: '#000' },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  price: { fontSize: 20, fontWeight: 'bold' },
  cartBtn: {
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  cartText: { color: '#fff', fontWeight: 'bold' },
  suggestCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 8,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestImg: {
    width: '100%',
    height: 100,
    borderRadius: 8,
    resizeMode: 'contain',
  },
  suggestName: { fontSize: 12, fontWeight: '500', marginTop: 6, color: '#333' },
  suggestPrice: { fontSize: 13, fontWeight: 'bold', marginTop: 2 },
});
