import axios from "axios";
import { API_URL } from "../constants/config";
import * as SecureStore from "expo-secure-store";


const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Automatically attach the stored token to every outgoing request, if one exists.
// এর অর্থ হলো, প্রতিটি আলাদা স্ক্রিনের জন্য এটি ম্যানুয়ালি pass করার কথা মনে রাখার প্রয়োজন নেই।
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getProducts = (category, search) => {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (search) params.search = search;
  return api.get("/products", { params });
};

export const getProductById = (id) => api.get(`/products/${id}`);

export const createOrder = (orderData) => api.post("/orders", orderData);

export const registerUser = (data) => api.post("/auth/register", data);
export const loginUser = (data) => api.post("/auth/login", data);
export const getMe = () => api.get("/auth/me");

export const getMyOrders = () => api.get("/orders/mine");

export const redeemDiscount = () => api.post("/rewards/redeem-discount");

export const googleLoginRequest = (idToken) => api.post("/auth/google", { idToken });

//Address API
export const getMyAddresses = () => api.get("/addresses/mine");
export const createAddress = (data) => api.post("/addresses", data);
export const updateAddress = (id, data) => api.put(`/addresses/${id}`, data);
export const deleteAddress = (id) => api.delete(`/addresses/${id}`);

//admin order API calls
export const getAllOrdersAdmin = () => api.get("/admin/orders");
export const updateOrderStatusAdmin = (id, status) => api.patch(`/admin/orders/${id}`, { status });
export const deleteOrderAdmin = (id) => api.delete(`/admin/orders/${id}`);

//wishlist
export const getMyWishlist = () => api.get("/wishlist/mine");
export const toggleWishlist = (productId) => api.post("/wishlist/toggle", { productId });

export const createProductAdmin = (data) => api.post("/products", data);
export const updateProductAdmin = (id, data) => api.put(`/products/${id}`, data);
export const deleteProductAdmin = (id) => api.delete(`/products/${id}`);

export const uploadProductImage = (formData) =>
  api.post("/products/upload-image", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export default api;