import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  FlatList,
  Dimensions,
} from "react-native";
import { getProductById } from "../api/api";
import { colors, fonts } from "../constants/theme";
import { useCart } from "../context/CartContext";
import { Feather, Ionicons } from "@expo/vector-icons";
import { useWishlist } from "../context/WishlistContext";
import { getDiscountPercent } from "../utils/pricing";

const { width } = Dimensions.get("window");

export default function ProductDetailScreen({ route, navigation }) {
  const { productId } = route.params;
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();
  const { isWishlisted, toggle } = useWishlist();

  const galleryImages =
    product?.images?.length > 0
      ? product.images.slice(0, 5)
      : product?.imageUrl
      ? [product.imageUrl]
      : [];

  const discountPercent = product ? getDiscountPercent(product) : null;

  useEffect(() => {
    getProductById(productId)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log("Error fetching product:", err.message))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={colors.leaf} />
      </View>
    );
  }

  if (!product) {
    return (
      <View style={styles.center}>
        <Text style={{ fontFamily: fonts.sans, color: colors.muted }}>
          Product not found.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.screen}>
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }}>
        {/* Hero image area */}
        <View style={styles.hero}>
          <View style={styles.heroTop}>
            <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.goBack()}>
              <Feather name="arrow-left" size={18} color={colors.forest} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.iconBtn}
              onPress={() => toggle(product._id)}
            >
              <Ionicons
                name={isWishlisted(product._id) ? "heart" : "heart-outline"}
                size={19}
                color={isWishlisted(product._id) ? "#c0392b" : colors.forest}
              />
            </TouchableOpacity>
          </View>

          {galleryImages.length > 0 ? (
            <>
              <FlatList
                data={galleryImages}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                style={{ height: 290 }}
                keyExtractor={(_, i) => String(i)}
                onMomentumScrollEnd={(e) => {
                  const index = Math.round(e.nativeEvent.contentOffset.x / width);
                  setActiveImageIndex(index);
                }}
                renderItem={({ item }) => (
                  <Image source={{ uri: item }} style={[styles.heroImage, { width }]} resizeMode="cover" />
                )}
              />
              {galleryImages.length > 1 && (
                <View style={styles.galleryDots}>
                  {galleryImages.map((_, i) => (
                    <View key={i} style={[styles.galleryDot, i === activeImageIndex && styles.galleryDotOn]} />
                  ))}
                </View>
              )}
            </>
          ) : (
            <Text style={styles.heroLetter}>
              {product.name ? product.name.charAt(0).toUpperCase() : "?"}
            </Text>
          )}
        </View>

        {/* Details */}
        <View style={styles.body}>
          <Text style={styles.category}>{product.category?.toUpperCase()}</Text>
          <Text style={styles.name}>{product.name}</Text>

          <View style={styles.meta}>
            <Text style={styles.rate}>★ 4.9 · 308 reviews</Text>
          </View>

          <View style={{ flexDirection: "row", alignItems: "baseline", gap: 10 }}>
            <Text style={styles.price}>৳{Number(product.price).toFixed(0)}</Text>
            {discountPercent ? (
              <>
                <Text style={styles.compareAtDetail}>
                  ৳{Number(product.compareAtPrice).toFixed(0)}
                </Text>
                <View style={styles.discountPill}>
                  <Text style={styles.discountPillText}>{discountPercent}% OFF</Text>
                </View>
              </>
            ) : null}
          </View>

          <Text style={styles.desc}>{product.description}</Text>

          <Text style={styles.lbl}>Stock</Text>
          <Text style={styles.stock}>
            {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
          </Text>
        </View>
      </ScrollView>

      {/* Sticky bottom CTA */}
      <View style={styles.cta}>
        <View style={styles.qty}>
          <TouchableOpacity onPress={() => setQty((q) => Math.max(1, q - 1))}>
            <Text style={styles.qtyBtn}>−</Text>
          </TouchableOpacity>
          <Text style={styles.qtyNum}>{qty}</Text>
          <TouchableOpacity onPress={() => setQty((q) => q + 1)}>
            <Text style={styles.qtyBtn}>+</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            addToCart(product, qty);
            navigation.navigate("Cart");
          }}
        >
          <Text style={styles.addBtnText}>
            Add to bag · <Text style={styles.addBtnPrice}>৳{(product.price * qty).toFixed(0)}</Text>
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.milk },
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.milk },

  hero: {
    height: 290,
    backgroundColor: colors.ivory,
    justifyContent: "center",
    alignItems: "center",
  },
  heroTop: {
    position: "absolute",
    top: 10,
    left: 16,
    right: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 5,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    justifyContent: "center",
    alignItems: "center",
  },
  iconBtnText: {
    fontSize: 16,
    color: colors.forest,
  },
  heroLetter: {
    fontFamily: fonts.serif,
    fontSize: 64,
    color: colors.leaf,
  },

  body: { padding: 18 },
  category: {
    fontFamily: fonts.sansBold,
    fontSize: 10,
    letterSpacing: 1.2,
    color: colors.leaf,
  },
  name: {
    fontFamily: fonts.serif,
    fontSize: 26,
    color: colors.forest,
    marginTop: 6,
    marginBottom: 8,
  },
  meta: { flexDirection: "row", alignItems: "center", gap: 12 },
  rate: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    color: colors.forest,
  },
  price: {
    fontFamily: fonts.serif,
    fontSize: 24,
    color: colors.forest,
    marginTop: 12,
  },
  desc: {
    fontFamily: fonts.sans,
    fontSize: 12.5,
    color: colors.muted,
    lineHeight: 20,
    marginTop: 14,
  },
  lbl: {
    fontFamily: fonts.sansBold,
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: colors.forest,
    marginTop: 18,
    marginBottom: 8,
  },
  stock: {
    fontFamily: fonts.sans,
    fontSize: 13,
    color: colors.muted,
  },

  cta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: colors.milk,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 26,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  qty: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: colors.ivory,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  qtyBtn: {
    fontSize: 18,
    color: colors.forest,
    fontWeight: "700",
  },
  qtyNum: {
    fontFamily: fonts.sansBold,
    fontSize: 14,
    color: colors.forest,
    minWidth: 16,
    textAlign: "center",
  },
  addBtn: {
    flex: 1,
    backgroundColor: colors.forest,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: "center",
  },
  addBtnText: {
    fontFamily: fonts.sansBold,
    fontSize: 13.5,
    color: "#fff",
  },
  addBtnPrice: {
    color: colors.glow,
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  compareAtDetail: {
    fontFamily: fonts.sans,
    fontSize: 16,
    color: colors.muted,
    textDecorationLine: "line-through",
  },
  discountPill: {
    backgroundColor: "#c0392b",
    borderRadius: 20,
    paddingVertical: 3,
    paddingHorizontal: 10,
  },
  discountPillText: { fontFamily: fonts.sansBold, fontSize: 10.5, color: "#fff" },

  galleryDots: {
    position: "absolute",
    bottom: 14,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  galleryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  galleryDotOn: {
    backgroundColor: "#fff",
    width: 18,
  },
});