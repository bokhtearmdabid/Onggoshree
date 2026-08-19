import React, { useState, useEffect } from "react";
import { View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import * as SecureStore from "expo-secure-store";
import { useAuth } from "../context/AuthContext";
import AppNavigator from "./AppNavigator";
import AuthStack from "./AuthStack";
import { colors } from "../constants/theme";

export default function RootNavigator() {
  const { user, loading } = useAuth();
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(null); // null = not checked yet

  useEffect(() => {
    SecureStore.getItemAsync("hasSeenOnboarding").then((value) => {
      setHasSeenOnboarding(value === "true");
    });
  }, []);

  const markOnboardingDone = () => {
    SecureStore.setItemAsync("hasSeenOnboarding", "true");
    setHasSeenOnboarding(true);
  };

  if (loading || hasSeenOnboarding === null) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.canvas }}>
        <ActivityIndicator size="large" color={colors.leaf} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <AppNavigator />
      ) : (
        <AuthStack
          initialRoute={hasSeenOnboarding ? "Login" : "Onboarding"}
          onOnboardingDone={markOnboardingDone}
        />
      )}
    </NavigationContainer>
  );
}