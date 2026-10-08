import { Router } from "express";
import {
  createProduct,
  getAllProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controller/productController.js";

const productRouter = Router();

productRouter.post("/", createProduct);
productRouter.get("/", getAllProduct);
productRouter.get("/:id", getProductById);
productRouter.put("/:id", updateProduct);
productRouter.delete("/:id", deleteProduct);

export default productRouter;
