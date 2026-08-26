import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  FlatList,
  Linking,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { colors, fonts } from "../constants/theme";
import { SOCIALS } from "../constants/socials";

// Darkens a hex color by a percentage, used to build the gradient's 2nd stop
function shade(hex, percent) {
  const num = parseInt(hex.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = ((num >> 8) & 0x00ff) + amt;
  const B = (num & 0x0000ff) + amt;
  const clamp = (v) => Math.max(0, Math.min(255, v));
  return (
    "#" +
    (
      0x1000000 +
      clamp(R) * 0x10000 +
      clamp(G) * 0x100 +
      clamp(B)
    )
      .toString(16)
      .slice(1)
  );
}

function SocialCard({ item, index }) {
  const slide = useRef(new Animated.Value(30)).current;
  const fade = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(slide, {
        toValue: 0,
        duration: 420,
        delay: index * 90,
        useNativeDriver: true,
      }),
      Animated.timing(fade, {
        toValue: 1,
        duration: 420,
        delay: index * 90,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const onPressIn = () =>
    Animated.spring(scale, {
      toValue: 0.93,
      useNativeDriver: true,
      speed: 40,
      bounciness: 8,
    }).start();

  const onPressOut = () =>
    Animated.spring(scale, {
      toValue: 1,
      useNativeDriver: true,
      speed: 30,
      bounciness: 10,
    }).start(() => Linking.openURL(item.url));

  return (
    <Animated.View
      style={{
        opacity: fade,
        transform: [{ translateX: slide }, { scale }],
      }}
    >
      <TouchableWithoutFeedback onPressIn={onPressIn} onPressOut={onPressOut}>
        <View style={styles.card}>
          <LinearGradient
            colors={[item.color, shade(item.color, -25)]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconCircle}
          >
            <Ionicons name={item.icon} size={18} color="#fff" />
          </LinearGradient>
          <Text style={styles.name}>{item.name}</Text>
        </View>
      </TouchableWithoutFeedback>
    </Animated.View>
  );
}

export default function SocialFollowRow() {
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.lbl}>Follow us</Text>
      <FlatList
        data={SOCIALS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ gap: 12, paddingHorizontal: 2, paddingVertical: 4 }}
        renderItem={({ item, index }) => <SocialCard item={item} index={index} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  lbl: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.forest,
    marginBottom: 12,
  },
  card: {
    width: 84,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: "center",
    gap: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  name: {
    fontFamily: fonts.sansBold,
    fontSize: 10.5,
    color: colors.forest,
  },
});