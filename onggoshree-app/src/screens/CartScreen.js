import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useCart } from "../context/CartContext";
import { colors, fonts } from "../constants/theme";

const DELIVERY_FEE = 60;

export default function CartScreen({ navigation }) {
  const { items, increment, decrement, subtotal } = useCart();

  const total = items.length > 0 ? subtotal + DELIVERY_FEE : 0;

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topTitle}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.closeIcon}>✕</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Your bag</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.emptyState}>
          <Text style={styles.emptyEmoji}>🛍</Text>
          <Text style={styles.emptyText}>Your bag is empty</Text>
          <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.goBack()}>
            <Text style={styles.shopBtnText}>Start shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.closeIcon}>✕</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Your bag</Text>
        <Text style={styles.itemCount}>{items.length} items</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.lines}>
          {items.map((item) => (
            <View key={item.productId} style={styles.cartLine}>
              <View style={styles.thumb}>
                <Text style={styles.thumbLetter}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.info}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.category}</Text>
                <Text style={styles.itemPrice}>৳{item.price.toFixed(0)}</Text>
              </View>
              <View style={styles.qtyBox}>
                <TouchableOpacity onPress={() => decrement(item.productId)}>
                  <Text style={styles.qtyBtn}>−</Text>
                </TouchableOpacity>
                <Text style={styles.qtyNum}>{item.qty}</Text>
                <TouchableOpacity onPress={() => increment(item.productId)}>
                  <Text style={styles.qtyBtn}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Promo code */}
        <View style={styles.promo}>
          <View style={styles.promoInput}>
            <Text style={styles.promoPlaceholder}>Promo code</Text>
          </View>
          <TouchableOpacity style={styles.applyBtn}>
            <Text style={styles.applyBtnText}>Apply</Text>
          </TouchableOpacity>
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
          <View style={[styles.srow, styles.srowTotal]}>
            <Text style={styles.srowTotalLabel}>Total</Text>
            <Text style={styles.srowTotalValue}>৳{total.toFixed(0)}</Text>
          </View>
        </View>
      </ScrollView>

      <View style={styles.cta}>
        <TouchableOpacity
            style={styles.checkoutBtn}
            onPress={() => navigation.navigate("Checkout")}
            >
            <Text style={styles.checkoutText}>
                Checkout · <Text style={styles.checkoutPrice}>৳{total.toFixed(0)}</Text>
            </Text>
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
  closeIcon: { fontSize: 18, color: colors.forest, width: 24 },
  title: { fontFamily: fonts.serif, fontSize: 22, color: colors.forest },
  itemCount: { fontFamily: fonts.sansBold, fontSize: 12, color: colors.muted, width: 60, textAlign: "right" },

  lines: { paddingHorizontal: 18 },
  cartLine: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  thumb: {
    width: 54,
    height: 54,
    borderRadius: 14,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
  },
  thumbLetter: { fontFamily: fonts.serif, fontSize: 20, color: colors.leaf },
  info: { flex: 1 },
  itemName: { fontFamily: fonts.sans, fontSize: 13, fontWeight: "600", color: colors.forest },
  itemSub: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 2 },
  itemPrice: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.forest, marginTop: 4 },
  qtyBox: {
    flexDirection: "row",
    alignItems: "center",
    gap: 9,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 11,
    paddingHorizontal: 8,
    paddingVertical: 5,
  },
  qtyBtn: { fontSize: 16, color: colors.forest, fontWeight: "700", width: 16, textAlign: "center" },
  qtyNum: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.forest, minWidth: 14, textAlign: "center" },

  promo: { flexDirection: "row", gap: 9, marginHorizontal: 18, marginTop: 16, marginBottom: 10 },
  promoInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.leafSoft,
    borderStyle: "dashed",
    backgroundColor: colors.milk,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 13,
  },
  promoPlaceholder: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted },
  applyBtn: {
    backgroundColor: colors.forest,
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: "center",
  },
  applyBtnText: { fontFamily: fonts.sansBold, fontSize: 12, color: "#fff" },

  summary: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 15,
    marginHorizontal: 18,
    marginTop: 8,
  },
  srow: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 5 },
  srowLabel: { fontFamily: fonts.sans, fontSize: 12.5, color: "#556" },
  srowValue: { fontFamily: fonts.sans, fontSize: 12.5, color: "#556" },
  srowTotal: {
    borderTopWidth: 1,
    borderTopColor: colors.line,
    marginTop: 6,
    paddingTop: 11,
  },
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
  checkoutBtn: {
    backgroundColor: colors.forest,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  checkoutText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
  checkoutPrice: { color: colors.glow },

  emptyState: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 40 },
  emptyEmoji: { fontSize: 40, marginBottom: 12 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginBottom: 20 },
  shopBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  shopBtnText: { fontFamily: fonts.sansBold, fontSize: 13, color: "#fff" },
});