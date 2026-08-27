import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";
import { SOCIALS } from "../constants/socials";

export default function SocialFollowRow() {
  return (
    <View style={{ marginTop: 8 }}>
      <Text style={styles.lbl}>Follow us</Text>
      <FlatList
        data={SOCIALS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.name}
        contentContainerStyle={{ gap: 10 }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.85}
            onPress={() => Linking.openURL(item.url)}
          >
            <View style={[styles.iconCircle, { backgroundColor: item.color }]}>
              <Ionicons name={item.icon} size={18} color="#fff" />
            </View>
            <Text style={styles.name}>{item.name}</Text>
          </TouchableOpacity>
        )}
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