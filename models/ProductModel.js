import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    imageUrl: {
      type: String,
      default: "",
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 1,
    },
     status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);
export default Product;
