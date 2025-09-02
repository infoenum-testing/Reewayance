import React, { memo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const AddressList = ({
  id,
  defaultBadge,
  label,
  address,
  selectedId,
  handleSelectId,
}) => {
  return (
    <TouchableOpacity
      key={id}
      activeOpacity={0.8}
      style={styles.addressCard}
      onPress={() => handleSelectId(id)}
    >
      <View style={styles.radioWrapper}>
        <View
          style={[
            styles.radioOuter,
            selectedId === id && styles.radioOuterSelected,
          ]}
        >
          {selectedId === id && <View style={styles.radioInner} />}
        </View>
      </View>
      <View style={{ flex: 1 }}>
        <View style={styles.addressLabelRow}>
          <Text style={styles.addressLabel}>{label}</Text>
          {defaultBadge && (
            <View style={styles.defaultBadge}>
              <Text style={styles.defaultBadgeText}>Default</Text>
            </View>
          )}
        </View>
        <Text style={styles.addressText} numberOfLines={1}>
          {address}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FAFAFA',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#EEE',
  },
  radioWrapper: { marginRight: 14 },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#D2D2D2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioOuterSelected: {
    borderColor: '#151515',
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#151515',
  },
  addressLabelRow: { flexDirection: 'row', alignItems: 'center' },
  addressLabel: {
    fontSize: 15,
    fontWeight: '600',
    marginRight: 8,
    color: '#222',
  },
  defaultBadge: {
    backgroundColor: '#EEE',
    borderRadius: 8,
    paddingHorizontal: 7,
    paddingVertical: 2,
    marginLeft: 2,
  },
  defaultBadgeText: { fontSize: 11, color: '#555' },
  addressText: {
    fontSize: 13,
    color: '#888',
    marginTop: 1,
  },

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
});

export default memo(AddressList);
