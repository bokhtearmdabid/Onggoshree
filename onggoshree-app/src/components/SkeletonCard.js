import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { colors } from "../constants/theme";

export default function SkeletonCard() {
  const opacity = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.4, duration: 700, useNativeDriver: true }),
      ])
    );
    pulse.start();
    return () => pulse.stop(); // stop the animation loop when this unmounts
  }, []);

  return (
    <Animated.View style={[styles.card, { opacity }]}>
      <View style={styles.image} />
      <View style={styles.lineShort} />
      <View style={styles.lineTiny} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 150,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 20,
    padding: 12,
    marginRight: 13,
  },
  image: { height: 104, borderRadius: 14, backgroundColor: colors.ivory, marginBottom: 11 },
  lineShort: { height: 10, width: "70%", borderRadius: 5, backgroundColor: colors.ivory, marginBottom: 6 },
  lineTiny: { height: 10, width: "40%", borderRadius: 5, backgroundColor: colors.ivory },
});