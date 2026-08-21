import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import ProfileScreen from "../screens/ProfileScreen";
import OrdersScreen from "../screens/OrdersScreen";
import HelpScreen from "../screens/HelpScreen";
import AddressesScreen from "../screens/AddressesScreen";
import AddressFormScreen from "../screens/AddressFormScreen";
import AdminOrdersScreen from "../screens/AdminOrdersScreen";

const Stack = createNativeStackNavigator();

export default function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="Orders" component={OrdersScreen} />
      <Stack.Screen name="Help" component={HelpScreen} />
      <Stack.Screen name="Addresses" component={AddressesScreen} />
      <Stack.Screen name="AddressForm" component={AddressFormScreen} />
      <Stack.Screen name="AdminOrders" component={AdminOrdersScreen} />
    </Stack.Navigator>
  );
}