import Product from "../../../models/ProductModel.js";
import Category from "../../../models/category.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { search, categoryName } = req.query;

    const query = {};

    // ✅ Search by name or description (case-insensitive)
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // ✅ Filter by category name
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (category) {
        query.category = category._id;
      } else {
        // No products if category doesn't exist
        return res.status(200).json({
          success: true,
          data: [],
          message: "No products found for this category.",
        });
      }
    }

    const total = await Product.countDocuments(query);

    const products = await Product.find(query)
      .populate("category", "name")
      .sort({ createdAt: -1 }) // latest first
      .skip((page - 1) * limit)
      .limit(limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalProducts: total,
      data: products,
    });
  } catch (error) {
    console.error("❌ Error getting products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};
