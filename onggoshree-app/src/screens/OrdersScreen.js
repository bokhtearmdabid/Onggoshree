import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { getMyOrders } from "../api/api";
import { colors, fonts } from "../constants/theme";

const STATUS_COLORS = {
  pending: colors.amber,
  confirmed: colors.leaf,
  shipped: colors.leaf,
  delivered: colors.forest,
  cancelled: "#c0392b",
};

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const fetchOrders = () => {
    setError(null);
    getMyOrders()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.log("Error fetching orders:", err.message);
        setError("Couldn't load your orders. Check your connection.");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchOrders();
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>My orders</Text>
        <View style={{ width: 18 }} />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.leaf} />
        </View>
      )}

      {error && !loading && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                <View style={[styles.statusPill, { backgroundColor: `${STATUS_COLORS[item.status]}22` }]}>
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                    {item.status.toUpperCase()}
                  </Text>
                </View>
              </View>

              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>

              <View style={styles.itemsPreview}>
                {item.items.map((line, idx) => (
                  <Text key={idx} style={styles.itemLine} numberOfLines={1}>
                    {line.qty}× {line.name}
                  </Text>
                ))}
              </View>

              <View style={styles.cardFoot}>
                <Text style={styles.itemCount}>
                  {item.items.reduce((sum, l) => sum + l.qty, 0)} items
                </Text>
                <Text style={styles.total}>৳{item.total.toFixed(0)}</Text>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="package" size={36} color={colors.muted} />
              <Text style={styles.emptyText}>No orders yet</Text>
              <TouchableOpacity style={styles.shopBtn} onPress={() => navigation.navigate("Tabs", { screen: "Shop" })}>
                <Text style={styles.shopBtnText}>Start shopping</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
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
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontFamily: fonts.sans, color: "#c0392b", textAlign: "center", paddingHorizontal: 30 },

  list: { paddingHorizontal: 18, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 15,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  orderId: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest },
  statusPill: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 10 },
  statusText: { fontFamily: fonts.sansBold, fontSize: 9.5, letterSpacing: 0.4 },
  date: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 4, marginBottom: 10 },

  itemsPreview: { gap: 2, marginBottom: 10 },
  itemLine: { fontFamily: fonts.sans, fontSize: 12, color: "#556" },

  cardFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  itemCount: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted },
  total: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.forest },

  emptyState: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 12, marginBottom: 20 },
  shopBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 24 },
  shopBtnText: { fontFamily: fonts.sansBold, fontSize: 13, color: "#fff" },
});