import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

const CategoryList = ({ categories, selectedCategory, onSelect }) => (
  <View style={styles.categories}>
    {categories.map((cat) => (
      <TouchableOpacity
        key={cat}
        style={[
          styles.categoryButton,
          selectedCategory === cat && styles.categoryButtonActive,
        ]}
        onPress={() => onSelect(cat)}
      >
        <Text
          style={[
            styles.categoryText,
            selectedCategory === cat && styles.categoryTextActive,
          ]}
        >
          {cat}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default CategoryList;

const styles = StyleSheet.create({
  categories: { flexDirection: "row", marginVertical: 15 },
  categoryButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 6,
    marginRight: 8,
  },
  categoryButtonActive: { backgroundColor: "#000", borderColor: "#000" },
  categoryText: { fontSize: 14, color: "#000" },
  categoryTextActive: { color: "#fff" },
});
