import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useVideoPlayer, VideoView } from "expo-video";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";
import { REELS } from "../constants/reels";

function ReelThumb({ reel, onPress }) {
  // Loaded paused, muted, at the first frame — acts as a free "thumbnail"
  // without needing separate poster images for every reel.
  const player = useVideoPlayer(reel.videoUrl, (p) => {
    p.muted = true;
  });

  return (
    <TouchableOpacity style={styles.card} activeOpacity={0.85} onPress={onPress}>
      <VideoView
        player={player}
        style={styles.video}
        contentFit="cover"
        nativeControls={false}
        pointerEvents="none"
      />
      <View style={styles.playBadge}>
        <Feather name="play" size={16} color="#fff" />
      </View>
      <View style={styles.overlay}>
        <Text style={styles.caption} numberOfLines={1}>{reel.caption}</Text>
      </View>
    </TouchableOpacity>
  );
}

function ReelPlayerModal({ reel, onClose }) {
  const player = useVideoPlayer(reel?.videoUrl ?? null, (p) => {
    p.loop = true;
    p.muted = false;
    p.play();
  });

  if (!reel) return null;

  return (
    <Modal visible={!!reel} animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalScreen}>
        <VideoView player={player} style={StyleSheet.absoluteFill} contentFit="contain" nativeControls />
        <SafeAreaView style={styles.modalHead}>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Feather name="x" size={20} color="#fff" />
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default function ReelsStrip({ onPressReel }) {
  const [playingReel, setPlayingReel] = useState(null);

  return (
    <View>
      <FlatList
        data={REELS}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 18, gap: 12 }}
        renderItem={({ item }) => (
          <ReelThumb reel={item} onPress={() => setPlayingReel(item)} />
        )}
      />
      <ReelPlayerModal reel={playingReel} onClose={() => setPlayingReel(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 108,
    height: 168,
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: colors.ivory,
  },
  video: { width: "100%", height: "100%" },
  playBadge: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -18,
    marginLeft: -18,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 8,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  caption: { fontFamily: fonts.sansBold, fontSize: 9.5, color: "#fff", marginTop: 2 },

  modalScreen: { flex: 1, backgroundColor: "#000" },
  modalHead: { position: "absolute", top: 0, left: 0, right: 0, padding: 14, alignItems: "flex-end" },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
});