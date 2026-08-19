import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/api";
import { colors, fonts } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";

const DELIVERY_FEE = 60;

export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { refreshUser, user } = useAuth();
  const activeReward = user?.activeReward;
  const discount = activeReward?.discountAmount || 0;

  const total = Math.max(0, subtotal + DELIVERY_FEE - discount);

  const handlePlaceOrder = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      Alert.alert("Missing details", "Please fill in your name, phone, and address.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customerName: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
      };

        const response = await createOrder(orderPayload);
        const order = response.data;

        clearCart();
        await refreshUser(); // pick up the newly earned Glow points
        navigation.replace("OrderConfirmation", { order });
    } catch (error) {
      console.log("Order failed:", error.message);
      const serverMessage = error.response?.data?.message;
      Alert.alert("Order failed", serverMessage || "Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.topTitle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={18} color={colors.forest} />
          </TouchableOpacity>
          <Text style={styles.title}>Delivery details</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            style={styles.input}
            placeholder="Anaya Rahman"
            placeholderTextColor={colors.muted}
            value={name}
            onChangeText={setName}
          />

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            style={styles.input}
            placeholder="01XXXXXXXXX"
            placeholderTextColor={colors.muted}
            keyboardType="phone-pad"
            value={phone}
            onChangeText={setPhone}
          />

          <Text style={styles.label}>Delivery address</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="House, road, area, city"
            placeholderTextColor={colors.muted}
            multiline
            numberOfLines={3}
            value={address}
            onChangeText={setAddress}
          />
        </View>

        <View style={styles.summary}>
          <View style={styles.srow}>
            <Text style={styles.srowLabel}>Subtotal</Text>
            <Text style={styles.srowValue}>৳{subtotal.toFixed(0)}</Text>
          </View>
          <View style={styles.srow}>
            <Text style={styles.srowLabel}>Delivery · inside Dhaka</Text>
            <Text style={styles.srowValue}>৳{DELIVERY_FEE}</Text>
          </View>
          {activeReward && (
          <View style={styles.srow}>
            <Text style={styles.srowDiscLabel}>Glow Club discount</Text>
            <Text style={styles.srowDiscValue}>−৳{discount}</Text>
          </View>
          )}
          <View style={[styles.srow, styles.srowTotal]}>
            <Text style={styles.srowTotalLabel}>Total</Text>
            <Text style={styles.srowTotalValue}>৳{total.toFixed(0)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <TouchableOpacity
          style={[styles.placeBtn, submitting && styles.placeBtnDisabled]}
          onPress={handlePlaceOrder}
          disabled={submitting}
        >
          {submitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.placeBtnText}>
              Place order · <Text style={styles.placeBtnPrice}>৳{total.toFixed(0)}</Text>
            </Text>
          )}
        </TouchableOpacity>
      </View>
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
  backIcon: { fontSize: 18, color: colors.forest, width: 24 },
  title: { fontFamily: fonts.serif, fontSize: 20, color: colors.forest },

  form: { paddingHorizontal: 18 },
  label: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.forest, marginBottom: 6, marginTop: 14 },
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

  summary: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 15,
    marginHorizontal: 18,
    marginTop: 20,
  },
  srow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  srowLabel: { fontFamily: fonts.sans, fontSize: 12.5, color: "#556" },
  srowValue: { fontFamily: fonts.sans, fontSize: 12.5, color: "#556" },
  srowTotal: { borderTopWidth: 1, borderTopColor: colors.line, marginTop: 6, paddingTop: 11 },
  srowTotalLabel: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.forest },
  srowTotalValue: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.forest },

  cta: {
    backgroundColor: colors.milk,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 22,
  },
  placeBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 15, alignItems: "center" },
  placeBtnDisabled: { opacity: 0.6 },
  placeBtnText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
  placeBtnPrice: { color: colors.glow },
  srowDiscLabel: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.leaf },
  srowDiscValue: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.leaf },
});