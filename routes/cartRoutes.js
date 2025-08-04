import express from "express";
import {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart/cartController.js";
import { isAdmin, protect } from "../middleware/AuthMiddleware.js";


const router = express.Router();

router.post("/add", protect, addToCart);
router.get("/", protect, getCart);
router.put("/update", protect, updateCartItem);
router.delete("/remove/:productId", protect, removeCartItem);
router.delete("/clear", protect, clearCart);

export default router;
