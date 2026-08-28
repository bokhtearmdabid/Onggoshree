import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Feather } from "@expo/vector-icons";
import {
  createProductAdmin,
  updateProductAdmin,
  uploadProductImage,
} from "../api/api";
import { colors, fonts } from "../constants/theme";

export default function AdminProductFormScreen({ route, navigation }) {
  const editing = route.params?.product;

  const [name, setName] = useState(editing?.name || "");
  const [description, setDescription] = useState(editing?.description || "");
  const [price, setPrice] = useState(editing?.price ? String(editing.price) : "");
  const [compareAtPrice, setCompareAtPrice] = useState(
    editing?.compareAtPrice ? String(editing.compareAtPrice) : ""
  );
  const [category, setCategory] = useState(editing?.category || "");
  const [stock, setStock] = useState(editing?.stock ? String(editing.stock) : "");
  const [imageUrl, setImageUrl] = useState(editing?.imageUrl || "");
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handlePickImage = async () => {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow photo library access to upload an image.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7, // compress somewhat — keeps upload fast and file size reasonable
      allowsEditing: true,
      aspect: [1, 1],
    });

    if (result.canceled) return;

    const asset = result.assets[0];
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("image", {
        uri: asset.uri,
        name: "product.jpg",
        type: "image/jpeg",
      });

      const response = await uploadProductImage(formData);
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.log("Image upload failed:", error.message);
      Alert.alert("Upload failed", "Couldn't upload the image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!name.trim() || !description.trim() || !price || !category.trim() || !stock) {
      Alert.alert("Missing details", "Please fill in name, description, price, category, and stock.");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      price: Number(price),
      compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
      category: category.trim(),
      stock: Number(stock),
      imageUrl,
    };

    setSubmitting(true);
    try {
      if (editing) {
        await updateProductAdmin(editing._id, payload);
      } else {
        await createProductAdmin(payload);
      }
      navigation.goBack();
    } catch (error) {
      const serverMessage = error.response?.data?.message;
      Alert.alert("Couldn't save", serverMessage || "Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.topTitle}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={18} color={colors.forest} />
        </TouchableOpacity>
        <Text style={styles.title}>{editing ? "Edit product" : "New product"}</Text>
        <View style={{ width: 18 }} />
      </View>

      <ScrollView contentContainerStyle={styles.form}>
        <TouchableOpacity style={styles.imagePicker} onPress={handlePickImage} disabled={uploading}>
          {uploading ? (
            <ActivityIndicator color={colors.leaf} />
          ) : imageUrl ? (
            <Image source={{ uri: imageUrl }} style={styles.previewImage} />
          ) : (
            <>
              <Feather name="camera" size={24} color={colors.muted} />
              <Text style={styles.imagePickerText}>Add photo</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.label}>Name</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Product name" placeholderTextColor={colors.muted} />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Product description"
          placeholderTextColor={colors.muted}
          multiline
          numberOfLines={4}
        />

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Price (৳)</Text>
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="399"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Compare-at (optional)</Text>
            <TextInput
              style={styles.input}
              value={compareAtPrice}
              onChangeText={setCompareAtPrice}
              placeholder="599"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Category</Text>
            <TextInput
              style={styles.input}
              value={category}
              onChangeText={setCategory}
              placeholder="Facial"
              placeholderTextColor={colors.muted}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Stock</Text>
            <TextInput
              style={styles.input}
              value={stock}
              onChangeText={setStock}
              placeholder="40"
              placeholderTextColor={colors.muted}
              keyboardType="numeric"
            />
          </View>
        </View>

        <TouchableOpacity
          style={[styles.saveBtn, submitting && styles.saveBtnDisabled]}
          onPress={handleSave}
          disabled={submitting}
        >
          <Text style={styles.saveBtnText}>{submitting ? "Saving..." : "Save product"}</Text>
        </TouchableOpacity>
      </ScrollView>
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
  title: { fontFamily: fonts.serif, fontSize: 19, color: colors.forest },

  form: { paddingHorizontal: 18, paddingBottom: 40 },
  imagePicker: {
    height: 160,
    borderRadius: 16,
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
    overflow: "hidden",
  },
  previewImage: { width: "100%", height: "100%" },
  imagePickerText: { fontFamily: fonts.sans, fontSize: 12, color: colors.muted, marginTop: 6 },

  label: { fontFamily: fonts.sansBold, fontSize: 11, color: colors.forest, marginBottom: 6, marginTop: 12 },
  input: {
    backgroundColor: colors.milk,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontFamily: fonts.sans,
    fontSize: 13.5,
    color: colors.forest,
  },
  textArea: { height: 90, textAlignVertical: "top" },
  row: { flexDirection: "row", gap: 12 },

  saveBtn: { backgroundColor: colors.forest, borderRadius: 14, paddingVertical: 15, alignItems: "center", marginTop: 24 },
  saveBtnDisabled: { opacity: 0.6 },
  saveBtnText: { fontFamily: fonts.sansBold, fontSize: 13.5, color: "#fff" },
});