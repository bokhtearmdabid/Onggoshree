import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { colors, fonts } from "../constants/theme";

export default function ProductCard({ product, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.imageBox}>
        <Text style={styles.imagePlaceholder}>
          {product.name.charAt(0).toUpperCase()}
        </Text>
      </View>
      <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
      <View style={styles.row}>
        <Text style={styles.price}>৳{product.price.toFixed(0)}</Text>
        <View style={styles.addBtn}>
          <Text style={styles.addIcon}>+</Text>
        </View>
      </View>
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
});