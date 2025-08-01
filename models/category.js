import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
     status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", categorySchema);
export default Category;
