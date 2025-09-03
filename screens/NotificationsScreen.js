import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import Notification from '../assets/images/vector.png';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ROUTES } from '../helper/routes';
import { useNavigation } from '@react-navigation/native';

const Icons = {
  back: require('../assets/backButtonImage.png'),
  bell: require('../assets/images/vector.png'),
};

const NotificationsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={Icons.back} style={styles.headerIcon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate(ROUTES.Notification_Screen)}
        >
          <Image source={Icons.bell} style={styles.headerIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.emptyContainer}>
        <Image source={Icons.bell} style={styles.staticHeartIcon} />
        <Text style={styles.emptyTitle}>
          You haven’t gotten any notifications yet!
        </Text>
        <Text style={styles.emptySubtitle}>
          We’ll alert you when something cool happens.
        </Text>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f7f7' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },
  topText: {
    fontWeight: 'bold',
    alignItems: 'center',
  },
  bottomText: {
    fontWeight: '200',
    alignItems: 'center',
  },
  staticHeartIcon: {
    width: 30,
    height: 30,
    tintColor: '#000',
    marginBottom: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },

  emptyTitle: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 8,
    color: '#000',
    textAlign: 'center',
  },

  emptySubtitle: {
    fontSize: 14,
    color: 'gray',
    marginTop: 6,
    textAlign: 'center',
  },
});

export default NotificationsScreen;
