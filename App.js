import React, { useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useFonts } from "expo-font";
import { View, ActivityIndicator, Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as NavigationBar from "expo-navigation-bar";

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


const Stack = createNativeStackNavigator();

export default function App() {
  useEffect(() => {
    if (Platform.OS === "android") {
      NavigationBar.setPositionAsync("absolute");
      NavigationBar.setBackgroundColorAsync("transparent");
      NavigationBar.setButtonStyleAsync("light");
    }
  }, []);

  const [fontsLoaded] = useFonts({
    "SFProDisplay-Regular": require("./assets/fonts/SF-Pro-Display-Regular.ttf"),
    "SFProDisplay-Bold": require("./assets/fonts/SF-Pro-Display-Bold.ttf"),
    "DMSerifDisplay-Regular": require("./assets/fonts/DMSerifDisplay-Regular.ttf"),
    "DMSans-Regular": require("./assets/fonts/DMSans-Regular.ttf"),
    "Manrope": require("./assets/fonts/Manrope.ttf"),
    "Geist-Regular": require("./assets/fonts/Geist-Regular.ttf"),
    "Geist-SemiBold": require("./assets/fonts/Geist-SemiBold.ttf"),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#7B2CBF" }}>
        <ActivityIndicator size="large" color="#FFFFFF" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator>
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Signup"
          component={SignupScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Otp"
          component={OtpScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="PocketMoney"
          component={PocketMoneyScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="SavingsGoal"
          component={SavingsGoalScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="OnboardingComplete"
          component={OnboardingCompleteScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Goals"
          component={GoalsScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="ConfirmGoal"
          component={ConfirmGoalScreen}
          options={{ headerShown: false }}
        />

        <Stack.Screen
          name="Allocation"
          component={AllocationScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="GoalAchieved"
          component={GoalAchievedScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Insights"
          component={InsightsScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddExpense"
          component={AddExpenseScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ExpenseReflection"
          component={ExpenseReflectionScreen}
          options={{ headerShown: false }}
        />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}