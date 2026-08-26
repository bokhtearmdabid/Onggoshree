import React from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useWishlist } from "../context/WishlistContext";
import ProductCard from "../components/ProductCard";
import { colors, fonts } from "../constants/theme";

export default function WishlistScreen({ navigation }) {
  const { items } = useWishlist();

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>Wishlist</Text>
        <View style={{ width: 18 }} />
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 13, paddingHorizontal: 18 }}
        contentContainerStyle={{ paddingBottom: 30, gap: 13 }}
        renderItem={({ item }) => (
          <ProductCard
            product={item.product}
            onPress={() => navigation.navigate("ProductDetail", { productId: item.product._id })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Feather name="heart" size={32} color={colors.muted} />
            <Text style={styles.emptyText}>Nothing saved yet</Text>
            <Text style={styles.emptySubtext}>Tap the heart on any product to save it here</Text>
          </View>
        }
      />
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

  emptyState: { alignItems: "center", paddingTop: 80, paddingHorizontal: 40 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 12 },
  emptySubtext: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, textAlign: "center", marginTop: 4 },
});