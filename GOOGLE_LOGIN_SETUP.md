# Android Google Login

The Google button signs in through Google and Firebase, creates a missing user
profile, and sends returning users to Dashboard or new users to Welcome.

## Firebase configuration required

1. Open https://console.firebase.google.com/project/pocketsmart-c7cb4/authentication/providers
   and enable Google. Select the project's support email.
2. In Project Settings, select Android app `com.pocketsmart.app`. Register the
   SHA-1 and SHA-256 fingerprints for debug and release certificates. For Play
   Store installs, also register the Play App Signing certificate from Play
   Console (the upload certificate alone is insufficient).
3. Download the updated `google-services.json` and replace both
   `google-services.json` and `android/app/google-services.json`.
   The app reads the type-3 web OAuth client ID from this file; do not use the
   Android OAuth client ID. The currently supplied files have no OAuth clients.
4. Build and install a new Android binary. A Metro reload or Expo Go cannot add
   this native dependency.

Run `./gradlew.bat :app:signingReport` from `android` to inspect local certificate
fingerprints, and `./gradlew.bat :app:assembleDebug` to build a debug APK.

Local debug certificate:

```text
SHA-1: 5E:8F:16:06:2E:A3:CD:2C:4A:0D:54:78:76:BA:A6:F3:8C:AB:F6:25
SHA-256: FA:C6:17:45:DC:09:03:78:6F:B9:ED:E6:2A:96:2B:39:9F:73:48:F0:BB:6F:89:9B:83:32:66:75:91:03:3B:9C
```

## Device acceptance checks

- New Google account: profile is created and Welcome opens.
- Existing account: saved profile and onboarding remain intact.
- Completed onboarding: Dashboard opens and Back cannot return to Login.
- Cancel the account picker: stay on Login without an error.
- Repeated taps: only one authentication attempt runs.
- Logout, then Google login: account selection is offered again.
- Relaunch: Firebase restores the signed-in session.
- Check offline, unavailable Play services, disabled accounts, and credentials
  belonging to another login provider.

Firebase persists native sessions automatically. The existing Keep Logged In
checkbox controls the app's cached profile, not Firebase session persistence.

Reference: https://rnfirebase.io/auth/social-auth
