import { Platform } from "react-native";
import { auth } from "../config";
import { ensureFirebaseProfile, toAppUser } from "./firebaseProfile";

const APPLE_PROVIDER_ID = "apple.com";

function isUserCancellation(error) {
  const code = String(error?.code || "").toLowerCase();
  const message = String(error?.message || "").toLowerCase();
  return (
    code.includes("cancel") ||
    code.includes("popup-closed") ||
    message.includes("cancel") ||
    message.includes("popup closed")
  );
}

function mapAppleError(error) {
  const code = String(error?.code || "");
  if (isUserCancellation(error)) return null;

  const messages = {
    "auth/operation-not-allowed": "Apple login is not enabled yet. Enable Apple in Firebase Authentication.",
    "auth/account-exists-with-different-credential": "An account already exists with this email. Use your original login method, then link Apple from account settings.",
    "auth/network-request-failed": "Please check your internet connection and try again.",
    "auth/invalid-credential": "Apple could not verify your account. Please try again.",
  };
  return messages[code] || "Apple login could not finish. Please try again.";
}

export async function signInWithApple() {
  if (Platform.OS !== "android") {
    throw new Error("Apple login is currently available on Android only.");
  }

  try {
    // RN Firebase's native provider flow opens Apple's browser OAuth screen
    // on Android and resolves with a Firebase user when it returns.
    const provider = new auth.OAuthProvider(APPLE_PROVIDER_ID);
    provider.addScope("email");
    provider.addScope("name");
    const result = await auth().signInWithPopup(provider);
    const firebaseUser = result.user;
    const profile = await ensureFirebaseProfile(firebaseUser);
    return toAppUser(firebaseUser, profile);
  } catch (error) {
    console.error("Apple login failed:", error?.code, error?.message);
    if (isUserCancellation(error)) return null;
    throw new Error(mapAppleError(error));
  }
}
