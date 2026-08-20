import React, { useState, useCallback } from "react";
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
import { useFocusEffect } from "@react-navigation/native";
import { getMyAddresses } from "../api/api";

const DELIVERY_FEE = 60;

export default function CheckoutScreen({ navigation }) {
  const { items, subtotal, clearCart } = useCart();
  const { refreshUser, user } = useAuth();

  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [name, setName] = useState(user?.name || "");
  const [submitting, setSubmitting] = useState(false);

  // Manual fallback fields — only used if the user has no saved addresses
  const [manualAddress, setManualAddress] = useState("");
  const [manualPhone, setManualPhone] = useState("");

  useFocusEffect(
    useCallback(() => {
      getMyAddresses()
        .then((res) => {
          setAddresses(res.data);
          const defaultAddr = res.data.find((a) => a.isDefault) || res.data[0];
          if (defaultAddr) setSelectedAddressId(defaultAddr._id);
        })
        .catch((err) => console.log("Error fetching addresses:", err.message))
        .finally(() => setLoadingAddresses(false));
    }, [])
  );

  const selectedAddress = addresses.find((a) => a._id === selectedAddressId);
  const activeReward = user?.activeReward;
  const discount = activeReward?.discountAmount || 0;
  const total = Math.max(0, subtotal + DELIVERY_FEE - discount);

  const handlePlaceOrder = async () => {
  const finalPhone = selectedAddress ? selectedAddress.phone : manualPhone.trim();
  const finalAddress = selectedAddress ? selectedAddress.fullAddress : manualAddress.trim();

    if (!name.trim() || !finalPhone || !finalAddress) {
      Alert.alert("Missing details", "Please fill in your name, phone, and address.");
      return;
    }

    setSubmitting(true);
    try {
      const orderPayload = {
        items: items.map((i) => ({ productId: i.productId, qty: i.qty })),
        customerName: name.trim(),
        phone: finalPhone,
        address: finalAddress,
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

        <View style={styles.addressHeader}>
          <Text style={styles.label}>Delivery address</Text>
          <TouchableOpacity onPress={() => navigation.navigate("AddressForm")}>
            <Text style={styles.addNewLink}>+ Add new</Text>
          </TouchableOpacity>
        </View>

        {loadingAddresses ? (
          <ActivityIndicator color={colors.leaf} style={{ marginVertical: 10 }} />
        ) : addresses.length > 0 ? (
          <View style={styles.addressList}>
            {addresses.map((addr) => {
              const selected = addr._id === selectedAddressId;
              return (
                <TouchableOpacity
                  key={addr._id}
                  style={[styles.addressCard, selected && styles.addressCardOn]}
                  onPress={() => setSelectedAddressId(addr._id)}
                >
                  <View style={styles.addressCardTop}>
                    <View style={[styles.radio, selected && styles.radioOn]} />
                    <Text style={styles.addressLabel}>{addr.label}</Text>
                    {addr.isDefault && <Text style={styles.defaultTag}>DEFAULT</Text>}
                  </View>
                  <Text style={styles.addressText}>{addr.fullAddress}</Text>
                  <Text style={styles.addressPhone}>{addr.phone}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Phone number"
              placeholderTextColor={colors.muted}
              keyboardType="phone-pad"
              value={manualPhone}
              onChangeText={setManualPhone}
            />
            <TextInput
              style={[styles.input, styles.textArea, { marginTop: 10 }]}
              placeholder="House, road, area, city"
              placeholderTextColor={colors.muted}
              multiline
              numberOfLines={3}
              value={manualAddress}
              onChangeText={setManualAddress}
            />
          </>
        )}
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

  addressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginTop: 14, marginBottom: 8 },
  addNewLink: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.leaf },
  addressList: { gap: 10 },
  addressCard: {
    backgroundColor: colors.milk,
    borderWidth: 1.5,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 13,
  },
  addressCardOn: { borderColor: colors.leaf },
  addressCardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  radio: { width: 16, height: 16, borderRadius: 8, borderWidth: 2, borderColor: colors.line },
  radioOn: { borderColor: colors.leaf, backgroundColor: colors.leaf },
  addressLabel: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest, flex: 1 },
  defaultTag: { fontFamily: fonts.sansBold, fontSize: 8.5, color: colors.amber, letterSpacing: 0.4 },
  addressText: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.forest, marginLeft: 24 },
  addressPhone: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginLeft: 24, marginTop: 2 },
});