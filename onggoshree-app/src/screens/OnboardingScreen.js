import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    tagline: "Rooted in nature, radiant by you — clean skincare made in Bangladesh.",
    banglaTagline: "প্রকৃতির যত্নে, আপনার জেল্লা।",
  },
  {
    tagline: "Skin AI reads your skin in seconds and builds a routine just for you.",
    banglaTagline: "আপনার ত্বকের জন্য বিশেষ যত্ন।",
  },
  {
    tagline: "Earn Glow points on every order and unlock real rewards.",
    banglaTagline: "প্রতিটি অর্ডারে জিতুন গ্লো পয়েন্ট।",
  },
];

export default function OnboardingScreen({ onDone, navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const handleScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(index);
  };

  const handleBegin = () => {
    if (activeIndex < SLIDES.length - 1) {
      listRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      onDone();
      navigation.navigate("Signup");
    }
  };

  const handleSignIn = () => {
    onDone();
    navigation.navigate("Login");
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.artStage}>
        <View style={styles.vessel}>
          <View style={styles.vesselTop} />
          <View style={styles.vesselBody} />
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Text style={styles.mark}>অঙ্গশ্রী</Text>
            <Text style={styles.brand}>Onggoshree</Text>
            <Text style={styles.tagline}>{item.tagline}</Text>
            <Text style={styles.banglaTagline}>{item.banglaTagline}</Text>
          </View>
        )}
      />

      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotOn]} />
        ))}
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.beginBtn} onPress={handleBegin}>
          <Text style={styles.beginBtnText}>
            {activeIndex < SLIDES.length - 1 ? "Next" : "Begin your ritual"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handleSignIn} style={styles.signInRow}>
          <Text style={styles.signInText}>
            Already glowing? <Text style={styles.signInBold}>Sign in</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.forest },
  artStage: { height: 220, justifyContent: "center", alignItems: "center" },
  vessel: { alignItems: "center" },
  vesselTop: { width: 46, height: 16, borderRadius: 6, backgroundColor: colors.glow, marginBottom: -2 },
  vesselBody: { width: 96, height: 110, borderRadius: 24, backgroundColor: colors.leaf },

  slide: { alignItems: "center", paddingHorizontal: 34 },
  mark: { fontFamily: fonts.bengali, fontSize: 22, color: colors.glowSoft },
  brand: { fontFamily: fonts.serif, fontSize: 28, color: "#fff", marginTop: 4, marginBottom: 18 },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: "rgba(255,255,255,0.85)",
    textAlign: "center",
    lineHeight: 22,
  },
  banglaTagline: {
    fontFamily: fonts.bengaliBody,
    fontSize: 12.5,
    color: "rgba(255,255,255,0.55)",
    textAlign: "center",
    marginTop: 8,
  },

  dots: { flexDirection: "row", justifyContent: "center", gap: 7, marginTop: 20, marginBottom: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "rgba(255,255,255,0.3)" },
  dotOn: { backgroundColor: colors.glow, width: 18 },

  footer: { paddingHorizontal: 26, paddingBottom: 10 },
  beginBtn: {
    backgroundColor: colors.glow,
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: "center",
  },
  beginBtnText: { fontFamily: fonts.sansBold, fontSize: 14, color: colors.forest },
  signInRow: { alignItems: "center", marginTop: 16 },
  signInText: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.7)" },
  signInBold: { fontFamily: fonts.sansBold, color: "#fff" },
});