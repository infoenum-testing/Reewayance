import React from "react";
import { View, Text, TextInput, StyleSheet, TouchableOpacity , Image} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import { useNavigation } from '@react-navigation/native';

export default function SearchScreen() {
     const navigation = useNavigation();

  return (
    <SafeAreaProvider>
        <SafeAreaView style={styles.container} >
      <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Arrow} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>My Cart</Text>
          <TouchableOpacity>
            <Image source={NotificationIcon} style={styles.headerIcon} />
          </TouchableOpacity>
        </View>

      <View style={styles.searchBox}>
        <TextInput
          placeholder="Search for clothes..."
          style={styles.input}
        />
      </View>
        </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginHorizontal: 20,
    height: 45,
  },
  input: {
    flex: 1,
    marginHorizontal: 10,
  },
});
