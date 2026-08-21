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
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { GOOGLE_WEB_CLIENT_ID } from "../constants/config";

GoogleSignin.configure({
  webClientId: GOOGLE_WEB_CLIENT_ID,
});

export default function SignupScreen({ navigation }) {
  const { register, loginWithGoogle, continueAsGuest } = useAuth();
  const [googleError, setGoogleError] = useState("");
  const [googleSubmitting, setGoogleSubmitting] = useState(false);

  const handleGoogleSignIn = async () => {
    setGoogleError("");
    setGoogleSubmitting(true);
    try {
      await GoogleSignin.hasPlayServices();
      const result = await GoogleSignin.signIn();
      const idToken = result.data?.idToken;

      if (!idToken) {
        throw new Error("No ID token returned from Google");
      }

      await loginWithGoogle(idToken);
    } catch (error) {
      console.log("Google sign-in error:", error);
      const serverMessage = error.response?.data?.message;
      setGoogleError(serverMessage || "Google sign-in failed. Please try again.");
    } finally {
      setGoogleSubmitting(false);
    }
  };
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSignup = async () => {
    setError("");
    if (!name.trim() || !email.trim() || !password) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setSubmitting(true);
    try {
      await register(name.trim(), email.trim(), password);
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <Text style={styles.mark}>অঙ্গশ্রী</Text>
          <Text style={styles.brand}>Onggoshree</Text>
          <Text style={styles.title}>Begin your ritual</Text>
          <Text style={styles.subtitle}>Create an account to get started</Text>

          <View style={styles.form}>
            <Text style={styles.label}>Full name</Text>
            <TextInput
              style={styles.input}
              placeholder="Anaya Rahman"
              placeholderTextColor={colors.muted}
              value={name}
              onChangeText={setName}
            />

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
              placeholder="At least 6 characters"
              placeholderTextColor={colors.muted}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {error ? <Text style={styles.error}>{error}</Text> : null}

            <TouchableOpacity
              style={[styles.btn, submitting && styles.btnDisabled]}
              onPress={handleSignup}
              disabled={submitting}
            >
              {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Create account</Text>}
            </TouchableOpacity>

            <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          {googleError ? <Text style={styles.error}>{googleError}</Text> : null}

          <TouchableOpacity
            style={styles.googleBtn}
            disabled={googleSubmitting}
            onPress={handleGoogleSignIn}
          >
            <Text style={styles.googleBtnText}>
              {googleSubmitting ? "Signing in..." : "Continue with Google"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.switchRow}>
            <Text style={styles.switchText}>
              Already glowing? <Text style={styles.switchBold}>Sign in</Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={continueAsGuest} style={styles.guestRow}>
            <Text style={styles.guestText}>Just browsing? View the app</Text>
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
  divider: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 22 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.line },
  dividerText: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted },
  googleBtn: {
    borderWidth: 1,
    borderColor: colors.line,
    backgroundColor: "#fff",
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 16,
  },
  googleBtnText: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.forest },
  guestRow: { alignItems: "center", marginTop: 14 },
  guestText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
});