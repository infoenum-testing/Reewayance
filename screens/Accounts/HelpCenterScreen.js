// screens/HelpCenterScreen.js
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Linking,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView, SafeAreaProvider } from 'react-native-safe-area-context';
import Header from '../../components/Header';

const HelpCenterScreen = ({ navigation }) => {
  const handleEmailSupport = () => {
    Linking.openURL('mailto:support@yourapp.com');
  };

  const handleCallSupport = () => {
    Linking.openURL('tel:+911234567890');
  };

  const handleChatSupport = () => {
    Linking.openURL('https://wa.me/911234567890');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={'Help Center'} />

      <ScrollView style={styles.content}>
        <Text style={styles.title}>Need Help?</Text>
        <Text style={styles.subtitle}>
          We’re here to help! Choose how you’d like to connect with us below.
        </Text>

        {/* 🔹 Support Options */}
        <TouchableOpacity style={styles.card} onPress={handleEmailSupport}>
          <View style={[styles.iconCircle, { backgroundColor: '#E0F7FA' }]}>
            <Text style={styles.cardEmoji}>📧</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Email Support</Text>
            <Text style={styles.cardSubtitle}>Get help via email</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleCallSupport}>
          <View style={[styles.iconCircle, { backgroundColor: '#FFF3E0' }]}>
            <Text style={styles.cardEmoji}>📞</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Call Us</Text>
            <Text style={styles.cardSubtitle}>Speak directly to our team</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity style={styles.card} onPress={handleChatSupport}>
          <View style={[styles.iconCircle, { backgroundColor: '#E8F5E9' }]}>
            <Text style={styles.cardEmoji}>💬</Text>
          </View>
          <View>
            <Text style={styles.cardTitle}>Live Chat</Text>
            <Text style={styles.cardSubtitle}>Instant support via chat</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  // 🔹 Content
  content: { flex: 1, padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 12,
  },

  // 🔹 Cards
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 14,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 5,
    elevation: 2,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  cardEmoji: { fontSize: 22 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: '#000' },
  cardSubtitle: { fontSize: 13, color: '#777', marginTop: 2 },
});

export default HelpCenterScreen;
