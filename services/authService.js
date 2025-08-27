// services/authService.js
import { FirebaseAuth } from "./firebaseConfig";

export const AuthService = {
  // ✅ Create User
  signUp: async (email, password, displayName) => {
    try {
      const userCredential = await FirebaseAuth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName });
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Login User
  login: async (email, password) => {
    try {
      const userCredential = await FirebaseAuth.signInWithEmailAndPassword(email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Logout User
  logout: async () => {
    try {
      await FirebaseAuth.signOut();
      return true;
    } catch (error) {
      throw error;
    }
  },

  // ✅ Get Current User
  getCurrentUser: () => {
    return FirebaseAuth.currentUser;
  },

  // ✅ Update User Profile
  updateProfile: async (updates) => {
    try {
      const user = FirebaseAuth.currentUser;
      if (user) {
        await user.updateProfile(updates);
        return user;
      }
      throw new Error("No user logged in");
    } catch (error) {
      throw error;
    }
  },

  // ✅ Delete User
  deleteAccount: async () => {
    try {
      const user = FirebaseAuth.currentUser;
      if (user) {
        await user.delete();
        return true;
      }
      throw new Error("No user logged in");
    } catch (error) {
      throw error;
    }
  },

  // ✅ Send Password Reset Email
  resetPassword: async (email) => {
    try {
      await FirebaseAuth.sendPasswordResetEmail(email);
      return true;
    } catch (error) {
      throw error;
    }
  },
};
