import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

import AddressList from '../../components/AddressList';
import Header from '../../components/Header';

const addresses = [
  {
    id: 1,
    label: 'Home',
    address: '925 S Chugach St #APT 10, Alaska',
    default: false,
  },
  {
    id: 2,
    label: 'Office',
    address: '406 , infoenum software system , apollo square , indore',
    default: true,
  },
  {
    id: 3,
    label: 'Apartment',
    address: '2551 Vista Dr #B301, Juneau, Alaska',
    default: false,
  },
  {
    id: 4,
    label: "Parent's House",
    address: '4821 Ridge Top Cir, Anchorage, Alaska',
    default: false,
  },
];

const AddressScreen = () => {
  const navigation = useNavigation();
  const [selectedId, setSelectedId] = useState(addresses[1].id);

  return (
    <SafeAreaView style={styles.container}>
      <Header headerTitle={'Address'} />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.sectionTitleContainer}>
          <Text style={styles.sectionTitle}>Saved Address</Text>
        </View>

        {addresses.map(item => (
          <AddressList
            id={item.id}
            label={item.label}
            address={item.address}
            selectedId={selectedId}
            defaultBadge={item.default}
            handleSelectId={setSelectedId}
          />
        ))}

        {/* Add new address */}
        <TouchableOpacity style={styles.addNewAddressButton}>
          <Text style={styles.addNewAddressText}>+ Add New Address</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Apply Button */}
      <TouchableOpacity style={styles.applyButton}>
        <Text style={styles.applyButtonText}>Apply</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  sectionTitleContainer: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#222' },

  addNewAddressButton: {
    borderWidth: 1,
    borderColor: '#EEE',
    borderRadius: 12,
    marginHorizontal: 16,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    backgroundColor: '#FFF',
  },
  addNewAddressText: {
    color: '#151515',
    fontWeight: '500',
    fontSize: 16,
  },

  applyButton: {
    backgroundColor: '#151515',
    borderRadius: 8,
    paddingVertical: 16,
    margin: 16,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
});

export default AddressScreen;
