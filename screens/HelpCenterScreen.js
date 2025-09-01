// screens/HelpCenterScreen.js
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Icons = {
  back: require("../assets/backButtonImage.png"),
  vector: require("../assets/images/vector.png"),
};

const HelpCenterScreen = ({ navigation }) => {
  const handleEmailSupport = () => {
    Linking.openURL("mailto:support@yourapp.com");
  };

  const handleCallSupport = () => {
    Linking.openURL("tel:+911234567890");
  };

  const handleChatSupport = () => {
    Linking.openURL("https://wa.me/911234567890");
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 🔹 Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Icons.back} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <TouchableOpacity>
          <Image source={Icons.vector} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      {/* 🔹 Content */}
      <View style={styles.content}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>
          We’re here to help. Reach out to our support team any time using the
          options below.
        </Text>

        {/* 🔹 Support Options */}
        <TouchableOpacity style={styles.card} onPress={handleEmailSupport}>
          <Text style={styles.cardIcon}>📧</Text>
          <Text style={styles.cardText}>Email Support</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleCallSupport}>
          <Text style={styles.cardIcon}>📞</Text>
          <Text style={styles.cardText}>Call Us</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleChatSupport}>
          <Text style={styles.cardIcon}>💬</Text>
          <Text style={styles.cardText}>Live Chat</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },

  // 🔹 Header
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerIcon: { width: 22, height: 22, tintColor: "#000" },

  // 🔹 Content
  content: { flex: 1, alignItems: "center", padding: 20 },
  title: { fontSize: 22, fontWeight: "700", marginBottom: 10, color: "#000" },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },

  // 🔹 Cards
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    width: "100%",
    borderRadius: 12,
    marginVertical: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  cardIcon: { fontSize: 20, marginRight: 12 },
  cardText: { fontSize: 16, fontWeight: "600", color: "#000" },
});

export default HelpCenterScreen;
