import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";

import warningCircle from "../assets/warningCircle.png";
import eyeOn from "../assets/eyeOn.png";
import eyeOff from "../assets/eyeOff.png";
import rightCheck from "../assets/rightCheck.png";
import { validateInput } from "../validation/validateInput";

export default function AppTextInput({
    label,
    placeholder,
    secureTextEntry = false,
    value = "",
    onChangeText = () => {},
    type = "default",
    forceValidation = false, // 🔹 new prop
}) {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [touched, setTouched] = useState(false);

    const { isValid, errorMessage } = validateInput(type, value);

    const shouldShowError = (touched || forceValidation) && !isValid;
    const shouldShowSuccess = (touched || forceValidation) && isValid;

    return (
        <View style={styles.container}>
            {label && <Text style={styles.label}>{label}</Text>}

            <View
                style={[
                    styles.inputContainer,
                    shouldShowError && { borderColor: "red" },
                    shouldShowSuccess && { borderColor: "green" },
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
                        type === "number"
                            ? "numeric"
                            : type === "email"
                                ? "email-address"
                                : "default"
                    }
                    onBlur={() => setTouched(true)}
                />

                <View style={styles.iconWrapper}>
                    {type === "password" && (
                        <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)}>
                            <Image
                                source={isPasswordVisible ? eyeOn : eyeOff}
                                style={styles.eyeIcon}
                            />
                        </TouchableOpacity>
                    )}

                    {type !== "password" && shouldShowError && (
                        <Image source={warningCircle} style={styles.icon} />
                    )}

                    {type !== "password" && shouldShowSuccess && (
                        <Image source={rightCheck} style={styles.icon} />
                    )}
                </View>
            </View>

            {shouldShowError && <Text style={styles.errorText}>{errorMessage}</Text>}
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
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: "#333",
        paddingVertical: 15,
    },
    iconWrapper: {
        flexDirection: "row",
        alignItems: "center",
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
