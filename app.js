import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import cookieParser from 'cookie-parser';
import connectToDb from "./db/db.js";
import authRoutes from "./routes/AuthRoutes.js";
import categoryRoutes from "./routes/CategoryRoutes.js"
import productRoutes from "./routes/ProductRoutes.js"
import cartRoutes from "./routes/cartRoutes.js"
import addressRoutes from "./routes/AddressRoutes.js"
import path from "path";
import fileUpload from "express-fileupload";
import { fileURLToPath } from "url";

dotenv.config();
connectToDb();

const app = express ();
const PORT = process.env.PORT || 5000 ;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

//middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(fileUpload());


app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true, 
  })
);

//Auth Routes
app.use("/api/auth", authRoutes);

//Product Routes
app.use('/api/products', productRoutes);

//Category Routes
app.use('/api/category', categoryRoutes);

//Cart Routes
app.use("/api/cart", cartRoutes);

//Address Routes
app.use("/api/address", addressRoutes);
 
//Upload Images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.get('/', (req, res) => {
    res.send("Server is live");
})

app.listen(PORT, ()=> {
    console.log(`Server Running on port : ${PORT}`)
})