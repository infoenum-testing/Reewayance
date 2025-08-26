import React, { useState } from "react";
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Modal,
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import AppButton from "../components/AppButton";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";

export default function ResetPasswordScreen({ navigation }) {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [modalVisible, setModalVisible] = useState(false);

    const handleContinue = () => {
        if (password && password === confirmPassword) {
            setModalVisible(true);
        } else {
            alert("Passwords do not match!");
        }
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <View style={{ flex: 1 }}>
                    {/* Back Button */}
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                    >
                        <Image
                            source={require("../assets/backButtonImage.png")}
                            style={styles.backIcon}
                        />
                    </TouchableOpacity>

                    {/* Title & Subtitle */}
                    <Text style={styles.title}>Reset Password</Text>
                    <Text style={styles.subtitle}>
                        Set the new password for your account so you can login and access
                        all the features.
                    </Text>

                    {/* Password Inputs */}
                    <AppTextInput
                        label="Password"
                        placeholder="Enter your password"
                        secureTextEntry
                        value={password}
                        onChangeText={setPassword}
                        type="password"
                    />

                    <AppTextInput
                        label="Confirm Password"
                        placeholder="Re-enter your password"
                        secureTextEntry
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        type="password"
                    />

                    {/* Continue Button */}
                    <AppButton title="Continue" onPress={handleContinue} />
                </View>

                {/* Success Modal */}
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
                            <Text style={styles.modalTitle}>Password Changed!</Text>
                            <Text style={styles.modalSubtitle}>
                                You can now use your new password to login to your account.
                            </Text>
                            <View style={{ width: "100%" }}>
                                <AppButton
                                    title="Login"
                                    onPress={() => {
                                        setModalVisible(false);
                                        navigation.navigate("Login");
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
        backgroundColor: '#fff',
    },
    backButton: {
        marginBottom: 20,
    },
    backIcon: {
        width: 24,
        height: 24,
        resizeMode: "contain",
    },
    title: {
        fontSize: 24,
        fontWeight: "700",
        marginBottom: 10,
        color: "#000",
    },
    subtitle: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
    },
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
