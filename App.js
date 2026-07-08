import React, { useEffect, useState } from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE_URL } from "./config";

import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import OtpScreen from "./screens/OtpScreen";
import WelcomeScreen from "./screens/WelcomeScreen";
import PocketMoneyScreen from "./screens/PocketMoneyScreen";
import SavingsGoalScreen from "./screens/SavingsGoalScreen";
import OnboardingCompleteScreen from "./screens/OnboardingCompleteScreen";
import DashboardScreen from "./screens/DashboardScreen";
import GoalsScreen from "./screens/GoalsScreen";
import ConfirmGoalScreen from "./screens/ConfirmGoalScreen";
import AllocationScreen from "./screens/AllocationScreen";
import GoalAchievedScreen from "./screens/GoalAchievedScreen";
import InsightsScreen from "./screens/InsightsScreen";
import AddExpenseScreen from "./screens/AddExpenseScreen";
import ExpenseReflectionScreen from "./screens/ExpenseReflectionScreen";
import ProfileScreen from "./screens/ProfileScreen";


const Stack = createNativeStackNavigator();

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
      NavigationBar.setPositionAsync("absolute");
      NavigationBar.setBackgroundColorAsync("transparent");
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
    const checkSession = async () => {
      try {
        const sessionStr = await AsyncStorage.getItem("userSession");
        if (sessionStr) {
          const cachedUser = JSON.parse(sessionStr);
          if (cachedUser && cachedUser.id) {
            // Attempt to verify and get latest data from backend
            try {
              const controller = new AbortController();
              const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout
              const response = await fetch(`${API_BASE_URL}/get_onboarding?userId=${cachedUser.id}`, {
                signal: controller.signal
              });
              clearTimeout(timeoutId);
              const data = await response.json();
              if (response.ok && data && data.onboarding) {
                // User is valid, update onboarding info and set route
                const updatedUser = {
                  ...cachedUser,
                  onboardingCompleted: true,
                  onboarding: data.onboarding
                };
                // Save fresh credentials back to storage
                await AsyncStorage.setItem("userSession", JSON.stringify(updatedUser));
                setInitialUser(updatedUser);
                setInitialRoute("Dashboard");
              } else if (response.status === 404) {
                if (!cachedUser.onboardingCompleted) {
                  setInitialUser(cachedUser);
                  setInitialRoute("Welcome");
                } else {
                  // User no longer exists in DB - security checkout
                  await AsyncStorage.removeItem("userSession");
                  setInitialRoute("Login");
                }
              } else {
                // Keep local cache if server is having other issues
                setInitialUser(cachedUser);
                if (cachedUser.onboardingCompleted) {
                  setInitialRoute("Dashboard");
                } else {
                  setInitialRoute("Welcome");
                }
              }
            } catch (apiErr) {
              // Server is offline, fallback to locally cached session
              setInitialUser(cachedUser);
              if (cachedUser.onboardingCompleted) {
                setInitialRoute("Dashboard");
              } else {
                setInitialRoute("Welcome");
              }
            }
          }
        }
      } catch (err) {
        console.log("Error verifying persisted session:", err);
      } finally {
        setCheckingSession(false);
      }
    };
    
    if (fontsLoaded) {
      checkSession();
    }
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
          component={DashboardScreen}
          initialParams={initialRoute === "Dashboard" ? { user: initialUser } : undefined}
        />

        <Stack.Screen
          name="Goals"
          component={GoalsScreen}
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
          name="Insights"
          component={InsightsScreen}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
        />
        <Stack.Screen
          name="Impact"
          component={ExpenseReflectionScreen}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}