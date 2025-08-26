import React, { useRef, useState } from "react";
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Image
} from "react-native";
// import colors from "../constants/colors";
import AppButton from "../components/AppButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BackButtonImage from "../assets/backButtonImage.png";
import { ROUTES } from "../helper/routes";

const VerificationCodeScreen = ({ navigation }) => {
    const [code, setCode] = useState("");
    const inputRef = useRef(null);

    const handleChange = (text) => {
        if (text.length <= 4) {
            setCode(text);
        }
    };

    const handleContinue = () => {
        console.log("Entered code:", code);
        navigation.navigate(ROUTES.RESET_PASSWORD);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        
                        {/* Back Button only on iOS */}
                        {Platform.OS === "ios" && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Image source={BackButtonImage} style={styles.backIcon} />
                            </TouchableOpacity>
                        )}

                        {/* Title & Subtitle */}
                        <Text style={styles.title}>Enter 4 Digit Code</Text>
                        <Text style={styles.subtitle}>
                            Enter 4 digit code that you receive on your email{" "}
                            <Text style={{ fontWeight: "600", color: '#000' }}>
                                (cody.fisher45@example.com).
                            </Text>
                        </Text>

                        {/* OTP Boxes */}
                        <TouchableOpacity
                            style={styles.otpContainer}
                            onPress={() => inputRef.current.focus()}
                            activeOpacity={1}
                        >
                            {[0, 1, 2, 3].map((i) => (
                                <View key={i} style={styles.otpBox}>
                                    <Text style={styles.otpText}>{code[i] || ""}</Text>
                                </View>
                            ))}
                        </TouchableOpacity>

                        {/* Hidden Input */}
                        <TextInput
                            ref={inputRef}
                            style={styles.hiddenInput}
                            keyboardType="numeric"
                            maxLength={4}
                            value={code}
                            onChangeText={handleChange}
                            autoFocus
                        />

                        {/* Resend Link */}
                        <TouchableOpacity style={{ marginBottom: 32 }}>
                            <Text style={styles.resendText}>
                                Email not received?{" "}
                                <Text style={styles.resendLink}>Resend code</Text>
                            </Text>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* Fixed Button */}
                    <View style={styles.buttonWrapper}>
                        <AppButton
                            title="Continue"
                            onPress={handleContinue}
                            disabled={code.length !== 4}
                            color={code.length === 4 ? "#000" : "#999"}
                        />
                    </View>
                </KeyboardAvoidingView>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default VerificationCodeScreen;

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 16,
        width: 32,
        height: 32,
        justifyContent: "center",
    },
    backIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: 30,
        fontWeight: "700",
        color: '#000',
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        marginBottom: 24,
        lineHeight: 22,
    },
    otpContainer: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 16,
    },
    otpBox: {
        width: 64,
        height: 64,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 12,
        justifyContent: "center",
        alignItems: "center",
    },
    otpText: {
        fontSize: 22,
        fontWeight: "600",
    },
    hiddenInput: {
        position: "absolute",
        opacity: 0,
    },
    resendText: {
        fontSize: 14,
        color: '#777',
        textAlign: "center",
    },
    resendLink: {
        color: '#000',
        fontWeight: "600",
    },
    buttonWrapper: {
        padding: 16,
    },
});
