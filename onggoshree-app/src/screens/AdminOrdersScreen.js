import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getAllOrdersAdmin, updateOrderStatusAdmin, deleteOrderAdmin } from "../api/api";
import { colors, fonts } from "../constants/theme";

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

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
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminOrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusPickerOrder, setStatusPickerOrder] = useState(null); // order currently choosing a new status for

  const fetchOrders = () => {
    getAllOrdersAdmin()
      .then((res) => setOrders(res.data))
      .catch((err) => {
        console.log("Error fetching admin orders:", err.message);
        Alert.alert("Couldn't load orders", "Check your connection and admin access.");
      })
      .finally(() => setLoading(false));
  };

  useFocusEffect(
    useCallback(() => {
      fetchOrders();
    }, [])
  );

  const handleStatusChange = async (order, newStatus) => {
    setStatusPickerOrder(null);
    try {
      const updated = await updateOrderStatusAdmin(order._id, newStatus);
      setOrders((prev) => prev.map((o) => (o._id === order._id ? updated.data : o)));
    } catch (error) {
      Alert.alert("Couldn't update status", "Please try again.");
    }
  };

  const handleDelete = (order) => {
    Alert.alert("Delete order", `Permanently delete order #${order._id.slice(-8).toUpperCase()}?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteOrderAdmin(order._id);
            setOrders((prev) => prev.filter((o) => o._id !== order._id));
          } catch (error) {
            Alert.alert("Couldn't delete", "Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>All orders</Text>
        <View style={{ width: 18 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.leaf} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={styles.orderId}>#{item._id.slice(-8).toUpperCase()}</Text>
                <TouchableOpacity
                  style={[styles.statusPill, { backgroundColor: `${STATUS_COLORS[item.status]}22` }]}
                  onPress={() => setStatusPickerOrder(item)}
                >
                  <Text style={[styles.statusText, { color: STATUS_COLORS[item.status] }]}>
                    {item.status.toUpperCase()}
                  </Text>
                  <Feather name="chevron-down" size={11} color={STATUS_COLORS[item.status]} />
                </TouchableOpacity>
              </View>

              <Text style={styles.customer}>{item.customerName} · {item.phone}</Text>
              <Text style={styles.email}>{item.user?.email || "Guest"}</Text>
              <Text style={styles.date}>{formatDate(item.createdAt)}</Text>
              <Text style={styles.address} numberOfLines={2}>{item.address}</Text>

              <View style={styles.itemsPreview}>
                {item.items.map((line, idx) => (
                  <Text key={idx} style={styles.itemLine} numberOfLines={1}>
                    {line.qty}× {line.name} — ৳{(line.price * line.qty).toFixed(0)}
                  </Text>
                ))}
              </View>

              <View style={styles.cardFoot}>
                <Text style={styles.total}>৳{item.total.toFixed(0)}</Text>
                <TouchableOpacity onPress={() => handleDelete(item)}>
                  <Feather name="trash-2" size={16} color="#c0392b" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="inbox" size={32} color={colors.muted} />
              <Text style={styles.emptyText}>No orders yet</Text>
            </View>
          }
        />
      )}

      {/* Status picker modal */}
      <Modal visible={!!statusPickerOrder} transparent animationType="fade" onRequestClose={() => setStatusPickerOrder(null)}>
        <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setStatusPickerOrder(null)}>
          <View style={styles.modalSheet}>
            <Text style={styles.modalTitle}>Update status</Text>
            {STATUSES.map((s) => (
              <TouchableOpacity
                key={s}
                style={styles.statusOption}
                onPress={() => handleStatusChange(statusPickerOrder, s)}
              >
                <View style={[styles.statusDot, { backgroundColor: STATUS_COLORS[s] }]} />
                <Text style={styles.statusOptionText}>{s.charAt(0).toUpperCase() + s.slice(1)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>
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

  list: { paddingHorizontal: 18, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 15,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  orderId: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest },
  statusPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    borderRadius: 20,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  statusText: { fontFamily: fonts.sansBold, fontSize: 9.5, letterSpacing: 0.4 },

  customer: { fontFamily: fonts.sans, fontSize: 12.5, fontWeight: "600", color: colors.forest, marginTop: 2 },
  email: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 1 },
  date: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 3 },
  address: { fontFamily: fonts.sans, fontSize: 11.5, color: "#556", marginTop: 6 },

  itemsPreview: { gap: 2, marginTop: 10, marginBottom: 10, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 10 },
  itemLine: { fontFamily: fonts.sans, fontSize: 11.5, color: "#556" },

  cardFoot: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 10,
  },
  total: { fontFamily: fonts.sansBold, fontSize: 15, color: colors.forest },

  emptyState: { alignItems: "center", paddingTop: 80 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 12 },

  modalBackdrop: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "flex-end" },
  modalSheet: { backgroundColor: colors.milk, borderTopLeftRadius: 22, borderTopRightRadius: 22, padding: 20, paddingBottom: 36 },
  modalTitle: { fontFamily: fonts.serif, fontSize: 17, color: colors.forest, marginBottom: 12 },
  statusOption: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 12 },
  statusDot: { width: 10, height: 10, borderRadius: 5 },
  statusOptionText: { fontFamily: fonts.sans, fontSize: 14, color: colors.forest },
});