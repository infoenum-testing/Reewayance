import React, { useEffect, useMemo, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import Location from '../assets/images/location.png';
import cash from '../assets/images/cash.png';
import apple from '../assets/images/applePay.png';
import paymentMethods from '../assets/accountImages/cardImage.png';
import VisaIcon from '../assets/images/visa.png';
import EditIcon from '../assets/images/edit.png';
import AppButton from '../components/AppButton';
import Header from '../components/Header';

const CheckoutScreen = () => {
  const navigation = useNavigation();
  const userId = auth().currentUser?.uid;

  const [cartItems, setCartItems] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const ref = database().ref(`users/${userId}/cart`);
    const cb = snap => {
      if (snap.exists()) setCartItems(Object.values(snap.val()));
      else setCartItems([]);
    };
    ref.on('value', cb);
    return () => ref.off('value', cb);
  }, [userId]);

  const subtotal = useMemo(
    () => cartItems.reduce((s, it) => s + it.price * it.quantity, 0),
    [cartItems],
  );
  const shipping = cartItems.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (!userId || cartItems.length === 0) return;

    const cartRef = database().ref(`users/${userId}/cart`);
    const orderRef = database().ref(`users/${userId}/orders`).push();
    const snap = await cartRef.once('value');
    if (!snap.exists()) return;

    await orderRef.set({
      items: snap.val(),
      total,
      address: '406 , infoenum software system , apollo square , indore',
      paymentMethod: 'Cash',
      status: 'placed',
      createdAt: new Date().toISOString(),
    });

    await cartRef.remove();
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={'Checkout'} />

      {/* Delivery Address */}
      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.link}>Change</Text>
        </View>
        <View style={styles.row}>
          <Image source={Location} style={styles.iconSmall} />
          <Text style={styles.bold}>Office</Text>
        </View>
        <Text style={styles.subText}>
          406 , infoenum software system , apollo square , indore
        </Text>
      </View>

      {/* Payment Method */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Payment Method</Text>
        <View style={styles.rowBetween}>
          <TouchableOpacity style={styles.paymentButton}>
            <Image source={paymentMethods} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Card</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Image source={cash} style={styles.paymentIcon} />
            <Text style={styles.paymentText}>Cash</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.paymentButton}>
            <Image source={apple} style={styles.appleIcon} />
          </TouchableOpacity>
        </View>

        <View style={styles.cardBox}>
          <Image source={VisaIcon} style={styles.visaIcon} />
          <Text style={styles.cardText}>**** **** **** 2512</Text>
          <TouchableOpacity>
            <Image source={EditIcon} style={styles.editIcon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Order Summary */}
      {cartItems.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.rowBetween}>
            <Text style={styles.subText}>Sub-total</Text>
            <Text style={styles.subText}>${subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subText}>VAT (%)</Text>
            <Text style={styles.subText}>$0.00</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.subText}>Shipping fee</Text>
            <Text style={styles.subText}>${shipping}</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>${total.toFixed(2)}</Text>
          </View>

          <View style={styles.promoRow}>
            <TextInput
              placeholder="Enter promo code"
              style={styles.promoInput}
              placeholderTextColor="#999"
            />
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>

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
            <Text style={styles.modalTitle}>Congratulations!</Text>
            <Text style={styles.modalTitle}>Your order has been placed.</Text>

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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionTitle: { fontSize: 15, fontWeight: '600', marginTop: 5 },
  link: { fontSize: 14, color: '#000', textDecorationLine: 'underline' },

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  bold: { fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  subText: { fontSize: 13, color: '#555', marginTop: 5 },

  iconSmall: { width: 14, height: 14, resizeMode: 'contain' },
  totalText: { fontSize: 15, fontWeight: 'bold' },

  paymentButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 6,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  paymentIcon: { width: 20, height: 20, resizeMode: 'contain', marginRight: 6 },
  appleIcon: { width: 35, height: 20, resizeMode: 'contain' },
  paymentText: { fontSize: 13, fontWeight: '500' },

  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
  },
  visaIcon: { width: 34, height: 20, resizeMode: 'contain' },
  cardText: { flex: 1, marginLeft: 12, fontSize: 14, fontWeight: '500' },
  editIcon: { width: 16, height: 16, tintColor: '#000' },

  promoRow: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 6,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
    height: 44,
    fontSize: 13,
  },
  addButton: {
    backgroundColor: '#000',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 6,
    marginLeft: 8,
  },
  addButtonText: { color: '#fff', fontWeight: '600', fontSize: 13 },

  placeOrderButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 10,
    marginHorizontal: 20,
    marginVertical: 24,
    alignItems: 'center',
  },
  placeOrderText: { color: '#fff', fontSize: 15, fontWeight: '600' },

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

export default CheckoutScreen;
