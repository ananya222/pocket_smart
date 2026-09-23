import { auth } from "../config";

const INDIA_LOCAL_PHONE = /^[6-9]\d{9}$/;
const E164_PHONE = /^\+[1-9]\d{7,14}$/;

function phoneError(code, message) {
  const error = new Error(message);
  error.code = code;
  return error;
}

export function normalizePhoneNumber(value) {
  const compact = String(value || "").trim().replace(/[()\s-]/g, "");
  if (!compact) {
    throw phoneError("auth/missing-phone-number", "Enter your mobile number.");
  }

  let normalized = compact;
  if (normalized.startsWith("00")) normalized = `+${normalized.slice(2)}`;
  else if (INDIA_LOCAL_PHONE.test(normalized)) normalized = `+91${normalized}`;
  else if (/^0[6-9]\d{9}$/.test(normalized)) normalized = `+91${normalized.slice(1)}`;
  else if (/^91[6-9]\d{9}$/.test(normalized)) normalized = `+${normalized}`;

  if (!E164_PHONE.test(normalized)) {
    throw phoneError(
      "auth/invalid-phone-number",
      "Enter a valid 10-digit Indian mobile number or an international number with its country code."
    );
  }

  return normalized;
}

export function maskPhoneNumber(value) {
  const normalized = normalizePhoneNumber(value);
  const digits = normalized.replace(/\D/g, "");
  const prefix = normalized.startsWith("+91") ? "+91" : normalized.slice(0, normalized.indexOf(digits.slice(-4)));
  return `${prefix || "+"} **** ${digits.slice(-4)}`;
}

export function phoneAuthErrorMessage(error) {
  const code = String(error?.code || "");
  const messages = {
    "auth/missing-phone-number": "Enter your mobile number.",
    "auth/invalid-phone-number": "Enter a valid mobile number and try again.",
    "auth/invalid-verification-code": "That verification code is incorrect. Check the SMS and try again.",
    "auth/invalid-verification-id": "This verification session has expired. Request a new code.",
    "auth/session-expired": "This verification session has expired. Request a new code.",
    "auth/code-expired": "This verification code has expired. Request a new code.",
    "auth/quota-exceeded": "SMS delivery is temporarily unavailable. Please try again later.",
    "auth/too-many-requests": "Too many attempts. Please wait and try again later.",
    "auth/network-request-failed": "No internet connection. Check your network and try again.",
    "auth/operation-not-allowed": "Phone verification is not enabled yet. Enable Phone in Firebase Authentication.",
    "auth/app-not-authorized": "This Android app is not authorized for phone verification yet.",
    "auth/captcha-check-failed": "App verification failed. Check Google Play services and try again.",
    "auth/credential-already-in-use": "This phone number is already linked to another account.",
    "auth/provider-already-linked": "This phone number is already linked to this account.",
  };
  return messages[code] || "Phone verification could not finish. Please try again.";
}

export function requestPhoneVerification(value, forceResend = false) {
  const phoneNumber = normalizePhoneNumber(value);

  return new Promise((resolve, reject) => {
    let settled = false;
    const rejectOnce = (error) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    try {
      const listener = auth().verifyPhoneNumber(phoneNumber, 60, forceResend);
      listener.on(
        "state_changed",
        (snapshot) => {
          if (settled || !snapshot) return;
          if (snapshot.state === "error" || snapshot.error) {
            rejectOnce(snapshot.error || new Error("Phone verification failed."));
            return;
          }
          if (["sent", "timeout", "verified"].includes(snapshot.state) && snapshot.verificationId) {
            settled = true;
            resolve({
              phoneNumber,
              verificationId: snapshot.verificationId,
              autoCode: snapshot.code || null,
            });
          }
        },
        rejectOnce
      );
    } catch (error) {
      rejectOnce(error);
    }
  });
}

export function createPhoneCredential(verificationId, code) {
  const normalizedCode = String(code || "").replace(/\D/g, "");
  if (!verificationId || normalizedCode.length !== 6) {
    throw phoneError("auth/invalid-verification-code", "Enter the 6-digit verification code.");
  }
  return auth.PhoneAuthProvider.credential(verificationId, normalizedCode);
}
