import Product from "../../../models/ProductModel.js";
import Category from "../../../models/category.js";
import mongoose from "mongoose";
import fs from "fs";
import path from "path";

export const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ message: "Invalid product ID." });
    }

    const { name, price, description, categoryName, countInStock, status } =
      req.body;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found." });
    }

    // Update basic fields if provided
    if (name) product.name = name;
    if (price) product.price = price;
    if (description) product.description = description;
    if (countInStock !== undefined) product.countInStock = countInStock;
    if (status && ["active", "inactive", "deleted"].includes(status)) {
      product.status = status;
    }

    // Handle category change
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName });
      if (!category) {
        return res.status(400).json({ message: "Category not found." });
      }
      product.category = category._id;
    }

    //  Handle image replacement if a new one is uploaded
    if (req.files && req.files.image) {
      const uploadedFile = req.files.image;

      if (!uploadedFile.mimetype.startsWith("image/")) {
        return res
          .status(400)
          .json({ message: "Only image files are allowed." });
      }

      const extension = path.extname(uploadedFile.name);
      const safeName = (name || product.name)
        .toLowerCase()
        .replace(/[^a-z0-9]/gi, "-");
      const filename = `${safeName}-${Date.now()}${extension}`;

      const uploadDir = path.join("uploads");
      if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
      }

      const imagePath = path.join(uploadDir, filename);
      await uploadedFile.mv(imagePath);

      product.image = filename;
      product.imageUrl = `${process.env.BASE_URL}/uploads/${filename}`;
    }

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully.",
      data: product,
    });
  } catch (error) {
    console.error("❌ Error updating product:", error.message);
    res.status(500).json({ message: "Server error. Try again." });
  }
};
