import Order from '../../../models/orderModel.js';
import Address from '../../../models/addressModel.js';
import Cart from '../../../models/cartModel.js';

export const createOrder = async (req, res) => {
    try {
        const userId = req.user._id;
        const { address, paymentMethod } = req.body;

        if (!address || !paymentMethod) {
            return res.status(400).json({ message: "Address and Payment Method are required" });
        }

        const addressData = await Address.findOne({ _id: address, user : userId });
        if (!addressData) {
            return res.status(404).json({ message: "Address not found" });
        }

        const cart = await Cart.findOne({ user : userId }).populate("items.product");
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: "Cart is empty" });
        }

        console.log("cart", cart)

        const totalAmount = cart.items.reduce((total, item) => total + item.quantity * item.product.price, 0);
        console.log("Total amount :", totalAmount);
        

        const orderItems = cart.items.map(item => ({
            name: item.product.name,
            qty: item.quantity,
            price: item.product.price
        }));

        console.log("Order Items :", orderItems);

        const newOrder = new Order({
            userId,
            address: `${addressData.street}, ${addressData.city}, ${addressData.state}, ${addressData.postalCode}`,
            paymentMethod,
            orderItems,
            totalAmount,
        });

        const savedOrder = await newOrder.save();

        console.log("newOrder created :", savedOrder);


        cart.items = [];
        await cart.save();

        res.status(201).json({ message: 'Order placed successfully', order: savedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};


export const getMyOrders = async (req, res) => {
    try {
        const userId = req.user._id;

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });

        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getOrderById = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id).populate('userId', 'name email');

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};
