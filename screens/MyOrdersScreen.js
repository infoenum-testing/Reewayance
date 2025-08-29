import React, { useEffect, useState } from "react";
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

const Icons = {
    back: require("../assets/backButtonImage.png"),
    bell: require("../assets/images/vector.png"),
};

const MyOrdersScreen = ({ navigation }) => {
    const [selectedTab, setSelectedTab] = useState("Ongoing");
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const snapshot = await database().ref("categories").once("value");

                if (snapshot.exists()) {
                    const data = snapshot.val();
                    let allProducts = [];

                    Object.keys(data).forEach((category) => {
                        Object.keys(data[category]).forEach((subCategory) => {
                            Object.entries(data[category][subCategory] || {}).forEach(([id, product]) => {
                                allProducts.push({
                                    id: `${category}_${subCategory}_${id}`,
                                    ...product,
                                    category,
                                    subCategory,
                                });
                            });
                        });
                    });

                    const shuffled = allProducts.sort(() => 0.5 - Math.random());
                    setProducts(shuffled.slice(0, 10));
                }
            } catch (error) {
                console.error("Error fetching products:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const renderItem = ({ item }) => (
        <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.productImage} />
            <View style={{ flex: 1 }}>
                <Text style={styles.productName}>{item.name}</Text>
                <Text style={styles.productSize}>Size {item.size || "M"}</Text>
                <Text style={styles.price}>$ {item.price}</Text>
            </View>
            <View style={styles.rightSection}>
                <Text style={styles.status}>{item.status || "In Transit"}</Text>
                <TouchableOpacity style={styles.trackButton}>
                    <Text style={styles.trackText}>Track Order</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={Icons.back} style={styles.headerIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>My Orders</Text>
                <TouchableOpacity>
                    <Image source={Icons.bell} style={styles.headerIcon} />
                </TouchableOpacity>
            </View>

            {/* Tabs */}
            <View style={styles.tabContainer}>
                {["Ongoing", "Completed"].map((tab) => (
                    <TouchableOpacity
                        key={tab}
                        style={[styles.tab, selectedTab === tab && styles.activeTab]}
                        onPress={() => setSelectedTab(tab)}
                    >
                        <Text
                            style={[styles.tabText, selectedTab === tab && styles.activeTabText]}
                        >
                            {tab}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* Orders List */}
            {loading ? (
                <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
            ) : (
                <FlatList
                    data={products}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={{ paddingBottom: 40 }}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </SafeAreaView>
    );
};

// styles (same as your previous code)
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
    activeTab: { backgroundColor: "#fff", elevation: 2 },
    activeTabText: { color: "#000", fontWeight: "600" },

    card: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        marginHorizontal: 16,
        marginVertical: 6,
        padding: 12,
        borderRadius: 10,
        elevation: 1,
    },
    productImage: { width: 60, height: 60, marginRight: 12, borderRadius: 8 },
    productName: { fontSize: 15, fontWeight: "600", color: "#000" },
    productSize: { fontSize: 13, color: "#777", marginVertical: 2 },
    price: { fontSize: 14, fontWeight: "bold", color: "#000" },
    rightSection: { alignItems: "flex-end" },
    status: {
        fontSize: 12,
        color: "#666",
        marginBottom: 8,
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
});

export default MyOrdersScreen;
