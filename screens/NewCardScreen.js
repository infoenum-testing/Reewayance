import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  Switch,
  Modal,
  TouchableWithoutFeedback,
  Animated,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

// Assets
import Arrow from "../assets/backButtonImage.png";
import NotificationIcon from "../assets/images/vector.png";
import Visa from "../assets/images/visa.png";
import QuestionMark from "../assets/images/question.png";

const NewCardScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [isDefault, setIsDefault] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  // UseRef so animation value persists across renders
  const focusAnim = useRef(new Animated.Value(1)).current;

  // ----------- Utility Functions ------------ //

  // Auto-format card number
  const handleCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, ""); // remove non-digits
    const formatted = cleaned.match(/.{1,4}/g)?.join(" ") || "";
    setCardNumber(formatted);
  };

  // Auto-format expiry date as MM/YY
  const handleExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    setExpiry(formatted);
  };

  // Mask CVC input (still numeric but hides with dots)
  const handleCvc = (text) => {
    setCvc(text.replace(/\D/g, ""));
  };

  // Detect card brand based on number
  const getCardBrand = () => {
    if (/^4/.test(cardNumber)) return Visa; // local asset
    if (/^5[1-5]/.test(cardNumber))
      return { uri: "https://img.icons8.com/color/96/mastercard.png" };
    if (/^3[47]/.test(cardNumber))
      return { uri: "https://img.icons8.com/color/96/amex.png" };
     return { uri: "https://img.icons8.com/ios-filled/100/bank-card-back-side.png" };
  };

  // Validation
  const isCardNumberValid = cardNumber.replace(/\s/g, "").length >= 16;
  const isExpiryValid = /^((0[1-9])|(1[0-2]))\/\d{2}$/.test(expiry);
  const isCvcValid = cvc.length >= 3 && cvc.length <= 4;

  const isFormValid = isCardNumberValid && isExpiryValid && isCvcValid;

  // Animate field focus
  const animateFocus = () => {
    Animated.sequence([
      Animated.timing(focusAnim, {
        toValue: 1.05,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.spring(focusAnim, {
        toValue: 1,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // ----------- UI ------------ //

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.mainContainer}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={Arrow} style={styles.headerIcon} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Card</Text>
          <Image source={NotificationIcon} style={styles.headerIcon} />
        </View>

        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
          {/* Live Card Preview */}
          <Animated.View
            style={[styles.cardPreview, { transform: [{ scale: focusAnim }] }]}
          >
            {getCardBrand() && (
              <Image source={getCardBrand()} style={styles.cardBrand} />
            )}
            <Text style={styles.previewNumber}>
              {cardNumber || "•••• •••• •••• ••••"}
            </Text>
            <View style={styles.previewRow}>
              <Text style={styles.previewExpiry}>{expiry || "MM/YY"}</Text>
              <Text style={styles.previewCvc}>{cvc ? "•••" : "CVC"}</Text>
            </View>
          </Animated.View>

          {/* Form */}
          <View style={styles.form}>
            <Text style={styles.inputLabel}>Card number</Text>
            <TextInput
              style={[
                styles.input,
                !isCardNumberValid && cardNumber.length > 0
                  ? styles.errorInput
                  : null,
              ]}
              placeholder="1234 5678 9012 3456"
              keyboardType="number-pad"
              value={cardNumber}
              onChangeText={handleCardNumber}
              maxLength={19}
              onFocus={animateFocus}
              accessible
              accessibilityLabel="Enter your card number"
            />
            {!isCardNumberValid && cardNumber.length > 0 && (
              <Text style={styles.errorText}>Invalid card number</Text>
            )}

            <View style={styles.row}>
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={styles.inputLabel}>Expiry Date</Text>
                <TextInput
                  style={[
                    styles.input,
                    !isExpiryValid && expiry.length > 0
                      ? styles.errorInput
                      : null,
                  ]}
                  placeholder="MM/YY"
                  keyboardType="number-pad"
                  value={expiry}
                  onChangeText={handleExpiry}
                  maxLength={5}
                  onFocus={animateFocus}
                  accessible
                  accessibilityLabel="Enter card expiry date"
                />
                {!isExpiryValid && expiry.length > 0 && (
                  <Text style={styles.errorText}>Invalid expiry date</Text>
                )}
              </View>

              <View style={{ flex: 1 }}>
                <Text style={styles.inputLabel}>Security Code</Text>
                <View style={styles.inputWithIcon}>
                  <TextInput
                    style={[
                      styles.cvcInput,
                      !isCvcValid && cvc.length > 0
                        ? styles.errorInput
                        : null,
                    ]}
                    placeholder="CVC"
                    keyboardType="number-pad"
                    secureTextEntry
                    value={cvc}
                    onChangeText={handleCvc}
                    maxLength={4}
                    onFocus={animateFocus}
                    accessible
                    accessibilityLabel="Enter CVC security code"
                  />
                  <TouchableOpacity onPress={() => setShowTooltip(true)}>
                    <Image
                      source={QuestionMark}
                      style={styles.iconInsideInput}
                    />
                  </TouchableOpacity>
                </View>
                {!isCvcValid && cvc.length > 0 && (
                  <Text style={styles.errorText}>Invalid CVC</Text>
                )}
              </View>
            </View>

            {/* Default Card Toggle */}
            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Set as default card</Text>
              <Switch value={isDefault} onValueChange={setIsDefault} />
            </View>
          </View>

          {/* Button */}
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: isFormValid ? "#000" : "#ccc" },
            ]}
            disabled={!isFormValid}
            onPress={() => alert("Card Added")}
            accessible
            accessibilityLabel="Add Card"
          >
            <Text style={styles.buttonText}>Add Card</Text>
          </TouchableOpacity>

          <Text style={styles.secureNote}>
            🔒 Your card will be saved securely (mock)
          </Text>
        </KeyboardAvoidingView>

        {/* Tooltip Modal */}
        <Modal transparent visible={showTooltip} animationType="fade">
          <TouchableWithoutFeedback onPress={() => setShowTooltip(false)}>
            <View style={styles.tooltipOverlay}>
              <View style={styles.tooltipBox}>
                <Text style={styles.tooltipText}>
                  The CVC is the 3 or 4-digit code on the back of your card.
                </Text>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </SafeAreaView>
    </SafeAreaProvider>
  );
};

// ----------- Styles ------------ //
const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: { fontSize: 20, fontWeight: "bold" },
  headerIcon: { width: 22, height: 22, tintColor: "#000" },

  // Card Preview
  cardPreview: {
    backgroundColor: "#5d5d6fff",
    borderRadius: 16,
    padding: 20,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  cardBrand: {
    width: 50,
    height: 30,
    resizeMode: "contain",
    alignSelf: "flex-end",
  },
  previewNumber: {
    color: "#fff",
    fontSize: 20,
    letterSpacing: 2,
    marginTop: 10,
  },
  previewRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 15,
  },
  previewExpiry: { color: "#fff", fontSize: 16 },
  previewCvc: { color: "#fff", fontSize: 16 },

  form: { flex: 1 },
  inputLabel: {
    fontSize: 12,
    color: "gray",
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
    marginBottom: 10,
  },
  errorInput: { borderColor: "red" },
  errorText: { color: "red", fontSize: 12, marginBottom: 8 },

  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#f9f9f9",
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
    tintColor: "gray",
    marginLeft: 8,
  },

  row: { flexDirection: "row" },

  switchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 15,
  },
  switchLabel: { fontSize: 14, color: "#333" },

  button: {
    padding: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },

  secureNote: {
    fontSize: 12,
    color: "gray",
    textAlign: "center",
    marginBottom: 20,
  },

  // Tooltip
  tooltipOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipBox: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    maxWidth: "80%",
  },
  tooltipText: { fontSize: 14, color: "#333" },
});

export default NewCardScreen;
