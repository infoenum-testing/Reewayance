import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import Arrow from '../assets/backButtonImage.png';
import NotificationIcon from '../assets/images/vector.png';
import QuestionMark from '../assets/images/question.png';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const NewCardScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const isFormValid =
    cardNumber.length >= 16 && expiry.length === 7 && cvc.length >= 3;

  console.log('New Card Screen');

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer} >
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={Arrow} style={styles.headerIcon} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Cart</Text>
            <Image source={NotificationIcon} style={styles.headerIcon} />
          </View>
        <KeyboardAvoidingView
          style={styles.container}
        //   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.label}>Add Debit or Credit Card</Text>

            <Text style={styles.inputLabel}>Card number</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter your card number"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={setCardNumber}
              maxLength={16}
            />

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={setExpiry}
                  maxLength={5}
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Security Code</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={styles.cvcInput}
                    placeholder="CVC"
                    keyboardType="number-pad"
                    value={cvc}
                    onChangeText={setCvc}
                    maxLength={4}
                  />
                  <Image source={QuestionMark} style={styles.iconInsideInput} />
                </View>
              </View>
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFormValid ? '#000' : '#ccc' },
            ]}
            disabled={!isFormValid}
            onPress={() => alert('Card Added')}
          >
            <Text style={styles.buttonText}>Add Card</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#fff' },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  headerIcon: { width: 22, height: 22, tintColor: '#000' },
  form: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 12,
    color: 'gray',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    marginBottom: 15,
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 10,
  },
  cvcInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 12,
  },
  iconInsideInput: {
    width: 20,
    height: 20,
    tintColor: 'gray',
    marginLeft: 8,
  },

  row: {
    flexDirection: 'row',
  },
  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NewCardScreen;
