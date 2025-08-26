import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Header = ({ title, rightIcon }) => (
  <View style={styles.header}>
    <Text style={styles.headerTitle}>{title}</Text>
    {rightIcon && <Image source={rightIcon} style={styles.headerIcon} />}
  </View>
);

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
