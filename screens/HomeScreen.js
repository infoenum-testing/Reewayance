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

// Components
import Header from "../components/HomeHeader";
import SearchBar from "../components/SearchBar";
import CategoryList from "../components/CategoryList";
import ProductCard from "../components/ProductCard";

// Assets
import Notification from "../assets/images/vector.png";
import Filter from "../assets/images/filter.png";
import Search from "../assets/images/search.png";
import Heart from "../assets/images/heart.png";

// Utils
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
        // Merge all subcategories
        Object.values(data).forEach((subcats) => {
          Object.values(subcats).forEach((subcat) => {
            Object.entries(subcat).forEach(([id, product]) =>
              list.push({ id, ...product })
            );
          });
        });
      } else {
        // Selected category only
        Object.values(data).forEach((subcat) => {
          Object.entries(subcat).forEach(([id, product]) =>
            list.push({ id, ...product })
          );
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
    (product) => navigation.navigate(ROUTES.PRODUCT_DETAIL, { 
      product,
      category: selectedCategory,
     }),
    [navigation, selectedCategory]
  );

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
                keyExtractor={(item , index ) => index.toString()}
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
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={Heart}
              onPress={() => handleProductPress(item)}
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
