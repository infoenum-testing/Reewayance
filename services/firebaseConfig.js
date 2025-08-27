// firebaseConfig.js
import auth from "@react-native-firebase/auth";

// Firebase automatically reads google-services.json (Android) 
// and GoogleService-Info.plist (iOS) so you don’t need to manually initialize app

// Export Firebase Auth instance
export const FirebaseAuth = auth();
