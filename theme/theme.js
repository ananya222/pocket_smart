// PocketSmart V2 design tokens.
// V1 keeps its own screen-level styles and does not depend on this file.
export const colors = {
  background: "#F5F2EB",
  referenceBackground: "#F5F2EB",
  referenceSecondarySurface: "#FCFAF6",
  surface: "#FCFAF6",
  inputSurface: "#FAF8F3",
  surfaceMuted: "#EEEBE4",
  surfaceRaised: "#FCFAF6",
  elevated: "#FCFAF6",
  border: "rgba(48,44,39,0.09)",
  divider: "rgba(48,44,39,0.09)",
  referenceBorder: "rgba(48,44,39,0.09)",
  referenceDivider: "rgba(48,44,39,0.09)",
  text: "#302C27",
  textMuted: "#736B60",
  textSubtle: "#948A7D",
  primary: "#302C27",
  primaryPressed: "#484138",
  primarySoft: "#EEEBE4",
  accent: "#81613E",
  success: "#486653",
  successSoft: "#E7EEE6",
  coral: "#B86C5E",
  coralSoft: "#F4E2DC",
  blue: "#65829A",
  blueSoft: "#E4EBEE",
  amber: "#DFA83A",
  amberSoft: "#FAF3DF",
  warning: "#DFA83A",
  warningSoft: "#FAF3DF",
  danger: "#DF6262",
  dangerSoft: "#FCEBE9",
  info: "#4D88E8",
  white: "#FFFFFF",
  // Semantic accents used by the Monzo-inspired V2 Dashboard and Goals UI.
  // Keeping these in one palette makes the preview colours consistent without
  // changing the existing V1 styling tokens.
  semantic: {
    primary: "#81613E",
    primarySoft: "#EEEBE4",
    primaryTrack: "#C7B69F",
    food: "#F36F63",
    foodSoft: "#FFF0EC",
    foodTrack: "#F8A59D",
    transport: "#4389E8",
    transportSoft: "#EDF4FF",
    transportTrack: "#8BB5F2",
    education: "#249B91",
    educationSoft: "#EAF7F4",
    educationTrack: "#81CBC4",
    success: "#3EAA7A",
    successSoft: "#EAF7F0",
    successTrack: "#8FD4B4",
    goalCoral: "#F3A19A",
    goalCoralTrack: "#F7AAA3",
    goalCoralBorder: "#EAA09A",
    goalBlue: "#78A8EA",
    goalBlueTrack: "#92B9EF",
    goalBlueBorder: "#72A0D9",
    goalTeal: "#63B9B1",
    goalTealTrack: "#86CDC7",
    goalTealBorder: "#5DACA5",
    goalGreen: "#72BC93",
    goalGreenTrack: "#8BCFAF",
    goalGreenBorder: "#69AE89",
    warning: "#DDA53A",
    warningSoft: "#FFF7E7",
    danger: "#E45F5F",
    dangerSoft: "#FCEBE9",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  huge: 40,
  massive: 48,
};

export const radius = {
  hero: 20,
  card: 16,
  input: 8,
  button: 8,
  icon: 12,
  chip: 10,
  circle: 999,
};

export const control = {
  buttonHeight: 54,
  inputHeight: 54,
  iconSize: 40,
  progressHeight: 6,
};

export const shadows = {
  subtle: {
    shadowColor: "#19191D",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 1,
  },
  none: {
    shadowOpacity: 0,
    elevation: 0,
  },
};

export const typography = {
  display: { fontFamily: "SourceSerifPro-Regular", fontSize: 33, lineHeight: 38 },
  heading: { fontFamily: "SourceSerifPro-Regular", fontSize: 33, lineHeight: 38 },
  section: { fontFamily: "Inter-SemiBold", fontSize: 15, lineHeight: 20 },
  body: { fontFamily: "Inter-Regular", fontSize: 14, lineHeight: 23 },
  small: { fontFamily: "Inter-Regular", fontSize: 13, lineHeight: 18 },
  label: { fontFamily: "Inter-Regular", fontSize: 13, lineHeight: 18 },
  button: { fontFamily: "Inter-SemiBold", fontSize: 14, lineHeight: 20 },
  input: { fontFamily: "Inter-Regular", fontSize: 15, lineHeight: 22 },
  eyebrow: { fontFamily: "Inter-SemiBold", fontSize: 11, lineHeight: 17, letterSpacing: 1.5 },
  navigation: { fontFamily: "Inter-Regular", fontSize: 10, lineHeight: 14 },
  money: { fontFamily: "Inter-Bold", fontSize: 34, lineHeight: 40 },
};

export const formatMoney = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric.toLocaleString("en-IN", { maximumFractionDigits: 2 }) : "0";
};

export const sanitizeMoneyInput = (value) => {
  const raw = String(value ?? "").replace(/,/g, "");
  const sign = raw.trim().startsWith("-") ? "-" : "";
  const cleaned = raw.replace(/[^0-9.]/g, "");
  const [whole = "", ...fractionParts] = cleaned.split(".");
  return `${sign}${whole}${fractionParts.length ? `.${fractionParts.join("")}` : ""}`;
};

export const parseMoney = (value) => {
  const numeric = Number(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(numeric) ? numeric : 0;
};
