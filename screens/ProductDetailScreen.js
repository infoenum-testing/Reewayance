// screens/ProductDetails.js
import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import database from "@react-native-firebase/database";

// Assets
import HeartIcon from "../assets/images/heart.png";
import BackIcon from "../assets/backButtonImage.png";

// Utils
import { getCategoryPath } from "../utils/firebasePaths";

//redux
import { useDispatch } from 'react-redux';
import { addToCart } from "../src/redux/slices/cartSlice";

const SIZES = ["S", "M", "L", "XL"];
const COLORS = {
  black: "#000",
  white: "#fff",
  gray: "#666",
  orange: "#f97316",
};

console.log("Product");

// 🔹 Suggested Product Card
const SuggestedCard = ({ product, onPress }) => (
  <TouchableOpacity style={styles.suggestedCard} onPress={onPress}>
    <Image source={{ uri: product.image }} style={styles.suggestedImage} />
    <Text numberOfLines={1} style={styles.suggestedName}>
      {product.name}
    </Text>
    <Text style={styles.suggestedPrice}>${product.price}</Text>
  </TouchableOpacity>
);

const ProductDetails = () => {
  const navigation = useNavigation();
  const { params } = useRoute();
  const { product, category } = params;

  const { width, height } = useWindowDimensions();
  const isLandscape = width > height;

  const [selectedSize, setSelectedSize] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const handleGoBack = useCallback(() => navigation.goBack(), [navigation]);
  const dispatch = useDispatch();

const handleAddToCart = useCallback(() => {
  if (!selectedSize) {
    alert("Please select size");
    return;
  }
  dispatch(
    addToCart({
      id: product.id,         // 🔹 unique ID (same as HomeScreen)
      name: product.name,
      price: product.price,
      image: product.image,
      selectedSize,
    })
  );
  alert("Added to cart");
}, [dispatch, product, selectedSize]);


  // 🔹 Fetch suggested products
  useEffect(() => {
    if (!category || category === "All") return;

    const path = getCategoryPath(category);
    const ref = database().ref(path);

    const handleSnapshot = (snapshot) => {
      if (!snapshot.exists()) {
        setSuggestedProducts([]);
        return;
      }

      const data = snapshot.val();
      let list = [];

      Object.values(data).forEach((subcat) => {
        Object.entries(subcat).forEach(([id, item]) => {
          if (id !== product.id) {
            list.push({ id, ...item });
          }
        });
      });

      // ✅ shuffle and take 10
      const shuffled = list.sort(() => 0.5 - Math.random());
      setSuggestedProducts(shuffled.slice(0, 10));
    };

    ref.on("value", handleSnapshot);
    return () => ref.off("value", handleSnapshot);
  }, [category, product.id]);

  const renderSizeOption = useCallback(
    (size) => {
      const isActive = selectedSize === size;
      return (
        <TouchableOpacity
          key={size}
          style={[styles.sizeBtn, isActive && styles.sizeBtnActive]}
          onPress={() => setSelectedSize(size)}
        >
          <Text
            style={[
              styles.sizeText,
              { color: isActive ? COLORS.white : COLORS.black },
            ]}
          >
            {size}
          </Text>
        </TouchableOpacity>
      );
    },
    [selectedSize]
  );

  const ratingText = useMemo(
    () => `⭐ ${product.rating ?? 4.0} (${product.reviews ?? 45} reviews)`,
    [product.rating, product.reviews]
  );

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleGoBack}>
            <Image source={BackIcon} style={styles.icon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Details</Text>
          <TouchableOpacity>
            <Image source={HeartIcon} style={styles.icon} />
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Product Image */}
          <Image source={{ uri: product.image }} style={styles.image} />

          {/* Main Content */}
          <View style={styles.content}>
            <Text style={styles.name}>{product.name}</Text>
            <Text style={styles.rating}>{ratingText}</Text>
            <Text style={styles.desc}>
              {product.description || "No description available."}
            </Text>

            {/* Sizes */}
            <Text style={styles.section}>Choose size</Text>
            <View style={styles.sizeRow}>{SIZES.map(renderSizeOption)}</View>
          </View>

          {/* 🔹 Suggested Products */}
          {suggestedProducts.length > 0 && (
            <View style={{ marginTop: 30, marginLeft: 10 }}>
              <Text style={styles.section}>You may also like</Text>
              <FlatList
                data={suggestedProducts}
                horizontal
                showsHorizontalScrollIndicator={false}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <SuggestedCard
                    product={item}
                    onPress={() =>
                      navigation.push("ProductDetails", {
                        product: item,
                        category,
                      })
                    }
                  />
                )}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                ItemSeparatorComponent={() => <View style={{ width: 12 }} />}
              />
            </View>
          )}
        </ScrollView>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <Text style={styles.price}>${product.price}</Text>
          <TouchableOpacity style={styles.cartBtn} onPress={handleAddToCart}>
            <Text style={styles.cartText}>Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.white },
  scrollContent: { paddingBottom: 20 },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  icon: {
    width: 22,
    height: 22,
    tintColor: COLORS.black,
  },

  image: {
    width: "100%",
    height: 320,
    resizeMode: "contain",
    backgroundColor: "#f9f9f9",
  },

  content: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 6,
  },
  rating: {
    fontSize: 14,
    color: COLORS.orange,
    marginBottom: 12,
  },
  desc: {
    fontSize: 14,
    color: COLORS.gray,
    marginBottom: 20,
    lineHeight: 20,
  },
  section: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },

  sizeRow: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sizeBtn: {
    borderWidth: 1,
    borderColor: COLORS.gray,
    borderRadius: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 10,
  },
  sizeBtnActive: {
    backgroundColor: COLORS.black,
    borderColor: COLORS.black,
  },
  sizeText: {
    fontWeight: "bold",
  },

  // 🔹 Suggested card styles
  suggestedCard: {
    width: 120,
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 8,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  suggestedImage: {
    width: "100%",
    height: 100,
    borderRadius: 8,
    resizeMode: "contain",
  },
  suggestedName: {
    fontSize: 12,
    fontWeight: "500",
    marginTop: 6,
    color: "#333",
  },
  suggestedPrice: {
    fontSize: 13,
    fontWeight: "bold",
    marginTop: 2,
    color: COLORS.black,
  },

  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  price: {
    fontSize: 20,
    fontWeight: "bold",
  },
  cartBtn: {
    backgroundColor: COLORS.black,
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 8,
  },
  cartText: {
    color: COLORS.white,
    fontWeight: "bold",
  },
});
