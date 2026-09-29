import { auth } from "../config";
import { ensureFirebaseProfile, toAppUser } from "./firebaseProfile";

let configured = false;

export async function signInWithGoogle() {
  const { GoogleSignin, statusCodes } = require("@react-native-google-signin/google-signin");
  if (!configured) {
    // iOS reads its client ID from GoogleService-Info.plist.
    GoogleSignin.configure();
    configured = true;
  }

  try {
    const response = await GoogleSignin.signIn();
    if (response.type === "cancelled") return null;
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error("Google could not verify your account. Please try again.");

    const credential = auth.GoogleAuthProvider.credential(idToken);
    const { user: firebaseUser } = await auth().signInWithCredential(credential);
    return toAppUser(firebaseUser, await ensureFirebaseProfile(firebaseUser));
  } catch (error) {
    console.error("Google login failed:", error?.code, error?.message);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    const messages = {
      "10": "Google login is not configured for this iOS app. Please contact support.",
      "auth/operation-not-allowed": "Google login is not enabled yet. Please contact support.",
      "auth/account-exists-with-different-credential": "An account already exists with this email. Please use your original login method.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/network-request-failed": "Please check your internet connection and try again.",
      "firestore/permission-denied": "Google sign-in worked, but PocketSmart cannot create your profile. Check Firestore security rules.",
      "firestore/unavailable": "Google sign-in worked, but PocketSmart cannot reach Firestore. Check your internet connection and try again.",
    };
    throw new Error(messages[String(error.code || "")] || "Google login could not finish. Please try again.");
  }
}
