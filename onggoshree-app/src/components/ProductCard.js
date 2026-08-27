import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import { colors, fonts } from "../constants/theme";
import { Ionicons } from "@expo/vector-icons";
import { useWishlist } from "../context/WishlistContext";
import { getDiscountPercent } from "../utils/pricing";

export default function ProductCard({ product, onPress }) {
  const { isWishlisted, toggle } = useWishlist();
  const discountPercent = getDiscountPercent(product);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageBox}>
        {product.imageUrl ? (
          <Image source={{ uri: product.imageUrl }} style={styles.image} resizeMode="cover" />
        ) : (
          <Text style={styles.imagePlaceholder}>
            {product.name.charAt(0).toUpperCase()}
          </Text>
        )}
        <TouchableOpacity
          style={styles.heartBtn}
          onPress={(e) => {
            e.stopPropagation();
            toggle(product._id);
          }}
        >
          <Ionicons
            name={isWishlisted(product._id) ? "heart" : "heart-outline"}
            size={15}
            color={isWishlisted(product._id) ? "#c0392b" : "#fff"}
          />
        </TouchableOpacity>
      </View>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <View style={styles.row}>
      <View>
        <View style={styles.priceRow}>
          <Text style={styles.price}>৳{product.price.toFixed(0)}</Text>
          {discountPercent && (
            <Text style={styles.compareAt}>৳{product.compareAtPrice.toFixed(0)}</Text>
          )}
        </View>
      </View>
      <View style={styles.addBtn}>
        <Text style={styles.addIcon}>+</Text>
      </View>
    </View>
    {discountPercent && (
      <View style={styles.discountBadge}>
        <Text style={styles.discountBadgeText}>{discountPercent}% OFF</Text>
      </View>
    )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 12,
    marginRight: 13,
  },
  imageBox: {
    height: 104,
    borderRadius: 14,
    backgroundColor: colors.ivory,
    marginBottom: 11,
    justifyContent: "center",
    alignItems: "center",
  },
  imagePlaceholder: {
    fontFamily: fonts.serif,
    fontSize: 32,
    color: colors.leaf,
  },
  name: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: "600",
    color: colors.forest,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 7,
  },
  price: {
    fontFamily: fonts.sansBold,
    fontSize: 13.5,
    color: colors.forest,
  },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.forest,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    marginTop: -1,
  },
  image: {
  width: "100%",
  height: "100%",
  borderRadius: 14,
  },
  heartBtn: {
  position: "absolute",
  top: 7,
  right: 7,
  width: 26,
  height: 26,
  borderRadius: 13,
  backgroundColor: "rgba(0,0,0,0.25)",
  justifyContent: "center",
  alignItems: "center",
  },
  priceRow: { flexDirection: "row", alignItems: "baseline", gap: 6 },
  compareAt: {
    fontFamily: fonts.sans,
    fontSize: 11,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  discountBadge: {
    position: "absolute",
    top: 7,
    left: 7,
    backgroundColor: "#c0392b",
    borderRadius: 8,
    paddingVertical: 3,
    paddingHorizontal: 7,
  },
  discountBadgeText: { fontFamily: fonts.sansBold, fontSize: 9, color: "#fff" },
});