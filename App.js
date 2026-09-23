import React, { createContext, useContext, useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { AccessibilityInfo, Easing, View, ActivityIndicator, Platform, Text } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as NavigationBar from "expo-navigation-bar";
import { auth, firestore } from "./config";
import { UI_VERSION } from "./config/uiVersion";
import { UI_PREVIEW_MODE } from "./config/uiPreview";
import { colors, radius, shadows, spacing, typography } from "./theme/theme";

// Keep the development gallery out of the production module-evaluation path.
// Metro still bundles it for web development, but native/production startup
// never evaluates the mock screen tree when UI_PREVIEW_MODE is false.
const UIDevGallery = UI_PREVIEW_MODE ? require("./screens/dev/UIDevGallery").default : null;
const DevNormalModeScreen = UI_PREVIEW_MODE ? require("./screens/dev/DevNormalModeScreen").default : null;

import LoginScreen from "./screens/login/Login/LoginScreen";
import SignupScreen from "./screens/signup/Signup/SignupScreen";
import WelcomeScreen from "./screens/onboarding/Welcome/WelcomeScreen";
import PocketMoneyScreen from "./screens/onboarding/PocketMoney/PocketMoneyScreen";
import SavingsGoalScreen from "./screens/onboarding/SavingsGoal/SavingsGoalScreen";
import OnboardingCompleteScreen from "./screens/onboarding/OnboardingComplete/OnboardingCompleteScreen";
import DashboardScreen from "./screens/dashboard/Dashboard/DashboardScreen";
import AddExpenseScreen from "./screens/dashboard/transactions/AddExpense/AddExpenseScreen";
import ExpenseReflectionScreen from "./screens/dashboard/transactions/ExpenseReflection/ExpenseReflectionScreen";
import InsightsScreen from "./screens/dashboard/transactions/Insights/InsightsScreen";
import ProfileScreen from "./screens/dashboard/Profile/ProfileScreen";
import GoalsScreen from "./screens/dashboard/goals/Goals/GoalsScreen";
import ConfirmGoalScreen from "./screens/dashboard/goals/GoalConfirmation/ConfirmGoalScreen";
import AllocationScreen from "./screens/dashboard/goals/GoalAllocation/AllocationScreen";
import GoalAchievedScreen from "./screens/dashboard/goals/GoalAchieved/GoalAchievedScreen";

import WelcomeScreenV2 from "./screens/v2/WelcomeScreen";
import PocketMoneyScreenV2 from "./screens/v2/PocketMoneyScreen";
import SavingsGoalScreenV2 from "./screens/v2/SavingsGoalScreen";
import OnboardingCompleteScreenV2 from "./screens/v2/OnboardingCompleteScreen";
import DashboardScreenV2 from "./screens/v2/DashboardScreen";
import AddMoneyScreenV2 from "./screens/v2/AddMoneyScreen";
import GoalsScreenV2 from "./screens/v2/GoalsScreen";
import InsightsScreenV2 from "./screens/v2/InsightsScreen";
import ProfileScreenV2 from "./screens/v2/ProfileScreen";
import ChangePasswordScreenV2 from "./screens/v2/ChangePasswordScreen";
import AddExpenseScreenV2 from "./screens/v2/AddExpenseScreen";
import ExpenseReflectionScreenV2 from "./screens/v2/ExpenseReflectionScreen";
import ExpenseCategoryScreenV2 from "./screens/v2/ExpenseCategoryScreen";
import { ConfirmGoalScreenV2, AllocationScreenV2, AllocationEmptyScreen, AllocationSuccessScreenV2, GoalAchievedScreenV2 } from "./screens/v2/GoalFlowScreens";


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const IS_V2 = UI_VERSION === "v2";
const APP_BACKGROUND = IS_V2 ? colors.background : "#111210";
const ReduceMotionContext = createContext(true);
const TAB_TRANSITION = { animation: "timing", config: { duration: 180, easing: Easing.inOut(Easing.ease) } };

function DashboardTabs({ route, navigation }) {
  const reduceMotion = useContext(ReduceMotionContext);
  const user = route.params?.user || {};
  const accentColor = IS_V2 ? colors.text : "#9D4EDD";
  const insets = useSafeAreaInsets();
  const tabLabel = (label) => IS_V2 ? ({ color, focused }) => <Text style={{ ...typography.navigation, color, fontFamily: focused ? typography.button.fontFamily : typography.navigation.fontFamily }}>{label}</Text> : label;

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        animation: reduceMotion ? "none" : "fade",
        transitionSpec: reduceMotion ? { animation: "timing", config: { duration: 0 } } : TAB_TRANSITION,
        sceneStyle: { backgroundColor: APP_BACKGROUND },
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: IS_V2 ? colors.textMuted : "#8A90A8",
        tabBarStyle: {
          backgroundColor: IS_V2 ? colors.background : "#111210",
          borderTopWidth: 1,
          borderTopColor: IS_V2 ? colors.divider : "rgba(255, 255, 255, 0.08)",
          borderTopLeftRadius: IS_V2 ? 0 : 16,
          borderTopRightRadius: IS_V2 ? 0 : 16,
          // Keep the designed footer height stable and add the device's system
          // inset so it stays clear of gesture and three-button navigation.
          height: IS_V2 ? 80 + insets.bottom : 60 + insets.bottom,
          paddingTop: IS_V2 ? 16 : 4,
          paddingBottom: IS_V2 ? insets.bottom + 8 : insets.bottom,
          paddingHorizontal: IS_V2 ? 26 : 0,
          elevation: IS_V2 ? 0 : 8,
          shadowColor: IS_V2 ? shadows.subtle.shadowColor : "#000",
          shadowOffset: IS_V2 ? { width: 0, height: 0 } : { width: 0, height: -4 },
          shadowOpacity: IS_V2 ? 0 : 0.4,
          shadowRadius: IS_V2 ? 0 : 12,
          overflow: "visible",
        },
        tabBarItemStyle: {
          flex: 1,
          // The HTML footer starts its 56px item block immediately below the
          // 16px top padding. Keeping the block top-aligned preserves the
          // intentional cream space below its labels.
          justifyContent: IS_V2 ? "flex-start" : "center",
          alignItems: "center",
          minHeight: IS_V2 ? 56 : undefined,
          paddingTop: IS_V2 ? 0 : 8,
          paddingBottom: IS_V2 ? 0 : 8,
        },
        tabBarIconStyle: {
          marginBottom: IS_V2 ? 7 : 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontFamily: IS_V2 ? typography.navigation.fontFamily : "SourceSansPro-SemiBold",
          ...(IS_V2 ? typography.navigation : {}),
          marginTop: IS_V2 ? 0 : 3,
        },
        tabBarBackground: !IS_V2 ? () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={{
              flex: 1,
              borderRadius: 24,
              backgroundColor: "transparent",
            }}
          />
        ) : undefined,
      }}
    >
      <Tab.Screen
        name="Home"
        component={IS_V2 ? DashboardScreenV2 : DashboardScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: tabLabel("Home"),
          tabBarIcon: ({ color }) => <Feather name="home" size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Goals"
        component={IS_V2 ? GoalsScreenV2 : GoalsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: tabLabel("Goals"),
          tabBarIcon: ({ color }) => <Feather name="layers" size={18} color={color} />,
        }}
      />
      {!IS_V2 ? <Tab.Screen
        name="AddExpenseTab"
        component={View}
        options={{
          tabBarLabel: "",
          tabBarItemStyle: {
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 4,
            paddingBottom: 0,
          },
          tabBarIcon: () => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: radius.hero,
              backgroundColor: accentColor,
              justifyContent: "center",
              alignItems: "center",
              ...Platform.select({
                ios: {
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: IS_V2 ? 0.08 : 0.5,
                  shadowRadius: IS_V2 ? 4 : 8,
                },
                android: {
                  elevation: IS_V2 ? 1 : 6,
                },
              }),
            }}>
              <Feather name="plus" size={22} color="#FFFFFF" />
            </View>
          ),
        }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("AddExpense", { user });
          },
        }}
      /> : null}
      <Tab.Screen
        name="Insights"
        component={IS_V2 ? InsightsScreenV2 : InsightsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: tabLabel("Insights"),
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={18} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={IS_V2 ? ProfileScreenV2 : ProfileScreen}
        initialParams={{ user }}
        options={{
          tabBarButton: IS_V2 ? () => null : undefined,
          // Hiding only the button leaves React Navigation's flex wrapper
          // occupying a fourth column. Remove that wrapper from layout too.
          tabBarItemStyle: IS_V2 ? { display: "none" } : undefined,
          tabBarLabel: tabLabel("Profile"),
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const navigationTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: APP_BACKGROUND,
  },
};

export default function App() {
  const [reduceMotion, setReduceMotion] = useState(true);
  useEffect(() => {
    let active = true;
    let preferenceChanged = false;
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", (enabled) => {
      preferenceChanged = true;
      setReduceMotion(enabled);
    });
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      if (active && !preferenceChanged) setReduceMotion(enabled);
    }).catch(() => {});
    return () => { active = false; subscription.remove(); };
  }, []);
  const [checkingSession, setCheckingSession] = useState(!UI_PREVIEW_MODE);
  const [initialUser, setInitialUser] = useState(null);
  const [initialRoute, setInitialRoute] = useState(UI_PREVIEW_MODE ? "DevGallery" : "Login");

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setPositionAsync("relative");
      NavigationBar.setBackgroundColorAsync(APP_BACKGROUND);
      NavigationBar.setButtonStyleAsync(IS_V2 ? "dark" : "light");
    }
  }, []);

  const [fontsLoaded] = useFonts({
    "Inter-Regular": require("./assets/fonts/Inter-Regular.ttf"),
    "Inter-SemiBold": require("./assets/fonts/Inter-SemiBold.ttf"),
    "Inter-Bold": require("./assets/fonts/Inter-Bold.ttf"),
    // Map existing names to the new Source Serif Pro and Source Sans Pro fonts
    "SFProDisplay-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "SFProDisplay-Bold": require("./assets/fonts/SourceSansPro-Bold.ttf"),
    "DMSerifDisplay-Regular": require("./assets/fonts/SourceSerifPro-Regular.ttf"),
    "DMSans-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "Manrope": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "Geist-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "Geist-SemiBold": require("./assets/fonts/SourceSansPro-SemiBold.ttf"),

    // Native registrations
    "SourceSerifPro-Regular": require("./assets/fonts/SourceSerifPro-Regular.ttf"),
    "SourceSerifPro-Bold": require("./assets/fonts/SourceSerifPro-Bold.ttf"),
    "SourceSansPro-Regular": require("./assets/fonts/SourceSansPro-Regular.ttf"),
    "SourceSansPro-SemiBold": require("./assets/fonts/SourceSansPro-SemiBold.ttf"),
    "SourceSansPro-Bold": require("./assets/fonts/SourceSansPro-Bold.ttf"),
  });

  useEffect(() => {
    if (!fontsLoaded || UI_PREVIEW_MODE) return undefined;

    // Firebase Auth persists the session automatically.
    // onAuthStateChanged fires once on startup with the current user (or null).
    const unsubscribe = auth().onAuthStateChanged(async (firebaseUser) => {
      try {
        if (firebaseUser) {
          // User is signed in — fetch their profile from Firestore
          const userDoc = await firestore()
            .collection("users")
            .doc(firebaseUser.uid)
            .get();

          let userProfile = {};
          if (userDoc.exists) {
            userProfile = userDoc.data();
          }

          const user = {
            id: firebaseUser.uid,
            fullName: userProfile.fullName || firebaseUser.displayName || "",
            email: firebaseUser.email,
            phoneNumber: userProfile.phoneNumber || "",
            onboardingCompleted: userProfile.onboardingCompleted || false,
            onboarding: userProfile.onboarding || null,
          };

          setInitialUser(user);
          setInitialRoute(user.onboardingCompleted ? "Dashboard" : "Welcome");
        } else {
          // No signed-in user — go to Login
          setInitialRoute("Login");
        }
      } catch (err) {
        // Firestore read failed (e.g. offline) — fall back to Login
        console.warn("Session restore failed:", err);
        setInitialRoute("Login");
      } finally {
        setCheckingSession(false);
      }
    });

    // Unsubscribe the listener when the effect is cleaned up
    return unsubscribe;
  }, [fontsLoaded]);

  if (!fontsLoaded || (!UI_PREVIEW_MODE && checkingSession)) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: APP_BACKGROUND }}>
        <ActivityIndicator size="large" color={IS_V2 ? colors.primary : "#9D4EDD"} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <ReduceMotionContext.Provider value={reduceMotion}>
      <NavigationContainer theme={navigationTheme}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: reduceMotion ? "none" : "fade_from_bottom",
            contentStyle: { backgroundColor: APP_BACKGROUND },
            freezeOnBlur: false,
          }}
        >
        {UI_PREVIEW_MODE ? (
          <>
            <Stack.Screen name="DevGallery" component={UIDevGallery} />
            <Stack.Screen name="DevNormalApp" component={DevNormalModeScreen} />
          </>
        ) : null}
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />

        <Stack.Screen
          name="Welcome"
          component={IS_V2 ? WelcomeScreenV2 : WelcomeScreen}
          initialParams={initialRoute === "Welcome" ? { user: initialUser } : undefined}
        />

        <Stack.Screen
          name="PocketMoney"
          component={IS_V2 ? PocketMoneyScreenV2 : PocketMoneyScreen}
        />

        <Stack.Screen
          name="SavingsGoal"
          component={IS_V2 ? SavingsGoalScreenV2 : SavingsGoalScreen}
        />

        <Stack.Screen
          name="OnboardingComplete"
          component={IS_V2 ? OnboardingCompleteScreenV2 : OnboardingCompleteScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardTabs}
          initialParams={initialRoute === "Dashboard" ? { user: initialUser } : undefined}
        />

        <Stack.Screen
          name="AddMoney"
          component={IS_V2 ? AddMoneyScreenV2 : DashboardScreen}
        />

        <Stack.Screen
          name="ChangePassword"
          component={ChangePasswordScreenV2}
        />

        <Stack.Screen
          name="ConfirmGoal"
          component={IS_V2 ? ConfirmGoalScreenV2 : ConfirmGoalScreen}
        />

        <Stack.Screen
          name="Allocation"
          component={IS_V2 ? AllocationScreenV2 : AllocationScreen}
        />
        <Stack.Screen
          name="AllocationEmpty"
          component={IS_V2 ? AllocationEmptyScreen : AllocationScreen}
        />
        <Stack.Screen
          name="AllocationSuccess"
          component={IS_V2 ? AllocationSuccessScreenV2 : AllocationScreen}
        />
        <Stack.Screen
          name="GoalAchieved"
          component={IS_V2 ? GoalAchievedScreenV2 : GoalAchievedScreen}
        />
        <Stack.Screen
          name="AddExpense"
          component={IS_V2 ? AddExpenseScreenV2 : AddExpenseScreen}
        />
        <Stack.Screen
          name="ExpenseCategory"
          component={IS_V2 ? ExpenseCategoryScreenV2 : AddExpenseScreen}
        />
        <Stack.Screen
          name="Impact"
          component={IS_V2 ? ExpenseReflectionScreenV2 : ExpenseReflectionScreen}
        />
        </Stack.Navigator>
      </NavigationContainer>
      </ReduceMotionContext.Provider>
    </SafeAreaProvider>
  );
}
