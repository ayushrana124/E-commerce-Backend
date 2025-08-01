import { createCategory } from "../controllers/admin/category/createCategory.js";
import express from 'express';
import { isAdmin, protect } from "../middleware/AuthMiddleware.js";
import { deleteCategory } from "../controllers/admin/category/deleteCategory.js";
import { getCategoryList } from "../controllers/admin/category/getCategory.js";
import { updateCategory } from "../controllers/admin/category/updateCategory.js";

const router = express.Router();
// Admin Category
router.post('/create-category', protect, createCategory);
router.delete("/:id", protect, deleteCategory);
router.put('/update-category/:id', protect, updateCategory)

//Common Routes
router.get('/get-categories', getCategoryList)
export default router;