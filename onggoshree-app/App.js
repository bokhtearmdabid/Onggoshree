import { SafeAreaProvider } from "react-native-safe-area-context";
import React, { useCallback } from "react";
import { View } from "react-native";
import * as SplashScreen from "expo-splash-screen";
import {
  useFonts as usePlusJakarta,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_700Bold,
} from "@expo-google-fonts/plus-jakarta-sans";
import {
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from "@expo-google-fonts/fraunces";
import { NotoSerifBengali_600SemiBold } from "@expo-google-fonts/noto-serif-bengali";
import { HindSiliguri_500Medium } from "@expo-google-fonts/hind-siliguri";
import AppNavigator from "./src/navigation/AppNavigator";

SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = usePlusJakarta({
    PlusJakartaSans_500Medium,
    PlusJakartaSans_700Bold,
    Fraunces_500Medium,
    Fraunces_600SemiBold,
    NotoSerifBengali_600SemiBold,
    HindSiliguri_500Medium,
  });

  const onLayout = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
    <View style={{ flex: 1 }} onLayout={onLayout}>
      <AppNavigator />
    </View>
    </SafeAreaProvider>
  );
}