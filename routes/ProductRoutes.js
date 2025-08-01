import express from 'express'
import { isAdmin, protect } from '../middleware/AuthMiddleware.js';
import { addProduct } from '../controllers/admin/product/createProduct.js';
import { deleteProduct } from '../controllers/admin/product/deleteProduct.js';
import { updateProduct } from '../controllers/admin/product/updateProduct.js';
const router = express.Router();

// CRUD products { ADMIN ONLY }
router.post('/add-product', protect, addProduct);
router.delete("/:id", protect, deleteProduct);
router.put("/:id", protect, updateProduct);

// GET products { USER ONLY }

export default router;