import axios from "axios";
import { API_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = (category, search) => {
  const params = {};
  if (category && category !== "All") params.category = category;
  if (search) params.search = search;
  return api.get("/products", { params });
};
export const getProductById = (id) => api.get(`/products/${id}`);

export const createOrder = (orderData) => api.post("/orders", orderData);

export default api;