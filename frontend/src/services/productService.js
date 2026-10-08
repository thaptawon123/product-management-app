const API_URL = `${import.meta.env.VITE_API_URL}/api/products`;

const request = async (url, option) => {
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
