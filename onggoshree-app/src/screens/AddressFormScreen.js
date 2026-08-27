import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { createAddress, updateAddress } from "../api/api";
import { colors, fonts } from "../constants/theme";
import { isValidBDPhone } from "../utils/validation";

const QUICK_LABELS = ["Home", "Work", "Other"];

export default function AddressFormScreen({ route, navigation }) {
  const editing = route.params?.address;

  const [label, setLabel] = useState(editing?.label || "Home");
  const [fullAddress, setFullAddress] = useState(editing?.fullAddress || "");
  const [phone, setPhone] = useState(editing?.phone || "");
  const [isDefault, setIsDefault] = useState(editing?.isDefault || false);
  const [submitting, setSubmitting] = useState(false);

  const handleSave = async () => {
    if (!label.trim() || !fullAddress.trim() || !phone.trim()) {
      Alert.alert("Missing details", "Please fill in a label, address, and phone number.");
      return;
    }
    if (!isValidBDPhone(phone)) {
      Alert.alert("Invalid phone number", "Please enter a valid 11-digit Bangladesh mobile number.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = { label: label.trim(), fullAddress: fullAddress.trim(), phone: phone.trim(), isDefault };
      if (editing) {
        await updateAddress(editing._id, payload);
      } else {
        await createAddress(payload);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert("Couldn't save", "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>{editing ? "Edit address" : "New address"}</Text>
        <View style={{ width: 18 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <Text style={styles.label}>Label</Text>
        <View style={styles.chipRow}>
          {QUICK_LABELS.map((l) => (
            <TouchableOpacity
              key={l}
              style={[styles.chip, label === l && styles.chipOn]}
              onPress={() => setLabel(l)}
            >
              <Text style={[styles.chipText, label === l && styles.chipTextOn]}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Or type a custom label"
          placeholderTextColor={colors.muted}
          value={label}
          onChangeText={setLabel}
        />

        <Text style={styles.label}>Full address</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="House, road, area, city"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={3}
          value={fullAddress}
          onChangeText={setFullAddress}
        />

        <Text style={styles.label}>Phone number</Text>
        <TextInput
          style={styles.input}
          placeholder="01XXXXXXXXX"
          placeholderTextColor={colors.muted}
          keyboardType="number-pad"
          maxLength={11}
          value={phone}
          onChangeText={(text) => setPhone(text.replace(/[^0-9]/g, ""))}
        />
        {phone.length > 0 && !isValidBDPhone(phone) && (
          <Text style={styles.errorHint}>Enter a valid 11-digit BD number (e.g. 016XXXXXXXX)</Text>
        )}

        <View style={styles.defaultRow}>
          <Text style={styles.defaultLabel}>Set as default address</Text>
          <Switch
            value={isDefault}
            onValueChange={setIsDefault}
            trackColor={{ false: colors.line, true: colors.leaf }}
            thumbColor="#fff"
          />
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, submitting && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveBtnText}>{submitting ? "Saving..." : "Save address"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  topTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: { fontFamily: fonts.serif, fontSize: 20, color: colors.forest },

  form: { paddingHorizontal: 18, paddingBottom: 40 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.forest, marginBottom: 8, marginTop: 16 },
  chipRow: { flexDirection: "row", gap: 8, marginBottom: 10 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: { backgroundColor: colors.forest, borderColor: "transparent" },
  chipText: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.forest },
  chipTextOn: { color: "#fff" },
  input: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.forest,
  },
  textArea: { height: 80, textAlignVertical: "top" },

  defaultRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  defaultLabel: { fontFamily: fonts.sans, fontSize: 13, fontWeight: "600", color: colors.forest },

  saveBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 24 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },

  errorHint: { fontFamily: fonts.sans, fontSize: 11, color: "#c0392b", marginTop: 6 },
});