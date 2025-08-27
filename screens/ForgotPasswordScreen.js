import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
    KeyboardAvoidingView,
    Platform,
    Modal,
    Alert
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import { validateInput } from "../validation/validateInput";
import AppButton from "../components/AppButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BackButtonImage from "../assets/backButtonImage.png";
import { ROUTES } from "../helper/routes";
import { getErrorMessage } from "../helper/firebaseErrorMessages";
import { AuthService } from "../services/authService"; // ✅ import service

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [showValidation, setShowValidation] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);

    const handleSendCode = async () => {
        setShowValidation(true);

        if (!isEmailValid) {
            Alert.alert("Validation Failed", "Please enter a valid email address.");
            return;
        }

        try {
            setLoading(true);
            await AuthService.resetPassword(email);
            setModalVisible(true); // ✅ show modal on success
        } catch (error) {
            console.log(error);
            Alert.alert("Failed", getErrorMessage(error.code));
        } finally {
            setLoading(false);
        }
    };

    const isEmailValid = validateInput("email", email).isValid;

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                        {Platform.OS === "ios" && (
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                                activeOpacity={0.7}
                            >
                                <Image source={BackButtonImage} style={styles.backIcon} />
                            </TouchableOpacity>
                        )}

                        {/* Title */}
                        <Text style={styles.title}>Forgot password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email for the verification process.{"\n"}
                            We will send a reset link to your email.
                        </Text>

                        {/* Email Input */}
                        <AppTextInput
                            label="Email"
                            placeholder="cody.fisher45@example.com"
                            value={email}
                            onChangeText={setEmail}
                            type="email"
                            forceValidation={showValidation}
                        />
                    </ScrollView>

                    {/* Fixed Send Code Button */}
                    <View style={styles.buttonWrapper}>
                        <AppButton
                            title={loading ? "Sending..." : "Send Code"}
                            onPress={handleSendCode}
                            disabled={loading}
                            color={"#000"}
                        />
                    </View>
                </KeyboardAvoidingView>

                {/* ✅ Success Modal */}
                <Modal
                    transparent
                    animationType="fade"
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Image
                                source={require("../assets/ModalCheckmark.png")}
                                style={styles.modalImage}
                            />
                            <Text style={styles.modalTitle}>Password Reset Link Sent!</Text>
                            <Text style={styles.modalSubtitle}>
                                Check your email inbox and follow the instructions to reset your password.
                            </Text>
                            <View style={{ width: "100%" }}>
                                <AppButton
                                    title="Back to Login"
                                    onPress={() => {
                                        setModalVisible(false);
                                        navigation.pop();
                                    }}
                                />
                            </View>
                        </View>
                    </View>
                </Modal>
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
        color: "#000",
        marginBottom: 6,
    },
    subtitle: {
        fontSize: 16,
        color: "#666",
        marginBottom: 24,
        lineHeight: 22,
    },
    buttonWrapper: {
        paddingVertical: 16,
    },

    // 🔹 Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    modalContent: {
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 24,
        width: "100%",
        alignItems: "center",
    },
    modalImage: {
        width: 80,
        height: 80,
        marginBottom: 16,
        resizeMode: "contain",
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: "700",
        marginBottom: 8,
        color: "#000",
        textAlign: "center",
    },
    modalSubtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 24,
        textAlign: "center",
    },
});
