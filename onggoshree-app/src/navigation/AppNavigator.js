import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabBar from "./TabBar";
import HomeStack from "./HomeStack";
import ShopStack from "./ShopStack";
import SkinAIScreen from "../screens/SkinAIScreen";
import ClubScreen from "../screens/ClubScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";

const Tab = createBottomTabNavigator();
const RootStack = createNativeStackNavigator();

function Tabs() {
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Shop" component={ShopStack} />
      <Tab.Screen name="SkinAI" component={SkinAIScreen} />
      <Tab.Screen name="Club" component={ClubScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <RootStack.Navigator screenOptions={{ headerShown: false }}>
        <RootStack.Screen name="Tabs" component={Tabs} />
        <RootStack.Screen
          name="Cart"
          component={CartScreen}
          options={{ presentation: "modal" }}
        />
        <RootStack.Screen 
        name="Checkout" 
        component={CheckoutScreen} />
        <RootStack.Screen 
        name="OrderConfirmation" 
        component={OrderConfirmationScreen} />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}