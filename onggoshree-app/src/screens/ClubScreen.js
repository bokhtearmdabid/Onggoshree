import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../context/AuthContext";
import { colors, fonts } from "../constants/theme";

const TIER_THRESHOLDS = [
  { name: "Bronze", min: 0 },
  { name: "Silver", min: 500 },
  { name: "Radiant", min: 1000 },
  { name: "Gold", min: 1500 },
];

// Reward redemption isn't wired up yet — these show real, live point costs,
// but tapping one doesn't deduct points or apply anything at checkout.
// That's a separate feature: a redeem endpoint + a discount step in Checkout.
const REWARDS = [
  { icon: "gift", title: "৳100 off any order", subtitle: "Applied at checkout", cost: 500 },
  { icon: "heart", title: "Free Lip Balm", subtitle: "Add to any bag", cost: 800 },
  { icon: "box", title: "Mystery Glow Box", subtitle: "Unlocks at Gold", cost: 1500 },
];

export default function ClubScreen() {
  const { user } = useAuth();
  const points = user?.points ?? 0;
  const tier = user?.tier ?? "Bronze";

  const currentIndex = TIER_THRESHOLDS.findIndex((t) => t.name === tier);
  const nextTier = TIER_THRESHOLDS[currentIndex + 1];
  const pointsToNext = nextTier ? nextTier.min - points : 0;

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={{ paddingBottom: 30 }}>
        <View style={styles.hero}>
          <View style={styles.tierPill}>
            <Feather name="award" size={12} color={colors.glow} />
            <Text style={styles.tierText}>{tier} member</Text>
          </View>

          <View style={styles.ring}>
            <Text style={styles.pts}>{points.toLocaleString()}</Text>
            <Text style={styles.ptsLabel}>Glow points</Text>
          </View>

          <Text style={styles.next}>
            {nextTier ? (
              <>
                Only <Text style={styles.bold}>{pointsToNext} points</Text> to unlock {nextTier.name}
              </>
            ) : (
              "You've reached the top tier"
            )}
          </Text>
        </View>

        <View style={styles.body}>
          <Text style={styles.lbl}>Redeem rewards</Text>
          {REWARDS.map((r) => {
            const locked = points < r.cost;
            return (
              <View key={r.title} style={[styles.reward, locked && styles.rewardLocked]}>
                <View style={styles.rewardIcon}>
                  <Feather name={r.icon} size={16} color={colors.leaf} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.rewardTitle}>{r.title}</Text>
                  <Text style={styles.rewardSubtitle}>{r.subtitle}</Text>
                </View>
                <Text style={styles.rewardCost}>{r.cost.toLocaleString()} pts</Text>
              </View>
            );
          })}

          <Text style={styles.lbl}>Earn more</Text>
          <View style={styles.earnCard}>
            <View style={styles.rewardIcon}>
              <Feather name="shopping-bag" size={16} color={colors.leaf} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.rewardTitle}>Shop the catalog</Text>
              <Text style={styles.rewardSubtitle}>Earn 1 point for every ৳10 spent</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  hero: { backgroundColor: colors.forest, alignItems: "center", paddingTop: 26, paddingBottom: 32, paddingHorizontal: 20 },
  tierPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(231,179,107,0.18)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 20,
  },
  tierText: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.glow, letterSpacing: 0.4 },
  ring: {
    width: 130,
    height: 130,
    borderRadius: 65,
    borderWidth: 7,
    borderColor: colors.glow,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  pts: { fontFamily: fonts.serif, fontSize: 26, color: "#fff" },
  ptsLabel: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.glowSoft, letterSpacing: 0.5, marginTop: 2 },
  next: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.8)", marginTop: 18 },
  bold: { fontFamily: fonts.sansBold, color: "#fff" },

  body: { padding: 18 },
  lbl: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.forest,
    marginBottom: 10,
    marginTop: 16,
  },
  reward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  rewardLocked: { opacity: 0.5 },
  rewardIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
  },
  rewardTitle: { fontFamily: fonts.sans, fontSize: 13, fontWeight: "600", color: colors.forest },
  rewardSubtitle: { fontFamily: fonts.sans, fontSize: 11, color: colors.muted, marginTop: 2 },
  rewardCost: { fontFamily: fonts.sansBold, fontSize: 11.5, color: colors.forest },

  earnCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 13,
  },
});