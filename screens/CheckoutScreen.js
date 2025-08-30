import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import Location from '../assets/images/location.png';
import cash from '../assets/images/cash.png';
import apple from '../assets/images/applePay.png';
import paymentMethods from "../assets/accountImages/cardImage.png";
import VisaIcon from "../assets/images/visa.png";
import EditIcon from "../assets/images/edit.png";

const CheckoutScreen = () => {

  const navigation = useNavigation();
  const cartItems = useSelector(state => state.cart.items);

    const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = cartItems.length > 0 ? 80 : 0;
  const total = subtotal + shipping;

  
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Arrow} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <Image source={NotificationIcon} style={styles.headerIcon} />
      </View>

      {/* Delivery Address */}
      <View style={styles.section}>
        <View style={styles.sectionTop}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <Text style={styles.link}>Change</Text>
        </View>
        <View style={styles.row}>
          <Image source={Location} style={styles.iconSmall} />
          <Text style={styles.bold}>Home</Text>
        </View>
        <Text style={styles.subText}>
          925 S Chugach St #APT 10, Alaska 99645
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
          <Text style={styles.subText}>${subtotal}</Text>
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
          <Text style={styles.totalText}>${total}</Text>
        </View>

        {/* Promo Code */}
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
      )
    }
      {/* Place Order Button */}
      <TouchableOpacity style={styles.placeOrderButton}>
        <Text style={styles.placeOrderText}>Place Order</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerTitle: { fontSize: 18, fontWeight: '600' },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },

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
  sectionTitle: { fontSize: 15, fontWeight: '600' },
  link: { fontSize: 14, color: '#000', textDecorationLine: 'underline' },

  row: { flexDirection: 'row', alignItems: 'center', marginTop: 4 },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 4,
  },
  bold: { fontSize: 14, fontWeight: 'bold', marginLeft: 6 },
  subText: { fontSize: 13, color: '#555' },

  iconSmall: { width: 14, height: 14 },
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
});

export default CheckoutScreen;
