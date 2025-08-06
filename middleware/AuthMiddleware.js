import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({ message: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth Error:", err);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Middleware for role-based access
export const isAdmin = (req, res, next) => {
  if (req.user?.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Forbidden: Admins only" });
  }
};

