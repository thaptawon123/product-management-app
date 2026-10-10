// Base API URL from environment variable with fallback for local dev / Vercel deployment
const RAW_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  (typeof window !== "undefined" && window.location.hostname.includes("run.app")
    ? ""
    : "http://localhost:5000")
).replace(/\/+$/, "");

// Normalize endpoint to match Backend route: /api/products
const getEndpointUrl = (base) => {
  if (!base) return "/api/products";
  if (base.endsWith("/api/products")) return base;
  if (base.endsWith("/api")) return `${base}/products`;
  return `${base}/api/products`;
};

const API_URL = getEndpointUrl(RAW_BASE_URL);

const request = async (url, option = {}) => {
  const response = await fetch(url, option);
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
  }
  return response.json();
};

const getProducts = () => request(API_URL);

const getProduct = (id) => request(`${API_URL}/${id}`);

const createProduct = (product) =>
  request(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

const updateProduct = (id, product) =>
  request(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });

const deleteProduct = (id) =>
  request(`${API_URL}/${id}`, {
    method: "DELETE",
  });

export { getProduct, getProducts, createProduct, updateProduct, deleteProduct };
