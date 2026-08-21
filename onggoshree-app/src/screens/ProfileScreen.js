import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../constants/theme";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { getMyOrders } from "../api/api";
import SignInPrompt from "../components/SignInPrompt";

const MENU_ITEMS = [
  { label: "My orders", icon: "package" },
  { label: "Addresses", icon: "map-pin" },
  { label: "Skin history", icon: "search" },
  { label: "Wishlist", icon: "heart" },
  { label: "Help & support", icon: "help-circle" },
  { label: "Settings", icon: "settings" },
];

export default function ProfileScreen({ navigation }) {
  const { user, logout } = useAuth();
  const [orderCount, setOrderCount] = useState(0);

  useEffect(() => {
    if (!user) return;
    getMyOrders()
      .then((res) => setOrderCount(res.data.length))
      .catch((err) => console.log("Error fetching order count:", err.message));
  }, [user]);

  if (!user) {
    return <SignInPrompt message="Sign in to view your profile, orders, and Glow points." />;
  }

  return (
    <SafeAreaView style={styles.safeArea} edges={["top"]}>
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user.name.charAt(0)}</Text>
          </View>
          <View>
            <Text style={styles.name}>{user.name}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* Stats */}
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{orderCount}</Text>
              <Text style={styles.statLabel}>ORDERS</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>—</Text>
              <Text style={styles.statLabel}>POINTS</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNum}>—</Text>
              <Text style={styles.statLabel}>SAVED</Text>
            </View>
          </View>

          {/* Menu */}
          <View style={styles.menu}>
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={styles.mrow}
                activeOpacity={0.6}
                onPress={() => {
                  if (item.label === "My orders") navigation.navigate("Orders");
                  if (item.label === "Help & support") navigation.navigate("Help");
                  if (item.label === "Addresses") navigation.navigate("Addresses");
                }}
              >
                <View style={styles.mi}>
                  <Feather name={item.icon} size={16} color={colors.leaf} />
                </View>
                <Text style={styles.ml}>{item.label}</Text>
                {item.badge ? (
                  <View style={styles.mbadge}>
                    <Text style={styles.mbadgeText}>{item.badge}</Text>
                  </View>
                ) : (
                  <Text style={styles.mc}>›</Text>
                )}
              </TouchableOpacity>
            ))}

            {user?.isAdmin && (
              <TouchableOpacity
                style={styles.mrow}
                activeOpacity={0.6}
                onPress={() => navigation.navigate("AdminOrders")}
              >
                <View style={[styles.mi, { backgroundColor: "rgba(231,179,107,0.2)" }]}>
                  <Feather name="shield" size={16} color={colors.amber} />
                </View>
                <Text style={styles.ml}>Manage orders (Admin)</Text>
                <Text style={styles.mc}>›</Text>
              </TouchableOpacity>
            )}
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
            <Text style={styles.logoutText}>Log out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  header: {
    backgroundColor: colors.forest,
    paddingHorizontal: 20,
    paddingVertical: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: colors.glow,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { fontFamily: fonts.serif, fontSize: 26, color: colors.forest, fontWeight: "700" },
  name: { fontFamily: fonts.serif, fontSize: 20, color: "#fff" },
  email: { fontFamily: fonts.sans, fontSize: 12, color: "rgba(255,255,255,0.72)", marginTop: 2 },
  tierPill: {
    marginTop: 8,
    alignSelf: "flex-start",
    backgroundColor: "rgba(231,179,107,0.18)",
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  tierText: { fontFamily: fonts.sansBold, fontSize: 10, color: colors.glow, letterSpacing: 0.5 },

  body: { padding: 18 },
  stats: { flexDirection: "row", gap: 10, marginBottom: 8 },
  stat: {
    flex: 1,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 13,
    alignItems: "center",
  },
  statNum: { fontFamily: fonts.serif, fontSize: 18, color: colors.forest },
  statLabel: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.muted, letterSpacing: 0.8, marginTop: 3 },

  menu: { marginTop: 8 },
  mrow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingVertical: 14,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
  },
  logoutBtn: {
    marginTop: 24,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
  },
  logoutText: { fontFamily: fonts.sansBold, fontSize: 13, color: "#c0392b" },
  mi: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    alignItems: "center",
  },
  ml: { flex: 1, fontFamily: fonts.sans, fontSize: 13.5, fontWeight: "600", color: colors.forest },
  mc: { color: colors.muted, fontSize: 18 },
  mbadge: {
    backgroundColor: colors.glow,
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 9,
  },
  mbadgeText: { fontFamily: fonts.sansBold, fontSize: 10, color: "#40300f" },
});