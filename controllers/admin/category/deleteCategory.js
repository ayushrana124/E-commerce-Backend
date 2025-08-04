import Category from "../../../models/category.js";
import mongoose from "mongoose";

export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json("Invalid Id");
    }

    const category = await Category.findById(id);

    if (!category) {
      return res.status(400).json("Category not found");
    }

    if (category.status === "deleted" ) {
      return res.status(400).json("Category Already marked as DELETED");
    }

    category.status = "deleted";
    await category.save();

    return res.status(200).json({ message: "Category marked as deleted" });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
