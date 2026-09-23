let pendingSignup = null;

export function setSignupDraft(draft) {
  pendingSignup = { ...draft };
  return pendingSignup;
}

export function getSignupDraft() {
  return pendingSignup;
}

export function updateSignupDraft(changes) {
  if (!pendingSignup) return null;
  pendingSignup = { ...pendingSignup, ...changes };
  return pendingSignup;
}

export function clearSignupDraft() {
  pendingSignup = null;
}
