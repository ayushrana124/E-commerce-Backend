import express from 'express'
import { isAdmin, protect } from '../middleware/AuthMiddleware.js';
import { addProduct } from '../controllers/admin/product/createProduct.js';
import { deleteProduct } from '../controllers/admin/product/deleteProduct.js';
import { updateProduct } from '../controllers/admin/product/updateProduct.js';
import { getAllProducts } from '../controllers/admin/product/getAllProducts.js';
const router = express.Router();

// CRUD products { ADMIN ONLY }
router.post('/add-product', protect, isAdmin, addProduct);
router.delete("/:id", protect, isAdmin, deleteProduct);
router.put("/:id", protect, isAdmin, updateProduct);

//Common
router.get("/getallproducts", protect, getAllProducts );


export default router;