import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Feather } from "@expo/vector-icons";
import { getMyAddresses, deleteAddress } from "../api/api";
import { colors, fonts } from "../constants/theme";

export default function AddressesScreen({ navigation }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAddresses = () => {
    getMyAddresses()
      .then((res) => setAddresses(res.data))
      .catch((err) => console.log("Error fetching addresses:", err.message))
      .finally(() => setLoading(false));
  };

  // Re-fetch every time this screen comes into focus — not just on first mount.
  // Without this, adding a new address and navigating back would show a stale
  // list until the app fully reloaded, since useEffect(..., []) only runs once.
  useFocusEffect(
    useCallback(() => {
      fetchAddresses();
    }, [])
  );

  const handleDelete = (address) => {
    Alert.alert("Delete address", `Remove "${address.label}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteAddress(address._id);
            setAddresses((prev) => prev.filter((a) => a._id !== address._id));
          } catch (error) {
            Alert.alert("Couldn't delete", "Please try again.");
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>Addresses</Text>
        <TouchableOpacity onPress={() => navigation.navigate("AddressForm")}>
          <Feather name="plus" size={20} color={colors.forest} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color={colors.leaf} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={addresses}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              activeOpacity={0.8}
              onPress={() => navigation.navigate("AddressForm", { address: item })}
            >
              <View style={styles.cardTop}>
                <View style={styles.labelPill}>
                  <Feather name={item.label.toLowerCase() === "work" ? "briefcase" : "home"} size={11} color={colors.leaf} />
                  <Text style={styles.labelText}>{item.label}</Text>
                </View>
                {item.isDefault && (
                  <View style={styles.defaultPill}>
                    <Text style={styles.defaultText}>DEFAULT</Text>
                  </View>
                )}
              </View>
              <Text style={styles.addressText}>{item.fullAddress}</Text>
              <Text style={styles.phoneText}>{item.phone}</Text>

              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
                <Feather name="trash-2" size={15} color="#c0392b" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.emptyState}>
              <Feather name="map-pin" size={32} color={colors.muted} />
              <Text style={styles.emptyText}>No saved addresses yet</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.canvas },
  topTitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 8,
    paddingBottom: 14,
  },
  title: { fontFamily: fonts.serif, fontSize: 20, color: colors.forest },

  list: { paddingHorizontal: 18, paddingBottom: 30, gap: 12 },
  card: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 16,
    padding: 15,
  },
  cardTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  labelPill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.ivory,
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 11,
  },
  labelText: { fontFamily: fonts.sansBold, fontSize: 11.5, color: colors.forest },
  defaultPill: { backgroundColor: "rgba(231,179,107,0.2)", borderRadius: 20, paddingVertical: 4, paddingHorizontal: 9 },
  defaultText: { fontFamily: fonts.sansBold, fontSize: 9, color: colors.amber, letterSpacing: 0.4 },
  addressText: { fontFamily: fonts.sans, fontSize: 13, color: colors.forest, lineHeight: 19, paddingRight: 30 },
  phoneText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 4 },
  deleteBtn: { position: "absolute", bottom: 14, right: 14 },

  emptyState: { alignItems: "center", paddingTop: 80 },
  emptyText: { fontFamily: fonts.sans, fontSize: 14, color: colors.muted, marginTop: 12 },
});