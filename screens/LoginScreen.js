// screens/LoginScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../src/redux/slices/authSlice";
import { ROUTES } from "../helper/routes";
import { validateInput } from "../validation/validateInput";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { getErrorMessage } from "../helper/firebaseErrorMessages";

import Google from "../assets/googleIcon.png";
import Facebook from "../assets/facebookIcon.png";

export default function LoginScreen({ navigation }) {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state) => state.auth);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showValidation, setShowValidation] = useState(false);

  const isEmailValid = validateInput("email", email).isValid;
  const isPasswordValid = validateInput("password", password).isValid;
  const isFormValid = isEmailValid && isPasswordValid;

  const handleLogin = () => {
    setShowValidation(true);

    if (!isFormValid) {
      Alert.alert("Validation Failed", "Please fill all fields correctly.");
      return;
    }

    dispatch(loginUser({ email, password }))
      .unwrap()
      .then(() => {
        navigation.replace(ROUTES.TABS);
      })
      .catch((err) => {
        Alert.alert("Failed", getErrorMessage(err));
      });
  };

  const handleCreateAccountNavigation = () => {
    navigation.navigate(ROUTES.CREATE_ACCOUNT);
  };

  const handleForgotPasswordNavigation = () => {
    navigation.navigate(ROUTES.FORGOT_PASSWORD);
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Login to your account</Text>
          <Text style={styles.subtitle}>It’s great to see you again.</Text>

          {/* Email */}
          <AppTextInput
            label="Email"
            placeholder="Enter your email address"
            value={email}
            onChangeText={setEmail}
            type="email"
            forceValidation={showValidation}
          />

          {/* Password */}
          <AppTextInput
            label="Password"
            placeholder="Enter your password"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            type="password"
            forceValidation={showValidation}
          />

          {/* Forgot Password */}
          <TouchableOpacity onPress={handleForgotPasswordNavigation}>
            <Text style={styles.forgotPassword}>
              Forgot your password?{" "}
              <Text style={styles.link}>Reset your password</Text>
            </Text>
          </TouchableOpacity>

          {/* Login Button */}
          <AppButton
            title={loading ? "Logging in..." : "Login"}
            onPress={handleLogin}
            disabled={loading}
            color={"#000"}
          />

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>Or</Text>
            <View style={styles.divider} />
          </View>

          {/* Social Login */}
          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#fff" }]}
          >
            <Image source={Google} style={styles.socialIcon} />
            <Text style={styles.socialText}>Login with Google</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
          >
            <Image source={Facebook} style={styles.socialIcon} />
            <Text style={styles.socialFacebookText}>Login with Facebook</Text>
          </TouchableOpacity>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Don’t have an account?</Text>
            <TouchableOpacity onPress={handleCreateAccountNavigation}>
              <Text style={styles.footerLink}> Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: "#000",
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    marginBottom: 24,
  },
  forgotPassword: {
    fontSize: 14,
    color: "#777",
    marginVertical: 12,
    textAlign: "left",
    lineHeight: 18,
  },
  link: {
    color: "#000",
    fontWeight: "300",
    textDecorationLine: "underline",
    textDecorationColor: "#000",
    textDecorationStyle: "solid",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 24,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#777",
    fontSize: 14,
  },
  socialButton: {
    paddingVertical: 12,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  socialText: {
    color: "#000",
    fontSize: 15,
    fontWeight: "500",
  },
  socialFacebookText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "500",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
  },
  footerText: {
    color: "#666",
    fontSize: 14,
  },
  footerLink: {
    color: "#000",
    fontWeight: "600",
    fontSize: 14,
    textDecorationLine: "underline",
    textDecorationColor: "#000",
    textDecorationStyle: "solid",
  },
  socialIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
    resizeMode: "contain",
  },
});
