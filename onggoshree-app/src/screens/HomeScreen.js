import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/api";
import ProductCard from "../components/ProductCard";
import HeroCarousel from "../components/HeroCarousel";
import ReelsStrip from "../components/ReelsStrip";
import { colors, fonts } from "../constants/theme";
import { useAuth } from "../context/AuthContext";

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
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "there";
  const tierRingColor = TIER_RING_COLORS[user?.tier] || colors.leaf;

  useEffect(() => {
    getProducts()
      .then((response) => setProducts(response.data))
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't reach the server. Check API_URL and that the backend is running.");
      })
      .finally(() => setLoading(false));
  }, []);

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
        contentContainerStyle={{ paddingBottom: 20 }}
        ListHeaderComponent={
          <>
            <View style={styles.appbar}>
              <View style={{ flex: 1 }}>
                <Text style={styles.greetSmall}>{getGreeting()}</Text>
                <Text style={styles.greetName}>{firstName}</Text>
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

            <TouchableOpacity
              style={styles.search}
              onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
            >
              <Text style={styles.searchText}>Search products...</Text>
            </TouchableOpacity>

            <View style={{ marginBottom: 22 }}>
              <HeroCarousel onPressBanner={goToShop} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Watch & shop</Text>
            </View>
            <View style={{ marginBottom: 24 }}>
              <ReelsStrip onPressReel={() => goToShop("All")} />
            </View>

            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Bestsellers</Text>
            </View>

            {error && (
              <View style={styles.center}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}
            {loading && (
              <View style={styles.center}>
                <ActivityIndicator size="large" color={colors.leaf} />
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
              onPress={() => navigation.navigate("Shop", { screen: "ShopMain" })}
            >
              <Text style={styles.viewAllText}>View all products</Text>
            </TouchableOpacity>
          ) : null
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  appbar: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  paddingHorizontal: 20,
  paddingTop: 14,
  paddingBottom: 18,
  },
  greetSmall: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    color: colors.muted,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  greetName: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.forest,
    marginTop: 3,
  },
  avatarRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
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
  search: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 12,
    paddingHorizontal: 15,
    marginHorizontal: 18,
    marginBottom: 20,
  },
  searchText: { fontFamily: fonts.sans, fontSize: 13.5, color: colors.muted },
  sectionHeader: { paddingHorizontal: 18, marginBottom: 13 },
  sectionTitle: { fontFamily: fonts.serif, fontSize: 19, color: colors.forest },
  center: { paddingVertical: 40, alignItems: "center" },
  errorText: { fontFamily: fonts.sans, color: "#c0392b", textAlign: "center", paddingHorizontal: 30 },
  viewAllBtn: {
  marginHorizontal: 18,
  marginTop: 16,
  paddingVertical: 14,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.leaf,
  alignItems: "center",
  },
  viewAllText: { fontFamily: fonts.sansBold, fontSize: 13, color: colors.leaf },
});