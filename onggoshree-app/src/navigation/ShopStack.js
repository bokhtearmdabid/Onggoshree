import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ShopScreen from "../screens/ShopScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";


const Stack = createNativeStackNavigator();

export default function ShopStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ShopMain" component={ShopScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
  );
}