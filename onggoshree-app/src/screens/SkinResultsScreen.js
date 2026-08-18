import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { getProducts } from "../api/api";
import { useCart } from "../context/CartContext";
import { colors, fonts } from "../constants/theme";

// Remember Falows what you see below:
// MOCK DATA — there is no real skin-analysis model behind this yet.
// To wire up a real one later: send the captured photo to an AI/vision API from
// SkinAIScreen.js instead of the setTimeout delay, and pass its real response
// here via route.params instead of using this hardcoded object.
const MOCK_ANALYSIS = {
  skinType: "Combination · mild concerns",
  glowScore: 82,
  concerns: [
    { label: "Acne", level: "Moderate", pct: 62, color: colors.coral },
    { label: "Dryness", level: "Mild", pct: 44, color: colors.glow },
    { label: "Oiliness", level: "Low", pct: 38, color: colors.leaf },
    { label: "Dark spots", level: "Mild", pct: 50, color: colors.amber },
  ],
  recommendedProductNames: ["Acno Gel", "Pure Glow Serum"],
};

export default function SkinResultsScreen({ navigation }) {
  const [routineProducts, setRoutineProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    getProducts()
      .then((res) => {
        const matches = res.data.filter((p) =>
          MOCK_ANALYSIS.recommendedProductNames.includes(p.name)
        );
        setRoutineProducts(matches);
      })
      .catch((err) => console.log("Error fetching routine products:", err.message))
      .finally(() => setLoading(false));
  }, []);

  const routineTotal = routineProducts.reduce((sum, p) => sum + p.price, 0);

  const handleAddRoutine = () => {
    routineProducts.forEach((p) => addToCart(p, 1));
    navigation.navigate("Cart");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Your skin report</Text>
          <Text style={styles.heroSubtitle}>{MOCK_ANALYSIS.skinType}</Text>
          <View style={styles.scoreRing}>
            <Text style={styles.scoreBig}>{MOCK_ANALYSIS.glowScore}</Text>
            <Text style={styles.scoreSmall}>Glow score</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.lbl}>Top concerns</Text>
          <View style={styles.concerns}>
            {MOCK_ANALYSIS.concerns.map((c) => (
              <View key={c.label} style={styles.concernRow}>
                <View style={styles.concernTop}>
                  <Text style={styles.concernLabel}>{c.label}</Text>
                  <View style={[styles.dot, { backgroundColor: c.color }]} />
                </View>
                <View style={styles.barTrack}>
                  <View style={[styles.barFill, { width: `${c.pct}%`, backgroundColor: c.color }]} />
                </View>
                <Text style={styles.concernLevel}>{c.level}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.lbl}>Your routine</Text>
          {loading ? (
            <ActivityIndicator color={colors.leaf} style={{ marginVertical: 20 }} />
          ) : (
            <>
              <View style={styles.routineRow}>
                {routineProducts.map((p) => (
                  <TouchableOpacity
                    key={p._id}
                    style={styles.routineCard}
                    onPress={() => navigation.navigate("ProductDetail", { productId: p._id })}
                  >
                    <View style={styles.routineImage}>
                      <Text style={styles.routineLetter}>{p.name.charAt(0)}</Text>
                    </View>
                    <Text style={styles.routineName} numberOfLines={1}>{p.name}</Text>
                    <Text style={styles.routinePrice}>৳{p.price.toFixed(0)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              {routineProducts.length > 0 && (
                <TouchableOpacity style={styles.addRoutineBtn} onPress={handleAddRoutine}>
                  <Text style={styles.addRoutineText}>
                    Add routine to bag · <Text style={styles.addRoutinePrice}>৳{routineTotal.toFixed(0)}</Text>
                  </Text>
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  hero: {
    backgroundColor: colors.forest,
    alignItems: "center",
    paddingTop: 26,
    paddingBottom: 32,
    paddingHorizontal: 20,
  },
  heroTitle: { fontFamily: fonts.serif, fontSize: 22, color: "#fff" },
  heroSubtitle: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.7)", marginTop: 4, marginBottom: 20 },
  scoreRing: {
    width: 110,
    height: 110,
    borderRadius: 55,
    borderWidth: 6,
    borderColor: colors.glow,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  scoreBig: { fontFamily: fonts.serif, fontSize: 30, color: "#fff" },
  scoreSmall: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.glowSoft, letterSpacing: 0.6 },

  body: { padding: 18 },
  lbl: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.forest,
    marginBottom: 12,
    marginTop: 8,
  },
  concerns: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 15,
    gap: 14,
  },
  concernRow: {},
  concernTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 6 },
  concernLabel: { fontFamily: fonts.sans, fontSize: 12.5, fontWeight: "600", color: colors.forest },
  dot: { width: 8, height: 8, borderRadius: 4 },
  barTrack: { height: 6, borderRadius: 3, backgroundColor: colors.ivory, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3 },
  concernLevel: { fontFamily: fonts.sans, fontSize: 10.5, color: colors.muted, marginTop: 4 },

  routineRow: { flexDirection: "row", gap: 12, marginTop: 4 },
  routineCard: {
    flex: 1,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 18,
    padding: 11,
  },
  routineImage: {
    height: 90,
    borderRadius: 13,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  routineLetter: { fontFamily: fonts.serif, fontSize: 26, color: colors.leaf },
  routineName: { fontFamily: fonts.sans, fontSize: 12.5, fontWeight: "600", color: colors.forest },
  routinePrice: { fontFamily: fonts.sansBold, fontSize: 12.5, color: colors.forest, marginTop: 3 },

  addRoutineBtn: {
    backgroundColor: colors.forest,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
    marginTop: 16,
  },
  addRoutineText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
  addRoutinePrice: { color: colors.glow },
});