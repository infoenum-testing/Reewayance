import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import Trash from '../assets/images/trash.png';
import RightArrow from '../assets/images/arrowRight.png';
import { ROUTES } from '../helper/routes';
import Header from '../components/Header';

const CartScreen = () => {
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const ref = database().ref(`users/${userId}/cart`);
    const cb = snap => {
      if (snap.exists()) setItems(Object.values(snap.val()));
      else setItems([]);
    };
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [userId]);

  const subtotal = useMemo(
    () => items.reduce((s, it) => s + it.price * it.quantity, 0),
    [items],
  );
  const shipping = items.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  const updateQty = (it, next) =>
    database()
      .ref(`users/${userId}/cart/${it.id}_${it.selectedSize}`)
      .update({ quantity: next });

  const inc = it => updateQty(it, it.quantity + 1);
  const dec = it =>
    it.quantity > 1 ? updateQty(it, it.quantity - 1) : remove(it);
  const remove = it =>
    database().ref(`users/${userId}/cart/${it.id}_${it.selectedSize}`).remove();

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <View style={styles.cartTop}>
          <Text style={styles.itemName}>{item.name}</Text>
          <TouchableOpacity onPress={() => remove(item)}>
            <Image source={Trash} style={styles.trashIcon} />
          </TouchableOpacity>
        </View>
        <Text style={styles.itemSize}>Size {item.selectedSize}</Text>
        <View style={styles.cartTop}>
          <Text style={styles.itemPrice}>${item.price}</Text>
          <View style={styles.quantityContainer}>
            <TouchableOpacity
              onPress={() => dec(item)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyNumber}>{item.quantity}</Text>
            <TouchableOpacity
              onPress={() => inc(item)}
              style={styles.qtyButton}
            >
              <Text style={styles.qtyText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={'My Cart'} />

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={it => `${it.id}_${it.selectedSize}`}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20, flexGrow: 1 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Image
              source={require('../assets/images/emptyCart.png')}
              style={styles.emptyImage}
            />
            <Text style={styles.emptyTitle}>Your Cart Is Empty!</Text>
            <Text style={styles.emptySubtitle}>
              When you add products, they’ll appear here.
            </Text>
          </View>
        }
        ListFooterComponent={
          items.length > 0 && (
            <View style={styles.summary}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Sub-total</Text>
                <Text style={styles.summaryText}>${subtotal.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>VAT (%)</Text>
                <Text style={styles.summaryText}>$0.00</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryText}>Shipping fee</Text>
                <Text style={styles.summaryText}>${shipping}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.totalText}>Total</Text>
                <Text style={styles.totalText}>${total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkOutButton}
                onPress={() => navigation.navigate(ROUTES.CHECKOUT_SCREEN)}
              >
                <Text style={styles.checkoutText}>Go To Checkout</Text>
                <Image source={RightArrow} style={styles.deleteIcon} />
              </TouchableOpacity>
            </View>
          )
        }
      />
    </SafeAreaView>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  trashIcon: { width: 15, height: 15, tintColor: 'red' },
  cartItem: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 10,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  cartTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  itemImage: { width: 79, height: 83, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemSize: { fontSize: 14, color: 'gray', marginVertical: 2 },
  itemPrice: { fontSize: 15, fontWeight: 'bold' },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 3,
  },
  qtyButton: { paddingHorizontal: 6, paddingVertical: 2 },
  qtyText: { fontSize: 18, fontWeight: '600' },
  qtyNumber: { fontSize: 16, marginHorizontal: 6 },
  deleteIcon: { fontSize: 18, color: 'red', marginLeft: 6 },
  summary: {
    marginHorizontal: 30,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 2,
  },
  summaryText: { fontSize: 15, color: '#333', paddingVertical: 10 },
  totalText: { fontSize: 17, fontWeight: 'bold' },
  checkOutButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  checkoutText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginRight: 15,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    paddingHorizontal: 20,
  },
  emptyImage: {
    width: 100,
    height: 100,
    tintColor: 'gray',
    marginBottom: 20,
    resizeMode: 'contain',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  emptySubtitle: { fontSize: 14, color: 'gray', textAlign: 'center' },
});
