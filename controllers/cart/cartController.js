import Cart from "../../models/cartModel.js"
import Product from "../../models/ProductModel.js";

// calculate total price from cart items
const calculateTotalPrice = async (items) => {
  let total = 0;

  for (const item of items) {
    const product = await Product.findById(item.product);
    if (product) {
      total += product.price * item.quantity;
    }
  }

  return total;
};

// Add or update an item in the cart
export const addToCart = async (req, res) => {
  try {
    const userId = req.user._id; 
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
      const totalPrice = await calculateTotalPrice([{ product: productId, quantity }]);
      cart = await Cart.create({
        user: userId,
        items: [{ product: productId, quantity }],
        totalPrice,
      });
    } else {

        const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
      );

      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity });
      }

      cart.totalPrice = await calculateTotalPrice(cart.items);
      await cart.save();
    }

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to add to cart", error: err.message });
  }
};


//  Get cart for a user
export const getCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch cart", error: err.message });
  }
};

// Update quantity of a specific item
export const updateCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId, quantity } = req.body;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ success: false, message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    cart.totalPrice = await calculateTotalPrice(cart.items);

    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to update cart item", error: err.message });
  }
};

// Remove item from cart
export const removeCartItem = async (req, res) => {
  try {
    const userId = req.user._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    cart.totalPrice = await calculateTotalPrice(cart.items);
    await cart.save();

    res.status(200).json({ success: true, cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to remove item", error: err.message });
  }
};

// Clear entire cart
export const clearCart = async (req, res) => {
  try {
    const userId = req.user._id;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) return res.status(404).json({ success: false, message: "Cart not found" });

    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    res.status(200).json({ success: true, message: "Cart cleared", cart });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to clear cart", error: err.message });
  }
};
