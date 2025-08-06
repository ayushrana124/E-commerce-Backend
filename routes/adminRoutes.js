import express from 'express'
import { isAdmin, protect } from '../middleware/AuthMiddleware.js';

//Product
import { addProduct } from '../controllers/admin/product/createProduct.js';
import { deleteProduct } from '../controllers/admin/product/deleteProduct.js';
import { updateProduct } from '../controllers/admin/product/updateProduct.js';
//Category
import { deleteCategory } from "../controllers/admin/category/deleteCategory.js";
import { updateCategory } from "../controllers/admin/category/updateCategory.js";
import { createCategory } from "../controllers/admin/category/createCategory.js";

const router = express.Router();

// PRODUCT ROUTES
router.post('/products/add-product', protect, isAdmin, addProduct);
router.delete("/products/:id", protect, isAdmin, deleteProduct);
router.put("/products/:id", protect, isAdmin, updateProduct);

//CATEGORY ROUTES
router.post('/category/create-category', protect, isAdmin, createCategory);
router.delete("/category/:id", protect, isAdmin, deleteCategory);
router.put('/category/update-category/:id', protect, isAdmin, updateCategory)

export default router;