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
  const [searchText, setSearchText] = useState("");

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

  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products;
    return products.filter((item) =>
      item.name.toLowerCase().includes(searchText.toLowerCase())
    );
  }, [searchText, products]);

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
        <Header title="Discover" rightIcon={Notification} />

        <SearchBar
          searchIcon={Search}
          filterIcon={Filter}
          value={searchText}
          onChangeText={setSearchText}
        />

        {searchText.length > 0 && (
          <View style={styles.dropdown}>
            {filteredProducts.length > 0 ? (
              <FlatList
                data={filteredProducts}
                keyExtractor={(item) => item.id?.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.dropdownItem}
                    onPress={() => {
                      setSearchText("");
                      handleProductPress(item);
                    }}
                  >
                    <Text style={styles.dropdownText}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={styles.noResult}>No results found</Text>
            )}
          </View>
        )}

        <CategoryList
          categories={CATEGORIES}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <FlatList
          data={filteredProducts}
          keyExtractor={(item, index) => item.id ?? `grid-${index}`}
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
