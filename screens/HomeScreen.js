// screens/HomeScreen.js
import React, { useState, useEffect } from "react";
import { View, FlatList, StyleSheet } from "react-native";
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

const categories = ["All", "Mens", "Womens", "Kids", "Unisex"];

const HomeScreen = ({ navigation }) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const path = getCategoryPath(selectedCategory);
    const ref = database().ref(path);

    const onValueChange = ref.on("value", (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        let list = [];

        // Case 1: All → merge all main + subcategories
        if (selectedCategory === "All") {
          Object.keys(data).forEach((mainCat) => {
            const subcats = data[mainCat];
            Object.keys(subcats).forEach((subcatKey) => {
              const subcat = subcats[subcatKey];
              Object.keys(subcat).forEach((productKey) => {
                list.push({ id: productKey, ...subcat[productKey] });
              });
            });
          });
        }
        // Case 2: Main category (Mens/Womens/Kids/Unisex)
        else {
          Object.keys(data).forEach((subcatKey) => {
            const subcat = data[subcatKey];
            Object.keys(subcat).forEach((productKey) => {
              list.push({ id: productKey, ...subcat[productKey] });
            });
          });
        }

        setProducts(list);
      } else {
        setProducts([]);
      }
    });

    return () => ref.off("value", onValueChange);
  }, [selectedCategory]);

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <Header title="Discover" rightIcon={Notification} />
        <SearchBar searchIcon={Search} filterIcon={Filter} />
        <CategoryList
          categories={categories}
          selectedCategory={selectedCategory}
          onSelect={setSelectedCategory}
        />

        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              HeartIcon={Heart}
              onPress={() =>
                navigation.navigate("ProductDetailScreen", { product: item })
              }
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
});
