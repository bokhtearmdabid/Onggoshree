import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";
import { getProducts } from "../api/api";
import { colors, fonts } from "../constants/theme";

const CATEGORIES = ["All", "Facial", "Serum", "Gel", "Bar", "Hair"];

export default function ShopScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = useCallback((category) => {
    setLoading(true);
    setError(null);
    getProducts(category)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't load products. Check your connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchProducts(activeCategory);
  }, [activeCategory]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <Text style={styles.title}>Shop all</Text>
      </View>

      <View style={styles.search}>
        <Text style={styles.searchText}>Search {products.length} products</Text>
      </View>

      <View style={styles.chipsWrap}>
        <FlatList
          data={CATEGORIES}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          contentContainerStyle={{ paddingHorizontal: 18, gap: 9 }}
          renderItem={({ item }) => {
            const isActive = item === activeCategory;
            return (
              <TouchableOpacity
                style={[styles.chip, isActive && styles.chipOn]}
                onPress={() => setActiveCategory(item)}
              >
                <Text style={[styles.chipText, isActive && styles.chipTextOn]}>{item}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>

      {loading && (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.leaf} />
        </View>
      )}

      {error && (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}

      {!loading && !error && (
        <FlatList
          data={products}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ gap: 13 }}
          contentContainerStyle={styles.grid}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
            >
              <View style={styles.cardImage}>
                <Text style={styles.cardLetter}>{item.name.charAt(0).toUpperCase()}</Text>
              </View>
              <Text style={styles.cardCat}>{item.category?.toUpperCase()}</Text>
              <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
              <View style={styles.cardRow}>
                <Text style={styles.cardPrice}>৳{item.price.toFixed(0)}</Text>
                <View style={styles.addBtn}>
                  <Text style={styles.addIcon}>+</Text>
                </View>
              </View>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products in this category yet.</Text>
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
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 10,
  },
  title: { fontFamily: fonts.serif, fontSize: 24, color: colors.forest },
  search: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 18,
    marginBottom: 12,
  },
  searchText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted },
  chipsWrap: { marginBottom: 14 },
  chip: {
    paddingVertical: 9,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
  },
  chipOn: { backgroundColor: colors.forest, borderColor: "transparent" },
  chipText: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest },
  chipTextOn: { color: "#fff" },
  grid: { paddingHorizontal: 18, paddingBottom: 30, gap: 13 },
  card: {
    flex: 1,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 11,
  },
  cardImage: {
    height: 100,
    borderRadius: 14,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  cardLetter: { fontFamily: fonts.serif, fontSize: 30, color: colors.leaf },
  cardCat: {
    fontFamily: fonts.sansBold,
    fontSize: 9,
    letterSpacing: 0.8,
    color: colors.leaf,
  },
  cardName: {
    fontFamily: fonts.sans,
    fontSize: 13,
    fontWeight: "600",
    color: colors.forest,
    marginTop: 3,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  cardPrice: { fontFamily: fonts.sansBold, fontSize: 13.5, color: colors.forest },
  addBtn: {
    width: 28,
    height: 28,
    borderRadius: 9,
    backgroundColor: colors.forest,
    justifyContent: "center",
    alignItems: "center",
  },
  addIcon: { color: "#fff", fontSize: 16, fontWeight: "700" },
  center: { paddingVertical: 60, alignItems: "center" },
  errorText: { fontFamily: fonts.sans, color: "#c0392b", textAlign: "center", paddingHorizontal: 30 },
  emptyText: { fontFamily: fonts.sans, color: colors.muted, paddingHorizontal: 18 },
});