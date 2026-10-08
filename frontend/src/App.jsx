import { BrowserRouter, Navigate, Route, Routes } from "react-router";

import AddProductPage from "./pages/AddProductPage.jsx";
import EditProductPage from "./pages/EditProductPage.jsx";
import ProductPage from "./pages/ProductPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/product" replace />} />
        <Route path="/product" element={<ProductPage />} />
        <Route path="/product/new" element={<AddProductPage />} />
        <Route path="/product/:id/edit" element={<EditProductPage />} />
        <Route path="*" element={<Navigate to="/product" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
