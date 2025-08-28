// screens/HomeScreen.js
import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import database from "@react-native-firebase/database";

import Header from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";

import Notification from "../assets/images/vector.png";
import Filter from "../assets/images/filter.png";
import Search from "../assets/images/search.png";
import Heart from "../assets/images/heart.png";

import { getCategoryPath } from "../utils/firebasePaths";
import { ROUTES } from "../helper/routes";

const CATEGORIES = ["All", "Mens", "Womens", "Kids", "Unisex"];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);


  // Fetch products from Firebase
  useEffect(() => {
    const path = getCategoryPath(selectedCategory);
    const ref = database().ref(path);

    const handleSnapshot = (snapshot) => {
      if (!snapshot.exists()) {
        setProducts([]);
        return;
      }

      const data = snapshot.val();
      const list = [];

      if (selectedCategory === "All") {
        Object.entries(data).forEach(([categoryName, subcats]) => {
          Object.entries(subcats).forEach(([subCatName, products]) => {
            Object.entries(products).forEach(([id, product]) => {
              list.push({
                id: `${categoryName}_${subCatName}_${id}`, // 🔹 unique ID
                ...product,
                category: categoryName,
                subCategory: subCatName,
              });
            });
          });
        });
      } else {
        Object.entries(data).forEach(([subCatName, products]) => {
          Object.entries(products).forEach(([id, product]) => {
            list.push({
              id: `${selectedCategory}_${subCatName}_${id}`, // 🔹 unique ID
              ...product,
              category: selectedCategory,
              subCategory: subCatName,
            });
          });
        });
      }

      setProducts(list);
    };

    ref.on("value", handleSnapshot);
    return () => ref.off("value", handleSnapshot);
  }, [selectedCategory]);

  // Product detail navigation
  const handleProductPress = useCallback(
    (product) =>
      navigation.navigate(ROUTES.PRODUCT_DETAIL, {
        product,
        category: selectedCategory,
      }),
    [navigation, selectedCategory]
  );

const handleToggleFavourite = (product) => {
  const productRef = database().ref(
    `categories/${product.category}/${product.subCategory}/${product.id}`
  );

  productRef.set({
    ...product,
    isFavourite: !product.isFavourite,
  });

  setProducts((prevProducts) =>
    prevProducts.map((item) =>
      item.id === product.id
        ? { ...item, isFavourite: !item.isFavourite }
        : item
    )
  );
};

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <Header title="Discover" rightIcon={Notification} />

        {/* SearchBar → tap kare toh SearchScreen */}
        <SearchBar
          searchIcon={Search}
          filterIcon={Filter}
          value={""}
          onPress={() => navigation.navigate(ROUTES.SEARCH_SCREEN, { products })}
        />

        {/* Category Tabs */}
        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Products Grid */}
        <FlatList
          data={products}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={Heart}
              onPress={() => handleProductPress(item)}
              onToggleFavourite={handleToggleFavourite}
            />
          )}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          contentContainerStyle={{ paddingBottom: 80 }}
        />
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", paddingHorizontal: 16 },

  dropdown: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 6,
    marginVertical: 6,
    maxHeight: 150,
    zIndex: 10,
  },
  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  dropdownText: { fontSize: 16, color: "#333" },
  noResult: {
    padding: 12,
    fontSize: 14,
    color: "gray",
    textAlign: "center",
  },
});
