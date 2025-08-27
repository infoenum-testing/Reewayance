import React from "react";
import { View, TextInput, Image, TouchableOpacity, StyleSheet } from "react-native";

const SearchBar = ({ searchIcon, filterIcon, value, onChangeText }) => {
  return (
    <View style={styles.searchRow}>

      <View style={styles.searchContainer}>
        <Image source={searchIcon} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for clothes..."
          placeholderTextColor="#999"
          value={value}              
          onChangeText={onChangeText} 
        />
      </View>

      <TouchableOpacity style={styles.filterButton}>
        <Image source={filterIcon} style={styles.filterIcon} />
      </TouchableOpacity>
    </View>
  );
};

export default SearchBar;

const styles = StyleSheet.create({
  searchRow: { flexDirection: "row", alignItems: "center", marginBottom: 15 },
  searchContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: "#888",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  searchIcon: { width: 18, height: 18, tintColor: "#888", marginRight: 6 },
  searchInput: { flex: 1, fontSize: 14 },
  filterButton: {
    backgroundColor: "black",
    borderRadius: 10,
    padding: 8,
    marginLeft: 10,
  },
  filterIcon: { width: 25, height: 25, tintColor: "#fff" },
});
