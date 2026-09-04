import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { resendOTP } from "../api/api";
import { colors, fonts } from "../constants/theme";

export default function OTPVerificationScreen({ route }) {
  const { email } = route.params;
  const { completeVerification } = useAuth();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [resending, setResending] = useState(false);

  const handleVerify = async () => {
    setError("");
    if (otp.length !== 6) {
      setError("Enter the 6-digit code from your email.");
      return;
    }
    setSubmitting(true);
    try {
      await completeVerification(email, otp);
      // No manual navigation — RootNavigator swaps to the main app automatically once `user` is set
    } catch (err) {
      const serverMessage = err.response?.data?.message;
      setError(serverMessage || "Verification failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await resendOTP(email);
      Alert.alert("Code sent", "A new verification code has been sent to your email.");
    } catch (err) {
      Alert.alert("Couldn't resend", "Please try again in a moment.");
    } finally {
      setResending(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          We sent a 6-digit code to{"\n"}
          <Text style={styles.email}>{email}</Text>
        </Text>

        <TextInput
          style={styles.otpInput}
          placeholder="000000"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={6}
          value={otp}
          onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
          autoFocus
        />

        {error ? <Text style={styles.error}>{error}</Text> : null}

        <TouchableOpacity
          style={[styles.btn, submitting && styles.btnDisabled]}
          onPress={handleVerify}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Verify</Text>}
        </TouchableOpacity>

        <TouchableOpacity onPress={handleResend} disabled={resending} style={styles.resendRow}>
          <Text style={styles.resendText}>
            {resending ? "Sending..." : "Didn't get a code? Resend"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.forest },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 30 },
  title: { fontFamily: fonts.serif, fontSize: 24, color: "#fff", textAlign: "center", marginBottom: 10 },
  subtitle: { fontFamily: fonts.sans, fontSize: 13, color: "rgba(255,255,255,0.7)", textAlign: "center", lineHeight: 20, marginBottom: 30 },
  email: { fontFamily: fonts.sansBold, color: "#fff" },
  otpInput: {
    backgroundColor: colors.milk,
    borderRadius: 16,
    paddingVertical: 18,
    textAlign: "center",
    fontSize: 28,
    fontFamily: fonts.sansBold,
    letterSpacing: 12,
    color: colors.forest,
    marginBottom: 16,
  },
  error: { fontFamily: fonts.sans, fontSize: 12, color: "#ff8a80", textAlign: "center", marginBottom: 12 },
  btn: { backgroundColor: colors.glow, borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  btnDisabled: { opacity: 0.6 },
  btnText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.forest },
  resendRow: { alignItems: "center", marginTop: 20 },
  resendText: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.75)" },
});