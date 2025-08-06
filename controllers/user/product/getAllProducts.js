import Product from "../../../models/ProductModel.js";
import Category from "../../../models/category.js";

export const getAllProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;

    const { search, categoryName } = req.query;

    const matchStage = {};

    if (search) {
      matchStage.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // Match by category
    if (categoryName) {
      const category = await Category.findOne({ name: categoryName, status : "active" });
      if (!category) {
        return res.status(200).json({
          success: true,
          message: "No products found for this category.",
          totalProducts: 0,
          totalPages: 0,
          data: [],
        });
      }
      matchStage.category = category._id;
    }

    matchStage.status = "active";

    const aggregationPipeline = [
      { $match: matchStage },

      // Join category collection
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },

      {
        $project: {
          name: 1,
          price: 1,
          description: 1,
          imageUrl: 1,
          countInStock: 1,
          status: 1,
          createdAt: 1,
          updatedAt: 1,
          category: "$categoryInfo.name",
        },
      },

      { $sort: { createdAt: -1 } },

      { $skip: (page - 1) * limit },
      { $limit: limit },
    ];

    const countPipeline = [{ $match: matchStage }, { $count: "total" }];

    const [products, countResult] = await Promise.all([
      Product.aggregate(aggregationPipeline),
      Product.aggregate(countPipeline),
    ]);

    const total = countResult[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);

    res.status(200).json({
      success: true,
      currentPage: page,
      totalPages,
      totalProducts: total,
      data: products,
    });
  } catch (error) {
    console.error("Error getting products:", error);
    res.status(500).json({ message: "Server error while fetching products." });
  }
};
