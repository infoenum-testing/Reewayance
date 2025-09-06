import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Header from '../../components/Header';

import  Images from '../../constants/images';

const NotificationsScreen = () => {
  const navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
     <Header headerTitle = {"Notification"}/>
      <View style={styles.emptyContainer}>
        <Image source={Images.Notification} style={styles.staticHeartIcon} />
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
    marginVertical: 30,
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
