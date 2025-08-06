import express from 'express'
//Middleware
import { isAdmin, protect } from '../middleware/AuthMiddleware.js';
//Products
import { getAllProducts } from '../controllers/user/product/getAllProducts.js';
//Orders
import {
    createOrder,
    getOrderById,
    getMyOrders
} from '../controllers/user/order/orderController.js';
//Category
import { getCategoryList } from "../controllers/user/category/getCategory.js";
//Cart
import {
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/user/cart/cartController.js";
//AUTH
import signUpController from "../controllers/user/Auth/SignupController.js";
import signInController from "../controllers/user/Auth/SigninController.js";
import signOutController from "../controllers/user/Auth/SignoutController.js";
//Address
import {
    addAddress,
    getAddress,
    updateAddress,
    deleteAddress,
} from "../controllers/user/address/addressController.js";

const router = express.Router();

// PRODUCTS ROUTES 
router.get("/products/getallproducts", getAllProducts);

//ORDER ROUTES
router.post('/order/create', protect, createOrder);
router.get('/order/get', protect, getMyOrders);
router.get('/order/:id', protect, getOrderById);

// CATEGORY ROUTES
router.get('/category/get-categories', getCategoryList)


// CART ROUTES 
router.post("/cart/add", protect, addToCart);
router.get("/cart/", protect, getCart);
router.put("/cart/update", protect, updateCartItem);
router.delete("/cart/remove/:productId", protect, removeCartItem);
router.delete("/cart/clear", protect, clearCart);


// AUTH ROUTES
router.post("/auth/signup", signUpController);
router.post("/auth/signin", signInController);
router.post("/auth/signout", signOutController);
router.get("/auth/verify", protect, (req, res) => {
    res.status(200).json({ success: true, user: req.user });
});


// ADDRESS ROUTES
router.post("/address/add", protect, addAddress);
router.get("/address/", protect, getAddress);
router.put("/address/edit/:id", protect, updateAddress);
router.delete("/address/delete/:id", protect, deleteAddress);

export default router;