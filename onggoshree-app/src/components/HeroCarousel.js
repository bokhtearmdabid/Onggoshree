import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions, ImageBackground } from "react-native";
import { colors, fonts } from "../constants/theme";
import { BANNERS } from "../constants/banners";

const { width } = Dimensions.get("window");
const CARD_WIDTH = width - 36;

export default function HeroCarousel({ onPressBanner }) {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScrollEnd = (event) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / (CARD_WIDTH + 12));
    setActiveIndex(index);
  };

  return (
    <View>
      <FlatList
        data={BANNERS}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        snapToInterval={CARD_WIDTH + 12}
        decelerationRate="fast"
        onMomentumScrollEnd={handleScrollEnd}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
        renderItem={({ item }) => (
        <TouchableOpacity
          style={[styles.card, { width: CARD_WIDTH }]}
          activeOpacity={0.9}
          onPress={() => onPressBanner(item.category)}
        >
          <ImageBackground
            source={{ uri: item.image }}
            style={styles.image}
            imageStyle={{ borderRadius: 22 }}
          >
            <View style={styles.overlay}>
              <View style={[styles.tintLayer, { backgroundColor: item.bg }]} />
              <View style={styles.content}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.subtitle}>{item.subtitle}</Text>
                <View style={styles.cta}>
                  <Text style={styles.ctaText}>Shop now</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        </TouchableOpacity>
      )}
      />
      <View style={styles.dots}>
        {BANNERS.map((_, i) => (
          <View key={i} style={[styles.dot, i === activeIndex && styles.dotOn]} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    height: 140,
    borderRadius: 22,
  },
  title: { fontFamily: fonts.serif, fontSize: 19, color: "#fff", marginBottom: 4 },
  subtitle: { fontFamily: fonts.sans, fontSize: 12, color: "rgba(255,255,255,0.75)" },
  cta: {
    alignSelf: "flex-start",
    backgroundColor: "rgba(255,255,255,0.18)",
    borderRadius: 20,
    paddingVertical: 6,
    paddingHorizontal: 14,
    marginTop: 12,
  },
  ctaText: { fontFamily: fonts.sansBold, fontSize: 11, color: "#fff" },
  dots: { flexDirection: "row", justifyContent: "center", gap: 6, marginTop: 10 },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: colors.line },
  dotOn: { backgroundColor: colors.leaf, width: 16 },
  card: {
  height: 140,
  borderRadius: 22,
  overflow: "hidden",
  },
  image: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
    opacity: 0.95, // lets the photo show through while keeping text readable
  },
});