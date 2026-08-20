import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  Image,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/api";
import { colors, fonts } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { Feather } from "@expo/vector-icons";

const CATEGORIES = ["All", "Facial", "Serum", "Gel", "Bar", "Hair"];

export default function ShopScreen({ navigation, route }) {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState(route.params?.category || "All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { totalItems } = useCart();
  const [searchText, setSearchText] = useState("");

  const fetchProducts = useCallback((category, search) => {
    setLoading(true);
    setError(null);
    getProducts(category, search)
      .then((res) => setProducts(res.data))
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't load products. Check your connection.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchProducts(activeCategory, searchText);
    }, 400);
    return () => clearTimeout(delay); // This cancel the pending call if the user keeps typing
  }, [activeCategory, searchText]);

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <Text style={styles.title}>Shop all</Text>
        <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("Cart")}>
          <Feather name="shopping-bag" size={16} color={colors.forest} />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <View style={styles.search}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search products..."
          placeholderTextColor={colors.muted}
          value={searchText}
          onChangeText={setSearchText}
        />
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
                {item.imageUrl ? (
                  <Image source={{ uri: item.imageUrl }} style={styles.cardImagePhoto} resizeMode="cover" />
                ) : (
                  <Text style={styles.cardLetter}>{item.name.charAt(0).toUpperCase()}</Text>
                )}
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

  searchInput: {
  fontFamily: fonts.sans,
  fontSize: 13.5,
  color: colors.forest,
  padding: 0,
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
  cartBtn: {
  width: 38,
  height: 38,
  borderRadius: 19,
  backgroundColor: colors.milk,
  borderWidth: 1,
  borderColor: colors.line,
  justifyContent: "center",
  alignItems: "center",
},
cartIcon: { fontSize: 16 },
badge: {
  position: "absolute",
  top: -2,
  right: -2,
  width: 16,
  height: 16,
  borderRadius: 8,
  backgroundColor: colors.glow,
  borderWidth: 2,
  borderColor: colors.canvas,
  justifyContent: "center",
  alignItems: "center",
},
badgeText: { fontSize: 9, fontWeight: "800", color: "#40300f" },
cardImagePhoto: {
  width: "100%",
  height: "100%",
  borderRadius: 14,
},
});