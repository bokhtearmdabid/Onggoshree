import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions } from "expo-camera";
import { Feather } from "@expo/vector-icons";
import { colors, fonts } from "../constants/theme";

export default function SkinAIScreen({ navigation }) {
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState("front");
  const [scanning, setScanning] = useState(false);
  const cameraRef = useRef(null);

  // Permissions haven't loaded yet
  if (!permission) {
    return <View style={styles.screen} />;
  }

  // if permission not granted — ask for it with a friendly explanation first
  if (!permission.granted) {
    return (
      <SafeAreaView style={styles.permissionScreen}>
        <Feather name="camera" size={40} color={colors.leaf} />
        <Text style={styles.permTitle}>Camera access needed</Text>
        <Text style={styles.permText}>
          We use your camera to analyze your skin and recommend the right products for you!
        </Text>
        <TouchableOpacity style={styles.permBtn} onPress={requestPermission}>
          <Text style={styles.permBtnText}>Allow camera access</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const handleCapture = async () => {
    if (!cameraRef.current || scanning) return;

    try {
      await cameraRef.current.takePictureAsync({ skipProcessing: true });
      setScanning(true);

      // Simulated analysis delay. There is no real skin-analysis model behind
      // this yet — see ResultsScreen.js for the mock data and how to swap in
      // a real AI service later.
      setTimeout(() => {
        setScanning(false);
        navigation.navigate("SkinResults");
      }, 2200);
    } catch (error) {
      console.log("Capture failed:", error.message);
    }
  };

  return (
    <View style={styles.screen}>
      <CameraView ref={cameraRef} style={StyleSheet.absoluteFill} facing={facing}>
        <SafeAreaView style={styles.overlay} edges={["top", "bottom"]}>
          <View style={styles.head}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack?.()}>
              <Feather name="arrow-left" size={18} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headTitle}>Skin analysis</Text>
            <View style={{ width: 38 }} />
          </View>

          <View style={styles.stage}>
            <View style={styles.faceRing}>
              {scanning && (
                <>
                  <View style={[styles.node, { top: "40%", left: "28%" }]} />
                  <View style={[styles.node, { top: "52%", left: "70%" }]} />
                  <View style={[styles.node, { top: "66%", left: "44%" }]} />
                </>
              )}
            </View>
          </View>

          <View style={styles.tip}>
            <Text style={styles.tipTitle}>{scanning ? "Hold still…" : "Center your face"}</Text>
            <Text style={styles.tipText}>
              {scanning
                ? "Reading tone, texture & hydration across 5 zones"
                : "Good lighting helps get an accurate reading"}
            </Text>
          </View>

          <View style={styles.foot}>
            <View style={{ width: 44 }} />
            <TouchableOpacity
              style={[styles.shutter, scanning && styles.shutterActive]}
              onPress={handleCapture}
              disabled={scanning}
            />
            <TouchableOpacity
              style={styles.side}
              onPress={() => setFacing((f) => (f === "front" ? "back" : "front"))}
            >
              <Feather name="refresh-cw" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#000" },
  overlay: { flex: 1, justifyContent: "space-between" },

  head: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 6,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  headTitle: { fontFamily: fonts.sansBold, fontSize: 14, color: "#fff" },

  stage: { flex: 1, justifyContent: "center", alignItems: "center" },
  faceRing: {
    width: 230,
    height: 290,
    borderRadius: 130,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.55)",
    borderStyle: "dashed",
  },
  node: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.glow,
  },

  tip: { alignItems: "center", paddingHorizontal: 30, marginBottom: 10 },
  tipTitle: { fontFamily: fonts.serif, fontSize: 18, color: "#fff", marginBottom: 4 },
  tipText: { fontFamily: fonts.sans, fontSize: 12, color: "rgba(255,255,255,0.75)", textAlign: "center" },

  foot: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 34,
    paddingBottom: 20,
  },
  side: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.15)",
    justifyContent: "center",
    alignItems: "center",
  },
  shutter: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#fff",
    borderWidth: 4,
    borderColor: "rgba(255,255,255,0.4)",
  },
  shutterActive: { backgroundColor: colors.glow },

  permissionScreen: {
    flex: 1,
    backgroundColor: colors.canvas,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 36,
  },
  permTitle: { fontFamily: fonts.serif, fontSize: 20, color: colors.forest, marginTop: 16, marginBottom: 8 },
  permText: { fontFamily: fonts.sans, fontSize: 13, color: colors.muted, textAlign: "center", lineHeight: 20 },
  permBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 13, paddingHorizontal: 26, marginTop: 22 },
  permBtnText: { fontFamily: fonts.sansBold, fontSize: 13, color: "#fff" },
});