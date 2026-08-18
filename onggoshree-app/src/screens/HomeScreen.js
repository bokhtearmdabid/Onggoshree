import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import { colors, fonts } from "../constants/theme";
import { TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't reach the server. Check API_URL and that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header: greeting + avatar */}
      <View style={styles.appbar}>
        <View>
          <Text style={styles.greetSmall}>Good morning</Text>
          <Text style={styles.greetName}>Onggoshree</Text>
        </View>
        <View style={styles.spacer} />
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>O</Text>
        </View>
      </View>

      {/* Search bar */}
      <TouchableOpacity
        style={styles.search}
        onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
      >
        <Text style={styles.searchText}>Search products...</Text>
      </TouchableOpacity>

      {/* Section header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Bestsellers</Text>
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
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
              />
            )}
          ListEmptyComponent={
            <Text style={styles.emptyText}>No products yet.</Text>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  appbar: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 10,
    paddingBottom: 12,
  },
  spacer: { flex: 1 },
  greetSmall: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.muted,
    letterSpacing: 0.5,
  },
  greetName: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.forest,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.leaf,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: fonts.serif,
    color: colors.glowSoft,
    fontSize: 16,
  },
  search: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 18,
    marginBottom: 14,
  },
  searchText: {
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.muted,
  },
  sectionHeader: {
    paddingHorizontal: 18,
    marginBottom: 13,
  },
  sectionTitle: {
    fontFamily: fonts.serif,
    fontSize: 19,
    color: colors.forest,
  },
  list: {
    paddingHorizontal: 18,
  },
  center: {
    paddingVertical: 40,
    alignItems: "center",
  },
  errorText: {
    fontFamily: fonts.sans,
    color: "#c0392b",
    textAlign: "center",
    paddingHorizontal: 30,
  },
  emptyText: {
    fontFamily: fonts.sans,
    color: colors.muted,
  },
});