import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../constants/theme";

export default function SignInPrompt({ message }) {
  const { exitGuestMode } = useAuth();

  return (
    <View style={styles.container}>
      <Feather name="lock" size={30} color={colors.muted} />
      <Text style={styles.message}>{message}</Text>
      <TouchableOpacity style={styles.btn} onPress={exitGuestMode}>
        <Text style={styles.btnText}>Sign in</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40, backgroundColor: colors.canvas },
  message: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted, textAlign: "center", marginTop: 14, marginBottom: 20, lineHeight: 20 },
  btn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 30 },
  btnText: { fontFamily: fonts.sansBold, fontSize: 13, color: "#fff" },
});