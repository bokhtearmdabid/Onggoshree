import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function SkinAIScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Skin AI — coming soon</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.canvas, justifyContent: "center", alignItems: "center" },
  text: { fontFamily: fonts.serif, fontSize: 18, color: colors.forest },
});