import Product from "../../../models/ProductModel.js";
import Category from "../../../models/category.js";
import fs from "fs";
import path from "path";

export const addProduct = async (req, res) => {

const { name, price, description, categoryName, countInStock } = req.body;

console.log("name : ", name, " price : ", price, "categoty : ", categoryName);

 if ( !name || !price || !description || !categoryName) {
      return res.status(400).json({
        message: "Fields name, price, description, and categoryName are required.",
      });
    }

     const category = await Category.findOne({ name: categoryName });

    if (!category) {
      return res.status(400).json({ message: "Category not found." });
    }

 if (!req.files || !req.files.image) {
      console.log("Image file not received");
      return res.status(400).json({
        message: "Product image file is required.",
      });
    }

    const uploadedFile = req.files.image;

    if (!uploadedFile.mimetype.startsWith("image/")) {
      return res.status(400).json({ message: "Only image files are allowed." });
    }

    const extension = path.extname(uploadedFile.name);
    const safeName = name.toLowerCase().replace(/[^a-z0-9]/gi, "-");
    const filename = `${safeName}-${Date.now()}${extension}`;

    const uploadDir = path.join("uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Upload directory created.");
    }

    const imagePath = path.join(uploadDir, filename);
    await uploadedFile.mv(imagePath);

    const imageUrl = `${process.env.BASE_URL}/uploads/${filename}`; 
   
    const product = new Product({
      name,
      price,
      description,
      category: category._id,
      image: filename,
      imageUrl,
      countInStock
    });
    await product.save();

res.status(201).json({
      success: true,
      message: "Product created successfully.",
      data: product,
    });
    };