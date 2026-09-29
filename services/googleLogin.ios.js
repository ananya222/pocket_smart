// Google Sign-In is not configured for iOS in this app. Keep the Android-only
// google-services.json out of the iOS Metro bundle.
export async function signInWithGoogle() {
  throw new Error("Google login is currently available on Android only.");
}
