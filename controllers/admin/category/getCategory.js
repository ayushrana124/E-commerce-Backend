import Category from "../../../models/category.js";

export const getCategoryList = async (req, res) => {
  try {
    const categories = await Category.find().select("name").sort({ name: 1 });

    if (!categories) {
      return res.status(404).json("No Category Exists");
    }

    return res.json({
      success: true,
      message: " Category fetched successfully",
      data: categories,
    });
  } catch (error) {
    res.status(500).json("Internal Server Error");
  }
};
