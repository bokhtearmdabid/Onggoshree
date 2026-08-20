import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import TabBar from "./TabBar";
import HomeStack from "./HomeStack";
import ShopStack from "./ShopStack";
import SkinAIStack from "./SkinAIStack";
import ClubScreen from "../screens/ClubScreen";
import ProfileScreen from "../screens/ProfileScreen";
import CartScreen from "../screens/CartScreen";
import CheckoutScreen from "../screens/CheckoutScreen";
import OrderConfirmationScreen from "../screens/OrderConfirmationScreen";
import ProfileStack from "./ProfileStack";
import AddressFormScreen from "../screens/AddressFormScreen";

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
      <Tab.Screen name="SkinAI" component={SkinAIStack} />
      <Tab.Screen name="Club" component={ClubScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
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

        <RootStack.Screen name="AddressForm" 
        component={AddressFormScreen} 
        options={{ presentation: "modal" }} />
      </RootStack.Navigator>
        
  );
}