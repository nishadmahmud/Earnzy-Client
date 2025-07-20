import { createContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to get and store Firebase access token
  const getAndStoreToken = async (user) => {
    if (user) {
      try {
        const token = await user.getIdToken();
        localStorage.setItem('firebaseAccessToken', token);
        console.log('✅ Firebase access token stored in localStorage');
      } catch (error) {
        console.error('❌ Error getting Firebase token:', error);
      }
    } else {
      // Remove token when user is null (logged out)
      localStorage.removeItem('firebaseAccessToken');
      console.log('🗑️ Firebase access token removed from localStorage');
    }
  };

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const googleSignIn = () => {
    setLoading(true);
    const provider = new GoogleAuthProvider();
    return signInWithPopup(auth, provider);
  };

  const logOut = () => {
    setLoading(true);
    return signOut(auth);
  };

  const updateUserProfile = async (name, photo) => {
    await updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
    setUser((prev) => ({ ...prev, displayName: name, photoURL: photo }));
  };

  const sendPasswordReset = (email) => {
    setLoading(true);
    return sendPasswordResetEmail(auth, email).finally(() => setLoading(false));
  };

  // Function to get stored token (useful for API calls)
  const getStoredToken = () => {
    return localStorage.getItem('firebaseAccessToken');
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      setLoading(false);
      
      // Store or remove token based on auth state
      await getAndStoreToken(user);
    });
    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
    sendPasswordReset,
    getStoredToken, // Add this to the context
  };

  return <AuthContext.Provider value={authInfo}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
