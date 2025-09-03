import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../helper/routes';

const Icons = {
  back: require('../assets/backButtonImage.png'),
  bell: require('../assets/images/vector.png'),
};

const Header = ({headerTitle}) => {
  const navigation = useNavigation();

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={Icons.back} style={styles.headerIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}> {headerTitle} </Text>
      <TouchableOpacity
        onPress={() => navigation.navigate(ROUTES.Notification_Screen)}
      >
        <Image source={Icons.bell} style={styles.headerIcon} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
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
});

export default Header;
