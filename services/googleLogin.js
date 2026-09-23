import { Platform } from "react-native";
import { auth } from "../config";
import googleServices from "../google-services.json";
import { ensureFirebaseProfile, toAppUser } from "./firebaseProfile";

let configured = false;

const isTransientCredentialError = (error) => {
  const code = String(error?.code || "");
  const message = String(error?.message || "");
  return ["auth/network-request-failed", "auth/unknown"].includes(code)
    && /network|ssl|connection reset|internal error/i.test(message);
};

export async function signInWithGoogle() {
  if (Platform.OS !== "android") {
    throw new Error("Google login is currently available on Android only.");
  }
  const client = googleServices.client.find(
    (entry) => entry.client_info.android_client_info?.package_name === "com.pocketsmart.app"
  );
  const webClientId = client?.oauth_client?.find((entry) => entry.client_type === 3)?.client_id;
  if (!webClientId) {
    throw new Error("Google login setup is incomplete. Please contact support.");
  }
  // Load only on Android so the existing web preview can still render.
  const { GoogleSignin, statusCodes } = require("@react-native-google-signin/google-signin");
  if (!configured) {
    GoogleSignin.configure({ webClientId });
    configured = true;
  }
  try {
    await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
    // Always offer account selection, including after a Firebase-only logout.
    await GoogleSignin.signOut();
    const response = await GoogleSignin.signIn();
    if (response.type === "cancelled") return null;
    const idToken = response.data?.idToken;
    if (!idToken) throw new Error("Google could not verify your account. Please try again.");
    // RNFirebase's Android bridge serializes an omitted access token as an
    // empty string, which GoogleAuthProvider rejects. Fetch both token values.
    const { accessToken } = await GoogleSignin.getTokens();
    if (!accessToken) throw new Error("Google could not provide an access token. Please try again.");
    const credential = auth.GoogleAuthProvider.credential(idToken, accessToken);
    let credentialResult;
    try {
      credentialResult = await auth().signInWithCredential(credential);
    } catch (error) {
      // Firebase may create the account before a transient Android transport
      // reset reaches the client. A single retry makes that operation idempotent.
      if (!isTransientCredentialError(error)) throw error;
      await new Promise((resolve) => setTimeout(resolve, 750));
      credentialResult = await auth().signInWithCredential(credential);
    }
    const { user: firebaseUser } = credentialResult;
    return toAppUser(firebaseUser, await ensureFirebaseProfile(firebaseUser));
  } catch (error) {
    // Keep the native/Firebase code visible in development logs. The user-facing
    // message below remains concise, but this makes configuration failures
    // diagnosable instead of collapsing them into a generic retry prompt.
    console.error("Google login failed:", error?.code, error?.message);
    if (error.code === statusCodes.SIGN_IN_CANCELLED) return null;
    const errorCode = String(error.code || "");
    const messages = {
      [statusCodes.IN_PROGRESS]: "Google login is already in progress.",
      [statusCodes.PLAY_SERVICES_NOT_AVAILABLE]: "Please install or update Google Play services and try again.",
      "10": "Google login is not configured for this app version. Please contact support.",
      "auth/operation-not-allowed": "Google login is not enabled yet. Please contact support.",
      "auth/account-exists-with-different-credential": "An account already exists with this email. Please use your original login method.",
      "auth/user-disabled": "This account has been disabled.",
      "auth/network-request-failed": "Please check your internet connection and try again.",
      "firestore/permission-denied": "Google sign-in worked, but PocketSmart cannot create your profile. Check Firestore security rules.",
      "firestore/unavailable": "Google sign-in worked, but PocketSmart cannot reach Firestore. Check your internet connection and try again.",
    };
    throw new Error(messages[errorCode] || "Google login could not finish. Please try again.");
  }
}
