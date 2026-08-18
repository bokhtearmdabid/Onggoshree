import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../constants/theme";

export default function OrderConfirmationScreen({ route, navigation }) {
  const { order } = route.params;

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.content}>
        <View style={styles.checkCircle}>
          <Text style={styles.checkIcon}>✓</Text>
        </View>
        <Text style={styles.title}>Order placed!</Text>
        <Text style={styles.subtitle}>
          Thank you — your order is confirmed and will be on its way soon.
        </Text>

        <View style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Order ID</Text>
            <Text style={styles.rowValue}>{order._id.slice(-8).toUpperCase()}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Total</Text>
            <Text style={styles.rowValueBold}>৳{order.total.toFixed(0)}</Text>
          </View>
          <View style={styles.row}>
            <Text style={styles.rowLabel}>Delivering to</Text>
            <Text style={styles.rowValue} numberOfLines={2}>{order.address}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.doneBtn}
          onPress={() => navigation.navigate("Tabs", { screen: "Home" })}
        >
          <Text style={styles.doneBtnText}>Back to shopping</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  content: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  checkCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: colors.leaf,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },
  checkIcon: { fontSize: 32, color: "#fff", fontWeight: "700" },
  title: { fontFamily: fonts.serif, fontSize: 24, color: colors.forest, marginBottom: 8 },
  subtitle: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  card: {
    width: "100%",
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 16,
    marginBottom: 24,
  },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 7, gap: 12 },
  rowLabel: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  rowValue: { fontFamily: fonts.sans, fontSize: 12.5, color: colors.forest, flexShrink: 1, textAlign: "right" },
  rowValueBold: { fontFamily: fonts.sansBold, fontSize: 13.5, color: colors.forest },
  doneBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 15, paddingHorizontal: 40 },
  doneBtnText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
});