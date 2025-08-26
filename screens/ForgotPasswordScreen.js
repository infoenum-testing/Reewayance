import React, { useState } from "react";
import { 
    View, 
    Text, 
    StyleSheet, 
    ScrollView, 
    TouchableOpacity, 
    Image, 
    KeyboardAvoidingView, 
    Platform 
} from "react-native";
import AppTextInput from "../components/AppTextInput";
import { validateInput } from "../validation/validateInput";
import AppButton from "../components/AppButton";
// import colors from "../constants/colors";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import BackButtonImage from "../assets/backButtonImage.png";
import { ROUTES } from "../helper/routes";

export default function ForgotPasswordScreen({ navigation }) {
    const [email, setEmail] = useState("");

    const handleSendCode = () => {
        console.log("Sending code to:", email);
        navigation.navigate(ROUTES.Varification_SCREEN);
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
                        <Text style={styles.title}>Forgot password</Text>
                        <Text style={styles.subtitle}>
                            Enter your email for the verification process.{"\n"}
                            We will send a 4-digit code to your email.
                        </Text>

                        {/* Email Input */}
                        <AppTextInput
                            label="Email"
                            placeholder="cody.fisher45@example.com"
                            value={email}
                            onChangeText={setEmail}
                            type="email"
                        />
                    </ScrollView>

                    {/* Fixed Send Code Button */}
                    <View style={styles.buttonWrapper}>
                        <AppButton
                            title="Send Code"
                            onPress={handleSendCode}
                            disabled={!isEmailValid}
                            color={isEmailValid ? "#000" : "#999"}
                        />
                    </View>
                </KeyboardAvoidingView>
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
    buttonWrapper: {
        paddingVertical: 16,
    },
});
