# Android Apple Login Setup

PocketSmart uses React Native Firebase's native `OAuthProvider("apple.com")`
flow on Android. Firebase opens Apple's browser OAuth screen and returns the
authenticated Firebase user to the app. No iOS native code is involved.

## Firebase Console

In project `pocketsmart-c7cb4`:

1. Open **Authentication → Sign-in method → Apple** and enable the provider.
2. Enter the Apple **Service ID** (client ID), **Team ID**, **Key ID**, and the
   contents of the Apple `.p8` private key.
3. Copy Firebase's displayed OAuth redirect URL into Apple Developer. The
   default project URL is:

   `https://pocketsmart-c7cb4.firebaseapp.com/__/auth/handler`

Firebase stores these provider credentials; do not put them in the Android app,
source control, or `.env` files shipped to the device.

## Apple Developer

Create or configure the following at `developer.apple.com/account`:

- A Sign in with Apple enabled App ID.
- A **Services ID** used as the Firebase Apple provider client ID.
- A Sign in with Apple key linked to that App ID.
- The Team ID and Key ID for that key.
- The Firebase redirect URL above registered on the Services ID.

Apple may return a private relay email address and may omit the name after the
first authorization. The app accepts both cases and falls back to Firebase's
stored user fields or onboarding.

## Testing

After enabling the provider, install a newly built Android APK and tap the Apple
button on Login or Signup. The browser flow cannot complete until the Apple
Developer credentials and Firebase provider configuration are present. Canceling
the browser returns to the auth screen without an error alert.
