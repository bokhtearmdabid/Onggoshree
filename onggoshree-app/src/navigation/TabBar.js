import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colors, fonts } from "../constants/theme";

const TAB_LABELS = {
  Home: "Home",
  Shop: "Shop",
  SkinAI: "Skin AI",
  Club: "Club",
  Profile: "Profile",
};

export default function TabBar({ state, navigation }) {
  return (
    <View style={styles.bar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const isFab = route.name === "SkinAI";

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        if (isFab) {
          return (
            <TouchableOpacity key={route.key} onPress={onPress} style={styles.fabWrap}>
              <View style={styles.fab}>
                <Text style={styles.fabIcon}>◎</Text>
              </View>
              <Text style={styles.fabLabel}>{TAB_LABELS[route.name]}</Text>
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={styles.tab}>
            <Text style={[styles.tabIcon, isFocused && styles.tabIconOn]}>●</Text>
            <Text style={[styles.tabLabel, isFocused && styles.tabLabelOn]}>
              {TAB_LABELS[route.name]}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-around",
    height: 82,
    paddingTop: 11,
    paddingHorizontal: 14,
    backgroundColor: "rgba(252,250,244,0.96)",
    borderTopWidth: 1,
    borderTopColor: colors.line,
  },
  tab: {
    alignItems: "center",
    gap: 4,
    width: 52,
  },
  tabIcon: {
    fontSize: 18,
    color: colors.muted,
  },
  tabIconOn: {
    color: colors.leaf,
  },
  tabLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 9.5,
    color: colors.muted,
  },
  tabLabelOn: {
    color: colors.forest,
  },
  fabWrap: {
    alignItems: "center",
    marginTop: -20,
  },
  fab: {
    width: 56,
    height: 56,
    borderRadius: 20,
    backgroundColor: colors.leaf,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: colors.milk,
    shadowColor: colors.forest,
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  fabIcon: {
    fontSize: 22,
    color: "#fff",
  },
  fabLabel: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    color: colors.forest,
    marginTop: 3,
  },
});