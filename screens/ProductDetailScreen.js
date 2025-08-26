import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Heart from '../assets/images/heart.png';
import Arrow from '../assets/images/Arrow.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const ProductDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { product } = route.params;

  const [selectedSize, setSelectedSize] = useState(null);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container} >
        <View >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={Arrow} style={styles.heartIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Details</Text>
            <TouchableOpacity>
              <Image source={Heart} style={styles.heartIcon} />
            </TouchableOpacity>
          </View>

          <Image source={{ uri: product.image }} style={styles.image} />
          <View style={styles.content}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.rating}>⭐ 4.0 (45 reviews)</Text>
            <Text style={styles.desc}>
              {product.description || 'No description available.'}
            </Text>

            <Text style={styles.section}>Choose size</Text>
            <View style={styles.sizeRow}>
              {['S', 'M', 'L'].map(size => (
                <TouchableOpacity
                  key={size}
                  style={[
                    styles.sizeBtn,
                    selectedSize === size && styles.sizeBtnActive,
                  ]}
                  onPress={() => setSelectedSize(size)}
                >
                  <Text
                    style={{
                      color: selectedSize === size ? '#fff' : '#000',
                      fontWeight: 'bold',
                    }}
                  >
                    {size}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.bottomRow}>
              <Text style={styles.price}>${product.price}</Text>
              <TouchableOpacity style={styles.cartBtn}>
                <Text style={styles.cartText}>Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  heartIcon: { width: 20, height: 20, tintColor: '#000' },

  image: { width: '100%', height: '60%', resizeMode: 'contain'},
  content: { padding: 16 , paddingBottom: 20},
  name: { fontSize: 20, fontWeight: 'bold' },
  rating: { fontSize: 14, color: 'orange', marginVertical: 6 },
  desc: { fontSize: 14, color: 'gray', marginBottom: 12 },
  section: { fontSize: 16, fontWeight: 'bold', marginBottom: 8 },
  sizeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  sizeBtn: {
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  sizeBtnActive: { backgroundColor: 'black', borderColor: 'black' },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
  },
  price: { fontSize: 20, fontWeight: 'bold' },
  cartBtn: {
    backgroundColor: 'black',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  cartText: { color: '#fff', fontWeight: 'bold' },
});
