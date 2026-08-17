import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import TabBar from "./TabBar";
import HomeStack from "./HomeStack";
import ShopScreen from "../screens/ShopScreen";
import SkinAIScreen from "../screens/SkinAIScreen";
import ClubScreen from "../screens/ClubScreen";
import ProfileScreen from "../screens/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{ headerShown: false }}
        tabBar={(props) => <TabBar {...props} />}
      >
        <Tab.Screen name="Home" component={HomeStack} />
        <Tab.Screen name="Shop" component={ShopScreen} />
        <Tab.Screen name="SkinAI" component={SkinAIScreen} />
        <Tab.Screen name="Club" component={ClubScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}