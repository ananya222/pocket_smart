import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Feather } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import * as NavigationBar from "expo-navigation-bar";
import { auth, firestore } from "./config";

import LoginScreen from "./screens/login/Login/LoginScreen";
import SignupScreen from "./screens/signup/Signup/SignupScreen";
import OtpScreen from "./screens/login/OTP/OtpScreen";
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


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function DashboardTabs({ route, navigation }) {
  const user = route.params?.user || {};
  const accentColor = "#9D4EDD";
  const insets = useSafeAreaInsets();

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: accentColor,
        tabBarInactiveTintColor: "#8A90A8",
        tabBarStyle: {
          backgroundColor: "#111210",
          borderTopWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.08)",
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          height: 64 + insets.bottom,
          paddingBottom: insets.bottom,
          elevation: 8,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: 0.4,
          shadowRadius: 12,
          overflow: "hidden",
        },
        tabBarItemStyle: {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingTop: 8,
          paddingBottom: 8,
        },
        tabBarIconStyle: {
          marginBottom: 0,
        },
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "500",
          letterSpacing: 0.2,
          marginTop: 3,
        },
        tabBarBackground: () => (
          <BlurView
            intensity={80}
            tint="dark"
            style={{
              flex: 1,
              borderRadius: 24,
              backgroundColor: "transparent",
            }}
          />
        ),
      }}
    >
      <Tab.Screen
        name="Home"
        component={DashboardScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Home",
          tabBarIcon: ({ color }) => <Feather name="home" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Goals"
        component={GoalsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Goals",
          tabBarIcon: ({ color }) => <Feather name="target" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="AddExpenseTab"
        component={View}
        options={{
          tabBarLabel: "",
          tabBarItemStyle: {
            justifyContent: "flex-start",
            alignItems: "center",
            paddingTop: 12,
            paddingBottom: 0,
          },
          tabBarIcon: () => (
            <View style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: accentColor,
              justifyContent: "center",
              alignItems: "center",
              ...Platform.select({
                ios: {
                  shadowColor: accentColor,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.5,
                  shadowRadius: 8,
                },
                android: {
                  elevation: 6,
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
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Insights",
          tabBarIcon: ({ color }) => <Feather name="bar-chart-2" size={20} color={color} />,
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ user }}
        options={{
          tabBarLabel: "Profile",
          tabBarIcon: ({ color }) => <Feather name="user" size={20} color={color} />,
        }}
      />
    </Tab.Navigator>
  );
}

const darkTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#111210",
  },
};

export default function App() {
  const [checkingSession, setCheckingSession] = useState(true);
  const [initialUser, setInitialUser] = useState(null);
  const [initialRoute, setInitialRoute] = useState("Login");

  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setPositionAsync("relative");
      NavigationBar.setBackgroundColorAsync("#111210");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  const [fontsLoaded] = useFonts({
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
    if (!fontsLoaded) return;

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

  if (!fontsLoaded || checkingSession) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111210" }}>
        <ActivityIndicator size="large" color="#9D4EDD" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer theme={darkTheme}>
        <Stack.Navigator
          initialRouteName={initialRoute}
          screenOptions={{
            headerShown: false,
            animation: "fade",
            contentStyle: { backgroundColor: "#111210" },
            freezeOnBlur: false,
          }}
        >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
        />

        <Stack.Screen
          name="Otp"
          component={OtpScreen}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          initialParams={initialRoute === "Welcome" ? { user: initialUser } : undefined}
        />

        <Stack.Screen
          name="PocketMoney"
          component={PocketMoneyScreen}
        />

        <Stack.Screen
          name="SavingsGoal"
          component={SavingsGoalScreen}
        />

        <Stack.Screen
          name="OnboardingComplete"
          component={OnboardingCompleteScreen}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardTabs}
          initialParams={initialRoute === "Dashboard" ? { user: initialUser } : undefined}
        />

        <Stack.Screen
          name="ConfirmGoal"
          component={ConfirmGoalScreen}
        />

        <Stack.Screen
          name="Allocation"
          component={AllocationScreen}
        />
        <Stack.Screen
          name="GoalAchieved"
          component={GoalAchievedScreen}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
        />
        <Stack.Screen
          name="Impact"
          component={ExpenseReflectionScreen}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
