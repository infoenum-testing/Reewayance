import React, { useEffect, useState, useMemo, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import database from "@react-native-firebase/database";

const TABS = {
  ONGOING: "Ongoing",
  COMPLETED: "Completed",
};

const Icons = {
  back: require("../assets/backButtonImage.png"),
  bell: require("../assets/images/vector.png"),
};

const Header = ({ title, onBackPress }) => (
  <View style={styles.header}>
    <TouchableOpacity onPress={onBackPress}>
      <Image source={Icons.back} style={styles.headerIcon} />
    </TouchableOpacity>
    <Text style={styles.headerTitle}>{title}</Text>
    <TouchableOpacity>
      <Image source={Icons.bell} style={styles.headerIcon} />
    </TouchableOpacity>
  </View>
);

const TabSwitcher = ({ selectedTab, onTabChange }) => (
  <View style={styles.tabContainer}>
    {Object.values(TABS).map((tab) => (
      <TouchableOpacity
        key={tab}
        style={[styles.tab, selectedTab === tab && styles.activeTab]}
        onPress={() => onTabChange(tab)}
      >
        <Text
          style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
        >
          {tab}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

// 🔹 Order Card Component
const OrderCard = ({ item, isOngoing }) => (
  <View style={styles.card}>
    <Image source={{ uri: item.image }} style={styles.productImage} />

    <View style={{ flex: 1 }}>
      <Text style={styles.productName}>{item.name}</Text>
      <Text style={styles.productSize}>Size {item.size || "M"}</Text>
      <Text style={styles.price}>${item.price}</Text>
    </View>

    <View style={styles.rightSection}>
      {isOngoing ? (
        <>
          <Text style={styles.status}>In Transit</Text>
          <TouchableOpacity style={styles.trackButton}>
            <Text style={styles.trackText}>Track Order</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={styles.completedStatus}>Completed</Text>
          {item.rating ? (
            <Text style={styles.ratingText}>⭐ {item.rating}/5</Text>
          ) : (
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewText}>Leave Review</Text>
            </TouchableOpacity>
          )}
        </>
      )}
    </View>
  </View>
);

const MyOrdersScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(TABS.ONGOING);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const snapshot = await database().ref("categories").once("value");
        if (!snapshot.exists()) return;

        const data = snapshot.val();
        const allProducts = [];

        Object.entries(data).forEach(([category, subCategories]) => {
          Object.entries(subCategories || {}).forEach(([subCategory, items]) => {
            Object.entries(items || {}).forEach(([id, product]) => {
              allProducts.push({
                id: `${category}_${subCategory}_${id}`,
                ...product,
                category,
                subCategory,
              });
            });
          });
        });

        setProducts(allProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const filteredProducts = useMemo(() => {
    if (selectedTab === TABS.ONGOING) return products.slice(0, 8);
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 5);
  }, [selectedTab, products]);

  const renderItem = useCallback(
    ({ item }) => (
      <OrderCard item={item} isOngoing={selectedTab === TABS.ONGOING} />
    ),
    [selectedTab]
  );

  return (
    <SafeAreaView style={styles.container}>
      <Header title="My Orders" onBackPress={() => navigation.goBack()} />
      <TabSwitcher selectedTab={selectedTab} onTabChange={setSelectedTab} />

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    elevation: 2,
    backgroundColor: "#fff",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerIcon: { width: 22, height: 22, tintColor: "#000" },

  tabContainer: {
    flexDirection: "row",
    margin: 16,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    overflow: "hidden",
  },
  tab: { flex: 1, paddingVertical: 10, alignItems: "center" },
  tabText: { fontSize: 14, color: "#555" },
  activeTab: { backgroundColor: "#000", elevation: 2 },
  activeTabText: { color: "#fff", fontWeight: "600" },

  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 14,
    borderRadius: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },

  productImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  productName: { fontSize: 15, fontWeight: "600", color: "#000" },
  productSize: { fontSize: 13, color: "#777", marginVertical: 2, marginBottom: 10 },
  price: { fontSize: 14, fontWeight: "bold", color: "#000" },


  rightSection: { alignItems: "flex-end" },
  status: {
    fontSize: 12,
    color: "#666",
    marginBottom: 20,
    backgroundColor: "#f2f2f2",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  trackButton: {
    backgroundColor: "#000",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  trackText: { color: "#fff", fontSize: 12, fontWeight: "600" },
  completedStatus: {
    fontSize: 12,
    color: "green",
    marginBottom: 10,
    backgroundColor: "#e6ffe6",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  reviewButton: {
    backgroundColor: "#f5f5f5",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  reviewText: { color: "#000", fontSize: 12, fontWeight: "600" },
  ratingText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#333",
    marginTop: 4,
  },
});

export default MyOrdersScreen;
