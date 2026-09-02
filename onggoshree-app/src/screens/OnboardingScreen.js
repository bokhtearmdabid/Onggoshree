import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Image,
  Animated,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors, fonts } from "../constants/theme";

const { width } = Dimensions.get("window");

const SLIDES = [
  {
    tagline: "Rooted in nature, radiant by you — clean skincare made in Bangladesh.",
    banglaTagline: "প্রকৃতির যত্নে, আপনার রূপ।",
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

//Company logo
const LOGO = require("../../assets/android-icon-foreground.png");

export default function OnboardingScreen({ onDone, navigation }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);
  const logoScale = useRef(new Animated.Value(0.9)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
        <View style={styles.haloOuter} />
        <View style={styles.haloInner} />
        <Animated.View
          style={[
            styles.logoWrap,
            { opacity: logoOpacity, transform: [{ scale: logoScale }] },
          ]}
        >
          <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        </Animated.View>
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
            <View style={styles.taglineDivider} />
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
        <TouchableOpacity
          style={styles.beginBtn}
          onPress={handleBegin}
          activeOpacity={0.85}
        >
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
  artStage: {
    height: 220,
    justifyContent: "center",
    alignItems: "center",
  },
  haloOuter: {
    position: "absolute",
    width: 190,
    height: 190,
    borderRadius: 95,
    backgroundColor: "rgba(255,255,255,0.04)",
  },
  haloInner: {
    position: "absolute",
    width: 138,
    height: 138,
    borderRadius: 69,
    backgroundColor: "rgba(255,255,255,0.06)",
  },
  logoWrap: {
    width: 108,
    height: 108,
    borderRadius: 54,
    backgroundColor: "rgb(21, 58, 24)",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 8,
  },
  logo: { width: 108, height: 108 },

  slide: { alignItems: "center", paddingHorizontal: 34 },
  mark: {
    fontFamily: fonts.bengali,
    fontSize: 20,
    color: colors.glowSoft,
    letterSpacing: 0.5,
  },
  brand: {
    fontFamily: fonts.serif,
    fontSize: 30,
    color: "#fff",
    marginTop: 6,
    letterSpacing: 0.3,
  },
  taglineDivider: {
    width: 30,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.glow,
    marginTop: 14,
    marginBottom: 18,
    opacity: 0.8,
  },
  tagline: {
    fontFamily: fonts.sans,
    fontSize: 14,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    lineHeight: 22,
  },
  banglaTagline: {
    fontFamily: fonts.bengaliBody,
    fontSize: 12.5,
    color: "rgba(255,255,255,0.5)",
    textAlign: "center",
    marginTop: 10,
  },

  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 7,
    marginTop: 22,
    marginBottom: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.28)",
  },
  dotOn: { backgroundColor: colors.glow, width: 20 },

  footer: { paddingHorizontal: 26, paddingBottom: 12 },
  beginBtn: {
    backgroundColor: colors.glow,
    borderRadius: 18,
    paddingVertical: 17,
    alignItems: "center",
    shadowColor: colors.glow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  beginBtnText: {
    fontFamily: fonts.sansBold,
    fontSize: 14.5,
    color: colors.forest,
    letterSpacing: 0.3,
  },
  signInRow: { alignItems: "center", marginTop: 18 },
  signInText: { fontFamily: fonts.sans, fontSize: 12.5, color: "rgba(255,255,255,0.7)" },
  signInBold: { fontFamily: fonts.sansBold, color: "#fff" },
});