import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";

const ProductCard = ({ product, onPress, HeartIcon }) => (
  <TouchableOpacity style={styles.card} onPress={onPress}>
    <Image source={{ uri: product.image }} style={styles.image} />

    <TouchableOpacity style={styles.heartIcon}>
      <Image source={HeartIcon} style={styles.heartImage} />
    </TouchableOpacity>

    <Text style={styles.name}>{product.name}</Text>
    <Text style={styles.price}>${product.price}</Text>
  </TouchableOpacity>
);

export default ProductCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: "48%",
    borderRadius: 12,
    marginBottom: 15,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  image: { width: "100%", height: 150, borderRadius: 10, resizeMode: 'contain' },
  heartIcon: {
    position: "absolute",
    top: 15,
    right: 15,
    backgroundColor: "#fff",
    padding: 5,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  heartImage: { width: 20, height: 20, tintColor: "#888"},
  name: { marginTop: 8, fontSize: 14, fontWeight: "500" },
  price: { fontSize: 14, fontWeight: "bold", marginTop: 4 },
});
