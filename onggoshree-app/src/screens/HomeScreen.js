import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import ReelsStrip from "../components/ReelsStrip";
import { colors, fonts } from "../constants/theme";
import { useAuth } from "../context/AuthContext";
import SkeletonCard from "../components/SkeletonCard";
import { HOME_CATEGORIES } from "../constants/categories";

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

const TIER_RING_COLORS = {
  Bronze: "#B07B4B",
  Silver: "#9CA3AF",
  Radiant: colors.glow,
  Gold: "#D4AF37",
};

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const tierRingColor = TIER_RING_COLORS[user?.tier] || colors.leaf;

  const fetchProducts = useCallback(() => {
    getProducts()
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't reach the server. Check API_URL and that the backend is running.");
      })
      .finally(() => {
        setLoading(false);
        setRefreshing(false);
      });
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setError(null);
    fetchProducts();
  }, [fetchProducts]);

  const goToShop = (category) => {
    navigation.navigate("Shop", { screen: "ShopMain", params: { category } });
  };

  // Rendering the whole screen as ONE FlatList (products as the list data,
  // everything above as a "header") instead of nesting a ScrollView around
  // another scrollable list. Nesting scrollables like that causes janky,
  // sometimes broken scroll behavior — this is the correct RN pattern for
  // "some fixed content, then a scrollable grid" layouts.
  return (
    <SafeAreaView style={styles.safeArea}>
      <FlatList
        data={products.slice(0, 4)}
        keyExtractor={(item) => item._id}
        numColumns={2}
        columnWrapperStyle={{ gap: 13, paddingHorizontal: 18, marginBottom: 16 }}
        contentContainerStyle={{ paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.leaf}
            colors={[colors.leaf]}
          />
        }
        ListHeaderComponent={
          <>
            {/* Brand bar */}
            <View style={styles.brandBar}>
              <View style={styles.brandLockup}>
                <Text style={styles.brandWord}>ONGGOSHREE</Text>
                <Text style={styles.greetSmall}>{getGreeting()}</Text>
              </View>
              <TouchableOpacity
                style={[styles.avatarRing, { borderColor: tierRingColor }]}
                onPress={() => navigation.navigate("Profile", { screen: "ProfileMain" })}
                activeOpacity={0.75}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{firstName.charAt(0).toUpperCase()}</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* Search */}
            <TouchableOpacity
              style={styles.search}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
            >
              <View style={styles.searchIconWrap}>
                <View style={styles.searchGlassCircle} />
                <View style={styles.searchGlassHandle} />
              </View>
              <Text style={styles.searchText}>Search products...</Text>
            </TouchableOpacity>

            {/* Hero */}
            <View style={{ marginBottom: 22 }}>
              <HeroCarousel onPressBanner={goToShop} />
            </View>

            {/* Quick category chips */}
            <FlatList
              data={HOME_CATEGORIES}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item.name}
              contentContainerStyle={{ paddingHorizontal: 18, gap: 10, marginBottom: 28 }}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.catChip} activeOpacity={0.8} onPress={() => goToShop(item.name)}>
                  <Text style={styles.catIcon}>{item.icon}</Text>
                  <Text style={styles.catLabel}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />

            {/* Watch & shop */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>Watch & shop</Text>
              </View>
              <TouchableOpacity onPress={() => goToShop("All")} activeOpacity={0.7}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            <View style={{ marginBottom: 28 }}>
              <ReelsStrip onPressReel={() => goToShop("All")} />
            </View>

            {/* Bestsellers */}
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleWrap}>
                <View style={styles.sectionAccent} />
                <Text style={styles.sectionTitle}>Bestsellers</Text>
              </View>
              <TouchableOpacity
                onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
                activeOpacity={0.7}
              >
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>

            {error && (
              <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            {loading && (
              <View style={{ flexDirection: "row", paddingHorizontal: 18, marginBottom: 16 }}>
                <SkeletonCard />
                <SkeletonCard />
              </View>
            )}
          </>
        }
        renderItem={({ item }) =>
          !loading && !error ? (
            <ProductCard
              product={item}
              onPress={() => navigation.navigate("ProductDetail", { productId: item._id })}
            />
          ) : null
        }
        ListFooterComponent={
          !loading && !error && products.length > 0 ? (
            <TouchableOpacity
              style={styles.viewAllBtn}
              activeOpacity={0.85}
              onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
            >
              <Text style={styles.viewAllText}>View all products</Text>
              <Text style={styles.viewAllArrow}>→</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },

  /* Brand bar */
  brandBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 20,
  },
  brandLockup: { flexShrink: 1 },
  brandWord: {
    fontFamily: fonts.serif,
    fontSize: 21,
    color: colors.forest,
    letterSpacing: 2.5,
  },

  /* Greeting */
  greetSmall: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },

  /* Avatar */
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 3,
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: 21,
    backgroundColor: colors.forest,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    fontFamily: fonts.serif,
    fontSize: 17,
    color: colors.glowSoft,
  },

  /* Search */
  search: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 13,
    paddingHorizontal: 15,
    marginHorizontal: 18,
    marginBottom: 22,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 9,
    elevation: 2,
  },
  searchText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted },
  searchIconWrap: { width: 16, height: 16, marginRight: 11 },
  searchGlassCircle: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 11,
    height: 11,
    borderRadius: 6,
    borderWidth: 1.6,
    borderColor: colors.muted,
  },
  searchGlassHandle: {
    position: "absolute",
    bottom: 1,
    right: 0,
    width: 6,
    height: 1.6,
    borderRadius: 1,
    backgroundColor: colors.muted,
    transform: [{ rotate: "45deg" }],
  },

  /* Section headers */
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 14,
  },
  sectionTitleWrap: { flexDirection: "row", alignItems: "center" },
  sectionAccent: {
    width: 3,
    height: 17,
    borderRadius: 2,
    backgroundColor: colors.leaf,
    marginRight: 9,
  },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.forest },
  seeAll: {
    fontFamily: fonts.sansBold,
    fontSize: 12,
    color: colors.leaf,
    letterSpacing: 0.3,
  },

  /* States */
  center: { paddingVertical: 40, alignItems: "center" },
  errorText: {
    fontFamily: fonts.sans,
    color: "#c0392b",
    textAlign: "center",
    paddingHorizontal: 30,
  },

  /* View all */
  viewAllBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 18,
    marginTop: 18,
    paddingVertical: 15,
    borderRadius: 16,
    backgroundColor: colors.forest,
    shadowColor: colors.forest,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
    elevation: 4,
  },
  viewAllText: {
    fontFamily: fonts.sansBold,
    fontSize: 13.5,
    color: colors.glowSoft,
    letterSpacing: 0.4,
  },
  viewAllArrow: {
    fontFamily: fonts.sansBold,
    fontSize: 15,
    color: colors.glowSoft,
    marginLeft: 8,
  },
  catChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    paddingVertical: 9,
    paddingHorizontal: 15,
  },
  catIcon: { fontSize: 14 },
  catLabel: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest },
});