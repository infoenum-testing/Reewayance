// helpers/firebaseErrorMessages.js
export const getErrorMessage = (code) => {
    switch (code) {
        case "auth/invalid-email":
            return "Please enter a valid email address.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password. Try again.";
        case "auth/email-already-in-use":
            return "This email is already registered.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";
        case "auth/network-request-failed":
            return "Network error. Please check your connection.";
        case "auth/user-not-found":
            return "No account found with this email.";
        case "auth/wrong-password":
            return "Incorrect password. Please try again.";
        case "auth/user-disabled":
            return "This account has been disabled. Contact support.";

        /** Forgot Password */
        case "auth/missing-android-pkg-name":
        case "auth/missing-continue-uri":
        case "auth/missing-ios-bundle-id":
        case "auth/invalid-continue-uri":
        case "auth/unauthorized-continue-uri":
            return "Unable to send reset link. Please try again.";

        /** OTP / Email Verification */
        case "auth/invalid-action-code":
            return "The verification code is invalid or expired.";
        case "auth/expired-action-code":
            return "The verification code has expired. Please request a new one.";
        case "auth/user-mismatch":
            return "This code does not match the current user.";
        case "auth/invalid-verification-code":
            return "Invalid verification code. Please try again.";
        case "auth/invalid-verification-id":
            return "Invalid verification ID. Please restart the verification.";

        /** Reset Password */
        case "auth/expired-oob-code":
            return "The reset link has expired. Please request a new one.";
        case "auth/invalid-oob-code":
            return "The reset link is invalid. Please request again.";
        case "auth/user-token-expired":
            return "Session expired. Please log in again.";
        case "auth/weak-password":
            return "Password should be at least 6 characters.";

        /** Logout */
        case "auth/no-current-user":
            return "No user is currently logged in.";

        /** Delete Account */
        case "auth/requires-recent-login":
            return "Please log in again to delete your account.";
        case "auth/user-not-found":
            return "User not found. Account may already be deleted.";

        /** Default */
        default:
            return "Something went wrong. Please try again.";
    }
};
