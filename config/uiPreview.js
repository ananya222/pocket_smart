import { Platform } from "react-native";
import { isRunningInExpoGo } from "expo";

// Expo Go cannot load this app's native Firebase modules, so use the existing
// data-free UI gallery only for iOS Expo Go development. Android and custom
// native builds keep the Firebase-backed app path unchanged.
export const UI_PREVIEW_MODE =
  typeof __DEV__ !== "undefined" &&
  __DEV__ &&
  (Platform.OS === "web" || (Platform.OS === "ios" && isRunningInExpoGo()));
