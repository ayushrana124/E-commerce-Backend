import Category from "../../../models/category.js";

export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ message: "Name is required" });

    const exists = await Category.findOne({ name: name.trim() });
    if (exists)
      return res.status(400).json({ message: "Category already exists" });

    const category = new Category({ name: name.trim() });
    await category.save();
    res.status(201).json({
      message: "Category Added",
      data: category,
    });
  } catch (error) {
    res.status(500).json({ message: error.message || "Internal server error" });
  }
};
