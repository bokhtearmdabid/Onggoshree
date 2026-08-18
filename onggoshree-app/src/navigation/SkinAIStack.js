import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import SkinAIScreen from "../screens/SkinAIScreen";
import SkinResultsScreen from "../screens/SkinResultsScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";

const Stack = createNativeStackNavigator();

export default function SkinAIStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SkinAIMain" component={SkinAIScreen} />
      <Stack.Screen name="SkinResults" component={SkinResultsScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}