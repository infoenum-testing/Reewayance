import React, { useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";

export default function CreateAccountScreen({ navigation }) {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleCreateAccount = () => {
        console.log("Creating Account:", { fullName, email, password });
    };

    return (
        <ScrollView contentContainerStyle={styles.container}>
            {/* Header */}
            <Text style={styles.title}>Create an account</Text>
            <Text style={styles.subtitle}>Let’s create your account.</Text>

            {/* Inputs */}
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

            {/* Terms & Conditions */}
            <Text style={styles.terms}>
                By signing up you agree to our{" "}
                <Text style={styles.link}>Terms</Text>,{" "}
                <Text style={styles.link}>Privacy Policy</Text>, and{" "}
                <Text style={styles.link}>Cookie Use</Text>
            </Text>

            {/* Create Account Button */}
            <AppButton title="Create an Account" onPress={handleCreateAccount} />

            {/* Divider */}
            <View style={styles.dividerContainer}>
                <View style={styles.divider} />
                <Text style={styles.dividerText}>Or</Text>
                <View style={styles.divider} />
            </View>

            {/* Social Buttons (no icons) */}
            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#DB4437" }]}>
                <Text style={styles.socialText}>Sign Up with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.socialButton, { backgroundColor: "#1877F2" }]}>
                <Text style={styles.socialText}>Sign Up with Facebook</Text>
            </TouchableOpacity>

            {/* Footer */}
            <View style={styles.footer}>
                <Text style={styles.footerText}>Already have an account?</Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                    <Text style={styles.footerLink}> Log In</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingVertical: 40,
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
    },
    socialText: {
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
});
