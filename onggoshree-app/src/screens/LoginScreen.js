import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../constants/theme";

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async () => {
    setError("");
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await login(email.trim(), password);
      // No manual navigation needed — App.js watches the logged-in state
      // and automatically swaps to the main app once `user` is set.
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.mark}>অঙ্গশ্রী</Text>
          <Text style={styles.brand}>Onggoshree</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subtitle}>Sign in to continue your ritual</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="you@email.com"
              placeholderTextColor={colors.muted}
              autoCapitalize="none"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />

            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, submitting && styles.btnDisabled]}
              onPress={handleLogin}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Sign in</Text>}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => navigation.navigate("Signup")} style={styles.switchRow}>
              <Text style={styles.switchText}>
                New here? <Text style={styles.switchBold}>Create an account</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.forest },
  scroll: { flexGrow: 1, justifyContent: "center", paddingHorizontal: 26, paddingVertical: 40 },
  mark: { fontFamily: fonts.bengali, fontSize: 20, color: colors.glowSoft, textAlign: "center" },
  brand: { fontFamily: fonts.serif, fontSize: 26, color: "#fff", textAlign: "center", marginTop: 4, marginBottom: 30 },
  title: { fontFamily: fonts.serif, fontSize: 22, color: "#fff", textAlign: "center" },
  subtitle: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.65)", textAlign: "center", marginTop: 6, marginBottom: 30 },

  form: { backgroundColor: colors.milk, borderRadius: 22, padding: 20 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.forest, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.forest,
  },
  error: { fontFamily: fonts.sans, fontSize: 12, color: "#c0392b", marginTop: 12 },
  btn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 20 },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
  switchRow: { alignItems: "center", marginTop: 18 },
  switchText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.muted },
  switchBold: { fontFamily: fonts.sansBold, color: colors.forest },
});