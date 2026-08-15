import axios from "axios";
import { API_URL } from "../constants/config";

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getProducts = () => api.get("/products");
export const getProductById = (id) => api.get(`/products/${id}`);

export default api;