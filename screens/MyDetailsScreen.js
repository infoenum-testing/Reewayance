// screens/MyDetailsScreen.js
import React, { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

const Icons = {
  back: require("../assets/backButtonImage.png"),
  vector: require("../assets/images/vector.png"),
};

const MyDetailsScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);           // initial fetch
  const [saving, setSaving] = useState(false);            // save progress
  const [isEditing, setIsEditing] = useState(false);

  const user = useMemo(() => auth().currentUser, []);
  const uid = user?.uid;

  const [fullName, setFullName] = useState("");
  const [email, setEmail]       = useState("");
  const [phone, setPhone]       = useState("");
  const [address, setAddress]   = useState("");

  // Fetch user details
  useEffect(() => {
    const init = async () => {
      try {
        if (!user) {
          Alert.alert("Not logged in", "Please log in to view your details.", [
            { text: "OK", onPress: () => navigation.goBack() },
          ]);
          return;
        }

        // Start with Auth fields
        setEmail(user.email ?? "");
        setFullName(user.displayName ?? "");

        // Merge with Firestore fields if present
        const docRef = firestore().collection("users").doc(uid);
        const snap = await docRef.get();

        if (snap.exists) {
          const data = snap.data() || {};
          if (data.fullName) setFullName(String(data.fullName)); 
          if (data.phone) setPhone(String(data.phone));
          if (data.address) setAddress(String(data.address));
          if (data.email) setEmail(String(data.email));
        } else {
          // Optionally, create a shell document so it exists next time
          await docRef.set(
            {
              email: user.email ?? "",
              fullName: user.displayName ?? "",
              phone: "",
              address: "",
              updatedAt: firestore.FieldValue.serverTimestamp(),
              createdAt: firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      } catch (e) {
        console.log("Fetch details error", e);
        Alert.alert("Error", "Failed to load your details. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigation, uid, user]);

  const onToggleEdit = () => setIsEditing((prev) => !prev);

  const onSave = async () => {
    if (!uid) return;

    if (!fullName.trim()) {
      Alert.alert("Validation", "Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      Alert.alert("Validation", "Email can’t be empty.");
      return;
    }

    setSaving(true);
    try {
      const docRef = firestore().collection("users").doc(uid);

      // 1) Update Firestore profile
      await docRef.set(
        {
          fullName: fullName.trim(),
          email: email.trim(),
          phone: phone.trim(),
          address: address.trim(),
          updatedAt: firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );

      // 2) Keep Auth profile in sync (best-effort)
      // Display name
      if (user.displayName !== fullName.trim()) {
        await user.updateProfile({ displayName: fullName.trim() }).catch(() => {});
      }
      // Email (may require recent login)
      if (user.email !== email.trim()) {
        try {
          await user.updateEmail(email.trim());
        } catch (err) {
          // If updateEmail fails (requires re-auth), keep Firestore value and warn gracefully.
          console.log("updateEmail error", err);
          Alert.alert(
            "Email not updated in Auth",
            "We updated your details, but to change your login email you may need to re-authenticate. Please log out and log in again, then try updating your email."
          );
        }
      }

      setIsEditing(false);
      Alert.alert("Saved", "Your details have been updated.");
    } catch (e) {
      console.log("Save details error", e);
      Alert.alert("Error", "Could not save your details. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const renderHeader = () => (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image source={Icons.back} style={styles.headerIcon} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>My Details</Text>
      <TouchableOpacity>
        <Image source={Icons.vector} style={styles.headerIcon} />
      </TouchableOpacity>
    </View>
  );

  const renderField = (label, value, onChangeText, placeholder, editable = true, keyboardType = "default") => (
    <View style={styles.fieldCard}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.input, !isEditing && styles.inputDisabled]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#999"
        editable={isEditing && editable}
        keyboardType={keyboardType}
        autoCapitalize={label === "Full Name" ? "words" : "none"}
      />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}

      {loading ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={{ flex: 1 }}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {renderField("Full Name", fullName, setFullName, "Enter your full name")}
            {renderField("Email", email, setEmail, "Enter your email", true, "email-address")}
            {renderField("Phone", phone, setPhone, "Enter your phone number", true, "phone-pad")}
            {renderField("Address", address, setAddress, "Enter your address")}

            <View style={styles.actionsRow}>
              <TouchableOpacity
                onPress={isEditing ? onSave : onToggleEdit}
                activeOpacity={0.8}
                style={[styles.primaryBtn, isEditing && styles.saveBtn]}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator />
                ) : (
                  <Text style={styles.primaryBtnText}>{isEditing ? "Save" : "Edit"}</Text>
                )}
              </TouchableOpacity>

              {isEditing && (
                <TouchableOpacity
                  onPress={() => {
                    // Reset UI edits by refetching quickly
                    setLoading(true);
                    setIsEditing(false);
                    // Re-run fetch
                    firestore()
                      .collection("users")
                      .doc(uid)
                      .get()
                      .then((snap) => {
                        const data = snap.data() || {};
                        setFullName(data.fullName ?? user?.displayName ?? "");
                        setEmail(data.email ?? user?.email ?? "");
                        setPhone(data.phone ?? "");
                        setAddress(data.address ?? "");
                      })
                      .catch(() => {})
                      .finally(() => setLoading(false));
                  }}
                  activeOpacity={0.8}
                  style={styles.secondaryBtn}
                >
                  <Text style={styles.secondaryBtnText}>Cancel</Text>
                </TouchableOpacity>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </SafeAreaView>
  );
};

export default MyDetailsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7" },

  // Header (matching your Account screen style)
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  headerTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  headerIcon: { width: 22, height: 22, tintColor: "#000" },

  content: {
    padding: 12,
    paddingBottom: 40,
  },

  fieldCard: {
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 14,
    marginHorizontal: 4,
    marginVertical: 6,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  fieldLabel: {
    fontSize: 12,
    color: "#777",
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  input: {
    fontSize: 16,
    color: "#111",
    paddingVertical: 8,
  },
  inputDisabled: {
    color: "#444",
  },

  actionsRow: {
    marginTop: 16,
    paddingHorizontal: 4,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: "#111",
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtn: {
    backgroundColor: "#0a7",
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
  },
  secondaryBtn: {
    paddingVertical: 14,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  secondaryBtnText: {
    fontSize: 15,
    color: "#111",
    fontWeight: "600",
  },

  loadingWrap: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
