import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import ProductHeader from "../components/ProductHeader";
import ProductList from "../components/ProductList";
import { deleteProduct, getProducts } from "../services/productService";
import {
  confirmDelete,
  showError,
  showSuccess,
} from "../services/alertService";
const ProductPage = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    const loadingProducts = async () => {
      setLoading(true);
      setError("");
      try {
        setProducts(await getProducts());
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    loadingProducts();
  }, []);
  const handleDelete = async (id) => {
    if (!(await confirmDelete())) return;
    try {
      await deleteProduct(id);
      setProducts((currentProducts) =>
        currentProducts.filter((product) => product.id !== id),
      );
      showSuccess("ลบสินค้าสำเร็จ");
    } catch (error) {
      showError(error);
    }
  };
  return (
    <main className="min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-6">
        <ProductHeader />
        <div className="flex justify-end">
          <Link className="btn btn-primary" to="/product/new">
            เพิ่มสินค้า
          </Link>
        </div>
        {!loading && (
          <ProductList
            products={products}
            onEdit={(product) => navigate(`/product/${product.id}/edit`)}
            onDelete={handleDelete}
          />
        )}
      </div>
    </main>
  );
};

export default ProductPage;
