import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getProducts, deleteProductAdmin } from "../api/api";
import { colors, fonts } from "../constants/theme";

export default function AdminProductsScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getProducts()
        .then((res) => setProducts(res.data))
        .catch((err) => console.log("Error fetching products:", err.message))
        .finally(() => setLoading(false));
    }, [])
  );

  const handleDelete = (product) => {
    Alert.alert("Delete product", `Permanently delete "${product.name}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteProductAdmin(product._id);
            setProducts((prev) => prev.filter((p) => p._id !== product._id));
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
        <Text style={styles.title}>Manage products</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AdminProductForm")}>
          <Feather name="plus" size={20} color={colors.forest} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.leaf} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AdminProductForm", { product: item })}
            >
              {item.imageUrl ? (
                <Image source={{ uri: item.imageUrl }} style={styles.thumb} />
              ) : (
                <View style={[styles.thumb, styles.thumbPlaceholder]}>
                  <Text style={styles.thumbLetter}>{item.name.charAt(0)}</Text>
                </View>
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.name} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.meta}>{item.category} · ৳{item.price} · {item.stock} in stock</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <Feather name="trash-2" size={16} color="#c0392b" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="package" size={32} color={colors.muted} />
              <Text style={styles.emptyText}>No products yet</Text>
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
  title: { fontFamily: fonts.serif, fontSize: 19, color: colors.forest },

  list: { paddingHorizontal: 18, paddingBottom: 30, gap: 10 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    padding: 10,
  },
  thumb: { width: 52, height: 52, borderRadius: 12 },
  thumbPlaceholder: { backgroundColor: colors.ivory, justifyContent: "center", alignItems: "center" },
  thumbLetter: { fontFamily: fonts.serif, fontSize: 18, color: colors.leaf },
  name: { fontFamily: fonts.sans, fontSize: 13.5, fontWeight: "600", color: colors.forest },
  meta: { fontFamily: fonts.sans, fontSize: 11.5, color: colors.muted, marginTop: 3 },
  deleteBtn: { padding: 6 },

  emptyState: { alignItems: "center", paddingTop: 80 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 12 },
});