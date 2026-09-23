import { firestore } from "../config";

/**
 * Return the app profile for a Firebase user, creating the base profile when
 * this is the user's first social sign-in.
 */
export async function ensureFirebaseProfile(firebaseUser) {
  const profileRef = firestore().collection("users").doc(firebaseUser.uid);
  let profile;
  let fallbackProfile;

  await firestore().runTransaction(async (transaction) => {
    const snapshot = await transaction.get(profileRef);
    if (snapshot.exists) {
      profile = snapshot.data() || {};
      return;
    }

    fallbackProfile = {
      fullName: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      phoneNumber: "",
      onboardingCompleted: false,
      onboarding: null,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    transaction.set(profileRef, fallbackProfile);
    profile = fallbackProfile;
  });

  // Confirm the committed document. This also repairs a profile that was
  // missing when an older sign-in session was restored.
  const committedSnapshot = await profileRef.get();
  if (committedSnapshot.exists) {
    profile = committedSnapshot.data() || profile || {};
  } else {
    fallbackProfile = fallbackProfile || {
      fullName: firebaseUser.displayName || "",
      email: firebaseUser.email || "",
      phoneNumber: "",
      onboardingCompleted: false,
      onboarding: null,
      createdAt: firestore.FieldValue.serverTimestamp(),
    };
    await profileRef.set(fallbackProfile, { merge: true });
    profile = fallbackProfile;
  }

  return profile;
}

export function toAppUser(firebaseUser, profile = {}) {
  return {
    id: firebaseUser.uid,
    fullName: profile.fullName || firebaseUser.displayName || "",
    email: profile.email || firebaseUser.email || "",
    phoneNumber: profile.phoneNumber || "",
    onboardingCompleted: profile.onboardingCompleted || false,
    onboarding: profile.onboarding || null,
  };
}
