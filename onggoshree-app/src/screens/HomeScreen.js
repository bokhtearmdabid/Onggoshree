import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import { getProducts } from "../api/api";

export default function HomeScreen() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProducts()
      .then((response) => {
        setProducts(response.data);
      })
      .catch((err) => {
        console.log("Error fetching products:", err.message);
        setError("Couldn't reach the server. Check your API_URL and that the backend is running.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2a6f4f" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shop</Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f7f7f7", paddingTop: 60, paddingHorizontal: 16 },
  header: { fontSize: 26, fontWeight: "700", marginBottom: 16, color: "#1a1a1a" },
  card: { backgroundColor: "#fff", padding: 16, borderRadius: 10, marginBottom: 10 },
  name: { fontSize: 16, fontWeight: "600" },
  price: { fontSize: 15, color: "#2a6f4f", marginTop: 4 },
  center: { flex: 1, justifyContent: "center", alignItems: "center", paddingHorizontal: 30 },
  errorText: { textAlign: "center", color: "#c0392b" },
});