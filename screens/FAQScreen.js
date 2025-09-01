// screens/FAQScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
  TextInput,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Icons = {
  back: require("../assets/backButtonImage.png"),
  vector: require("../assets/images/vector.png"),
  mic: require("../assets/images/search.png"), // search/mic icon
};

// Enable LayoutAnimation on Android
if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

// 🔹 FAQ data by category
const FAQ_DATA = {
  General: [
    {
      question: "How do I make a purchase?",
      answer:
        "When you find a product you want to purchase, tap on it to view details, then tap 'Add to Cart'. Complete checkout with shipping and payment info.",
    },
    {
      question: "How do I track my orders?",
      answer:
        "Go to My Orders → Track to see the latest updates on your delivery.",
    },
  ],
  Account: [
    {
      question: "How do I reset my password?",
      answer:
        "Go to Profile → Settings → Reset Password. You'll receive a reset link by email.",
    },
    {
      question: "Can I change my registered email?",
      answer:
        "Yes, update it in Profile → Edit Info. Verification required for security.",
    },
  ],
  Service: [
    {
      question: "Do you offer gift wrapping?",
      answer: "Yes, gift wrapping can be added during checkout for a small fee.",
    },
  ],
  Payment: [
    {
      question: "What payment methods are accepted?",
      answer: "We accept Credit/Debit Cards, UPI, Wallets, and Net Banking.",
    },
  ],
  Delivery: [
    {
      question: "How long does delivery take?",
      answer:
        "Delivery usually takes 3–5 business days, depending on your location.",
    },
    {
      question: "Can I change my delivery address?",
      answer:
        "Yes, update your address before the order is shipped in Profile → Address Book.",
    },
  ],
};

// 🔹 Category Tabs
const TABS = Object.keys(FAQ_DATA);

// 🔹 FAQ Item
const FAQItem = ({ item, isOpen, onPress }) => (
  <View style={[styles.card, isOpen && styles.cardExpanded]}>
    <TouchableOpacity style={styles.row} onPress={onPress} activeOpacity={0.7}>
      <Text style={styles.question}>{item.question}</Text>
      <Text style={[styles.chevron, isOpen && styles.chevronOpen]}>
        ▼
      </Text>
    </TouchableOpacity>
    {isOpen && <Text style={styles.answer}>{item.answer}</Text>}
  </View>
);

const FAQScreen = ({ navigation }) => {
  const [expanded, setExpanded] = useState(null);
  const [activeTab, setActiveTab] = useState("General");
  const [search, setSearch] = useState("");

  const toggleExpand = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(expanded === index ? null : index);
  };

  const tabData = FAQ_DATA[activeTab] || [];

  const filteredData = tabData.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Icons.back} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>FAQs</Text>
        <TouchableOpacity>
          <Image source={Icons.vector} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsContainer}
      >
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.activeTab]}
            onPress={() => {
              setActiveTab(tab);
              setExpanded(null); // reset expanded on tab change
              setSearch("");
            }}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.activeTabText,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* 🔹 Search Bar */}
      <View style={styles.searchBar}>
        <TextInput
          placeholder="Search for questions..."
          placeholderTextColor="#999"
          value={search}
          onChangeText={setSearch}
          style={styles.searchInput}
        />
        <Image source={Icons.mic} style={styles.micIcon} />
      </View>

      {/* 🔹 FAQ List */}
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={styles.listContainer}
          renderItem={({ item, index }) => (
            <FAQItem
              item={item}
              isOpen={expanded === index}
              onPress={() => toggleExpand(index)}
            />
          )}
        />
      ) : (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>No questions found.</Text>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },

  // Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerIcon: { width: 22, height: 22, tintColor: "#000" },

  // Tabs
  tabsContainer: {
    flexGrow: 0,
    marginVertical: 12,
    paddingHorizontal: 10,
  },
  tab: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 25,
    backgroundColor: "#f2f2f2",
    marginRight: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
  },
  activeTab: {
    backgroundColor: "#000",
  },
  tabText: { fontSize: 14, color: "#333" },
  activeTabText: { color: "#fff", fontWeight: "600" },

  // Search
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f7f7f7",
    marginHorizontal: 16,
    paddingHorizontal: 14,
    borderRadius: 25,
    marginBottom: 12,
    elevation: 1,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    height: 42,
    fontSize: 15,
    color: "#000",
  },
  micIcon: { width: 20, height: 20, tintColor: "#555" },

  // FAQ List
  listContainer: { paddingBottom: 30 },

  // FAQ Item
  card: {
    backgroundColor: "#fff",
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#eee",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardExpanded: {
    backgroundColor: "#fafafa",
    borderColor: "#ddd",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  question: { fontSize: 15, fontWeight: "600", color: "#000", flex: 1 },
  answer: {
    marginTop: 12,
    fontSize: 14,
    color: "#555",
    lineHeight: 20,
  },
  chevron: { fontSize: 16, color: "#444", marginLeft: 8, transform: [{ rotate: "0deg" }] },
  chevronOpen: { transform: [{ rotate: "180deg" }] },

  // Empty state
  emptyState: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 15, color: "#888", marginTop: 20 },
});

export default FAQScreen;
