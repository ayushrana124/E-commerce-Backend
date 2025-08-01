import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";
import bcrypt from "bcrypt";

const autoIncrement = AutoIncrementFactory(mongoose.connection);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "deleted"],
      default: "active",
    },
    cart: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    dob: Date,
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    profileImage: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.plugin(autoIncrement, { inc_field: "userId" });

userSchema.pre("save", async function (next) {
  if (this.name) {
    this.name = this.name
      .trim()
      .replace(/\s+/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  }

  if (this.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  }

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;
