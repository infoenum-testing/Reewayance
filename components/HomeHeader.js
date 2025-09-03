import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from '@react-navigation/native';
import { ROUTES } from '../helper/routes';
const Icons = {
  back: require('../assets/backButtonImage.png'),
  bell: require('../assets/images/vector.png'),
};

const Header = ({ title }) => {
const navigation = useNavigation();
  return (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
         <TouchableOpacity
           onPress={() => navigation.navigate(ROUTES.Notification_Screen)}
         >
           <Image source={Icons.bell} style={styles.headerIcon} />
         </TouchableOpacity>
  </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 15,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  headerIcon: { width: 22, height: 22, resizeMode: "contain" },
});
