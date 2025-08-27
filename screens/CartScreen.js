import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const CartScreen = () => {
  const navigation = useNavigation();

  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      name: 'Regular Fit Slogan',
      size: 'L',
      price: 1190,
      quantity: 2,
      //   image: require('../assets/images/shirt1.png'),
    },
    {
      id: '2',
      name: 'Regular Fit Polo',
      size: 'M',
      price: 1100,
      quantity: 1,
      //   image: require('../assets/images/shirt2.png'),
    },
    {
      id: '3',
      name: 'Regular Fit Black',
      size: 'L',
      price: 1290,
      quantity: 1,
      //   image: require('../assets/images/shirt3.png'),
    },
  ]);

  const increaseQuantity = id => {
    setCartItems(
      cartItems.map(item =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    );
  };

  const decreaseQuantity = id => {
    setCartItems(
      cartItems.map(item =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item,
      ),
    );
  };

  const removeItem = id => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );
  const shipping = 80;
  const total = subtotal + shipping;

  const renderItem = ({ item }) => (
    <View style={styles.cartItem}>
      <Image source={item.image} style={styles.itemImage} />
      <View style={{ flex: 1, marginLeft: 10 }}>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemSize}>Size {item.size}</Text>
        <Text style={styles.itemPrice}>$ {item.price}</Text>
      </View>

      <View style={styles.quantityContainer}>
        <TouchableOpacity
          onPress={() => decreaseQuantity(item.id)}
          style={styles.qtyButton}
        >
          <Text style={styles.qtyText}>-</Text>
        </TouchableOpacity>
        <Text style={styles.qtyNumber}>{item.quantity}</Text>
        <TouchableOpacity
          onPress={() => increaseQuantity(item.id)}
          style={styles.qtyButton}
        >
          <Text style={styles.qtyText}>+</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => removeItem(item.id)}>
        <Text style={styles.deleteIcon}>🗑️</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Arrow} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity>
            <Image source={NotificationIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>

        {/* Cart Items */}
        <FlatList
          data={cartItems}
          renderItem={renderItem}
          keyExtractor={item => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
        />

        <View style={styles.summary}>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Sub-total</Text>
            <Text style={styles.summaryText}>$ {subtotal}</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>VAT (%)</Text>
            <Text style={styles.summaryText}>$ 0.00</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Shipping fee</Text>
            <Text style={styles.summaryText}>$ {shipping}</Text>
          </View>
          <View style={[styles.summaryRow, { marginTop: 5 }]}>
            <Text style={styles.totalText}>Total</Text>
            <Text style={styles.totalText}>$ {total}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.checkOutButton}>
          <Text style={styles.checkoutText}>Go To Checkout →</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },

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
  itemImage: { width: 60, height: 60, borderRadius: 8 },
  itemName: { fontSize: 16, fontWeight: '600' },
  itemSize: { fontSize: 14, color: 'gray', marginVertical: 2 },
  itemPrice: { fontSize: 15, fontWeight: 'bold' },

  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 3,
  },
  qtyButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
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
  
  summaryText: { 
    fontSize: 15,
     color: '#333',
     paddingVertical: 10,
     },

  totalText: { 
    fontSize: 17, 
    fontWeight: 'bold'
 },

  checkOutButton: {
    backgroundColor: 'black',
    paddingVertical: 15,
    alignItems: 'center',
    marginHorizontal: 20,
    borderRadius: 8,
    marginBottom: 20,
  },
  checkoutText: { fontSize: 16, fontWeight: 'bold', color: 'white' },
});

export default CartScreen;
