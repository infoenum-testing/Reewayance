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
import auth from "@react-native-firebase/auth";

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

const OrderCard = ({ order, isOngoing }) => {
  const firstItem = Object.values(order.items)[0]; // ek order me multiple ho sakte hain
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: firstItem.image }}
        style={styles.productImage}
      />

      <View style={{ flex: 1 }}>
        <Text style={styles.productName}>{firstItem.name}</Text>
        <Text style={styles.productSize}>
          {Object.keys(order.items).length} item(s)
        </Text>
        <Text style={styles.price}>${order.total}</Text>
      </View>

      <View style={styles.rightSection}>
        {isOngoing ? (
          <>
            <Text style={styles.status}>{order.status || "Placed"}</Text>
            <TouchableOpacity style={styles.trackButton}>
              <Text style={styles.trackText}>Track Order</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.completedStatus}>Completed</Text>
            <TouchableOpacity style={styles.reviewButton}>
              <Text style={styles.reviewText}>Leave Review</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
};

const MyOrdersScreen = ({ navigation }) => {
  const [selectedTab, setSelectedTab] = useState(TABS.ONGOING);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const userId = auth().currentUser?.uid;

  useEffect(() => {
    if (!userId) return;
    const ref = database().ref(`users/${userId}/orders`);

    const listener = ref.on("value", (snapshot) => {
      if (!snapshot.exists()) {
        setOrders([]);
        setLoading(false);
        return;
      }
      const data = snapshot.val();
      const list = Object.entries(data).map(([id, order]) => ({
        id,
        ...order,
      }));
      setOrders(list.reverse()); // latest on top
      setLoading(false);
    });

    return () => ref.off("value", listener);
  }, [userId]);

  const filteredOrders = useMemo(() => {
    if (selectedTab === TABS.ONGOING) {
      return orders.filter((o) => o.status !== "completed");
    } else {
      return orders.filter((o) => o.status === "completed");
    }
  }, [selectedTab, orders]);

  const renderItem = useCallback(
    ({ item }) => (
      <OrderCard order={item} isOngoing={selectedTab === TABS.ONGOING} />
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
          data={filteredOrders}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 30, color: "gray" }}>
              No {selectedTab} Orders
            </Text>
          }
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
  },
  productImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
  productName: { fontSize: 15, fontWeight: "600", color: "#000" },
  productSize: { fontSize: 13, color: "#777", marginVertical: 2 },
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
});

export default MyOrdersScreen;
