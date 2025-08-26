import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from "react-native";
import AppTextInput from "../components/AppTextInput";
import { validateInput } from "../validation/validateInput";
import AppButton from "../components/AppButton";
import Google from "../assets/googleIcon.png";
import Facebook from "../assets/facebookIcon.png";
// import colors from "../constants/colors";  
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { ROUTES } from "../helper/routes";

export default function CreateAccountScreen({ navigation }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateAccount = () => {
        console.log("Creating Account:", { fullName, email, password });
    };

    const handleLoginNavigation = () => {
        navigation.pop(); // Go back to the previous screen (LoginScreen)
    };

    const isFullNameValid = validateInput("name", fullName).isValid;
    const isEmailValid = validateInput("email", email).isValid;
    const isPasswordValid = validateInput("password", password).isValid;

    const isFormValid = isFullNameValid && isEmailValid && isPasswordValid;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
        <ScrollView >
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Let’s create your account.</Text>

            <AppTextInput
                label="Full Name"
                placeholder="Enter your full name"
                value={fullName}
                onChangeText={setFullName}
                type="name"
            />
            <AppTextInput
                label="Email"
                placeholder="Enter your email address"
                value={email}
                onChangeText={setEmail}
                type="email"
            />
            <AppTextInput
                label="Password"
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                type="password"
            />

            <Text style={styles.terms}>
                By signing up you agree to our{" "}
                <Text style={styles.link}>Terms</Text>,{" "}
                <Text style={styles.link}>Privacy Policy</Text>, and{" "}
                <Text style={styles.link}>Cookie Use</Text>
            </Text>

            <AppButton
                title="Sign Up"
                onPress={handleCreateAccount}
                disabled={!isFormValid} // disabled until all fields are valid
                color={isFormValid ? "#000" : "#999"} // change color based on validity
            />

            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.divider} />
            </View>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#fff" }]}>
                <Image source={Google} style={styles.socialIcon}></Image>
                <Text style={styles.socialText}>Sign Up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#1877F2" }]}>
                <Image source={Facebook} style={styles.socialIcon}></Image>
                <Text style={styles.socialFacebookText}>Sign Up with Facebook</Text>
            </TouchableOpacity>

            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={handleLoginNavigation}>
                    <Text style={styles.footerLink}> Log In</Text>
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
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: "#000",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
    },
    terms: {
        fontSize: 14,
        color: "#777",
        marginVertical: 16,
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
    }
});
