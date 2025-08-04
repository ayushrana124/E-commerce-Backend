import express from "express";
import {
  addAddress,
  getAddress,
  updateAddress,
  deleteAddress,
} from "../controllers/address/addressController.js";
import { protect } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.post("/add", protect, addAddress);
router.get("/", protect, getAddress);
router.put("/edit/:id", protect, updateAddress);
router.delete("/delete/:id", protect, deleteAddress);

export default router;
