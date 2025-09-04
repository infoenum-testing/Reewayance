import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import AppButton from '../components/AppButton';
import Header from '../components/Header';
import Heart from '../assets/images/heart.png';
import HeartFill from '../assets/images/heartFill.png';
import { getCategoryPath } from '../utils/firebasePaths';
import { productKeyOf } from '../utils/firebasePaths';

const SIZES = ['S', 'M', 'L', 'XL'];

const ProductDetailScreen = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { product, category } = params;

  const userId = auth().currentUser?.uid || null;

  const [selectedSize, setSelectedSize] = useState(null);
  const [suggested, setSuggested] = useState([]);
  // const [isFavourite, setIsFavourite] = useState(!!product?.isFavourite);
  const [modalVisible, setModalVisible] = useState(false);

  // Build a robust key regardless of how product was passed

  const resolvedCategory = product.category || category;
  const resolvedSubCat = product.subCategory;
  const resolvedId = product.firebaseId;
  const favKey = productKeyOf(resolvedCategory, resolvedSubCat, resolvedId);

  const [isFavourite, setIsFavourite] = useState(false);

  useEffect(() => {
    if (!userId || !favKey) return;
    const ref = database().ref(`users/${userId}/favorites/${favKey}`);
    const cb = snap => setIsFavourite(!!snap.val());
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [userId, favKey]);

  // 2) Toggle favorite
  const toggleFavourite = useCallback(async () => {
    if (!userId) {
      Alert.alert('Login required', 'Please sign in to save favorites.');
      return;
    }
    const ref = database().ref(`users/${userId}/favorites/${favKey}`);
    try {
      if (isFavourite) {
        await ref.remove();
      } else {
        await ref.set(true);
      }
    } catch (e) {
      console.error('toggleFavourite error:', e);
      Alert.alert('Error', 'Could not update favorite.');
    }
  }, [userId, favKey, isFavourite]);

  // 3) “You may also like” (same as before)
  useEffect(() => {
    if (!resolvedCategory || resolvedCategory === 'All') return;
    const path = getCategoryPath(resolvedCategory);
    const ref = database().ref(path);

    const cb = snap => {
      if (!snap.exists()) {
        setSuggested([]);
        return;
      }
      const data = snap.val();
      const list = [];

      Object.entries(data).forEach(([subCatName, productsObj]) => {
        Object.entries(productsObj).forEach(([fid, item]) => {
          if (!item || typeof item !== 'object') {
            console.warn('Invalid product skipped:', fid, item);
            return;
          }
          if (!item.name || !item.price || !item.image) {
            console.warn('Skipping incomplete product:', fid, item);
            return;
          }

          const isSame = fid === resolvedId && subCatName === resolvedSubCat;
          if (!isSame) {
            list.push({
              ...item,
              id: `${resolvedCategory}_${subCatName}_${fid}`,
              firebaseId: fid,
              category: resolvedCategory,
              subCategory: subCatName,
            });
          }
        });
      });

      setSuggested(list.sort(() => 0.5 - Math.random()).slice(0, 10));
    };

    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [resolvedCategory, resolvedSubCat, resolvedId]);

  const ratingText = useMemo(
    () => `⭐ ${product.rating ?? 4.0} (${product.reviews ?? 45} reviews)`,
    [product.rating, product.reviews],
  );

  // 4) Add to cart (unchanged; still under users/{uid}/cart/*)
  const handleAddToCart = useCallback(async () => {
    if (!selectedSize) {
      Alert.alert('Select size', 'Please select a size first.');
      return;
    }
    if (!userId) {
      Alert.alert('Login required', 'Please sign in to add to cart.');
      return;
    }
    const key = `${resolvedId}_${selectedSize}`;
    const cartRef = database().ref(`users/${userId}/cart/${key}`);

    const snap = await cartRef.once('value');
    if (snap.exists()) {
      const q = snap.val()?.quantity || 1;
      await cartRef.update({ quantity: q + 1 });
    } else {
      await cartRef.set({
        id: resolvedId,
        name: product.name,
        price: product.price,
        image: product.image,
        selectedSize,
        quantity: 1,
        category: resolvedCategory,
        subCategory: resolvedSubCat,
        firebaseId: resolvedId, // helpful for later
      });
    }
    setModalVisible(true);
  }, [
    selectedSize,
    userId,
    resolvedId,
    resolvedCategory,
    resolvedSubCat,
    product,
  ]);

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        headerTitle={'Details'}
        rightIcon={isFavourite ? HeartFill : Heart}
        onRightPress={toggleFavourite}
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
        <Image source={{ uri: product.image }} style={styles.image} />

        <View style={styles.sectionPad}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text style={styles.name}>{product.name}</Text>
            <TouchableOpacity onPress={toggleFavourite}>
              <Image
                source={isFavourite ? HeartFill : Heart}
                style={{ width: 24, height: 24 }}
              />
            </TouchableOpacity>
          </View>

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
                      category: resolvedCategory,
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

      <Modal
        transparent
        animationType="fade"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Image
              source={require('../assets/images/check.png')}
              style={styles.modalImage}
            />
            <Text style={styles.modalTitle}>Added To Cart!</Text>
            <View style={{ width: '100%', marginTop: 10 }}>
              <AppButton title="Done" onPress={closeModal} color="black" />
              <View style={{ height: 10 }} />
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
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

  // 🔹 Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  modalImage: {
    width: 70,
    height: 70,
    marginBottom: 16,
    resizeMode: 'contain',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 24,
    textAlign: 'center',
  },
});