import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

import warningCircle from "../assets/warningCircle.png";
import eyeOn from "../assets/eyeOn.png";
import eyeOff from "../assets/eyeOff.png";
import rightCheck from "../assets/rightCheck.png";

export default function AppTextInput({
  label,
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  type = "default",
}) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [touched, setTouched] = useState(false);

  // Validation rules
  let isValid = false;
  let errorMessage = "";

  if (type === "name") {
    isValid = /^[A-Za-z ]+$/.test(value?.trim() || "");
    errorMessage = "Name must contain only letters";
  } else if (type === "email") {
    isValid = /\S+@\S+\.com$/.test(value?.trim() || ""); // must have @ and end with .com
    errorMessage = "Please enter a valid email (must include @ and .com)";
  } else if (type === "password") {
    isValid = value?.length >= 8;
    errorMessage = "Password must be at least 8 characters";
  } else {
    isValid = value?.trim()?.length > 0;
    errorMessage = "This field is required";
  }

  const showError = touched && !isValid;
  const showSuccess = touched && isValid;

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}

      {/* Input with dynamic border */}
      <View
        style={[
          styles.inputContainer,
          showError && { borderColor: "red" },
          showSuccess && { borderColor: "green" },
        ]}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor="#999"
          secureTextEntry={type === "password" && !isPasswordVisible}
          value={value}
          onChangeText={(text) => {
            onChangeText(text);
            if (!touched) setTouched(true);
          }}
          keyboardType={
            type === "number" ? "numeric" :
            type === "email" ? "email-address" :
            "default"
          }
          onBlur={() => setTouched(true)}
        />

        {/* Eye toggle for password */}
        {type === "password" && (
          <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
            <Image
              source={isPasswordVisible ? eyeOn : eyeOff}
              style={styles.eyeIcon}
            />
          </TouchableOpacity>
        )}

        {/* Validation Icons */}
        {showError && <Image source={warningCircle} style={styles.icon} />}
        {showSuccess && <Image source={rightCheck} style={styles.icon} />}
      </View>

      {/* Error Message */}
      {showError && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#fff",
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
    paddingVertical: 15,
  },
  eyeIcon: {
    width: 22,
    height: 22,
    tintColor: "#666",
    marginLeft: 8,
    resizeMode: "contain",
  },
  icon: {
    width: 20,
    height: 20,
    marginLeft: 8,
    resizeMode: "contain",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
});
