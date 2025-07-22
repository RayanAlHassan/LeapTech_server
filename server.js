// server.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/Mongo.js";
import UserRouter from "./routes/UserRoute.js";
import ConsultRoute from "./routes/ConsultRoute.js";
import ContactRouter from './routes/ContactRoute.js';
import CareerRoute from './routes/CareerRoute.js';
import ServiceRouter from './routes/ServicesRoute.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to DB
connectDB();
app.use((req, res, next) => {

  console.log(`INCOMING REQUEST: ${req.method} ${req.originalUrl}`);
  next();
});
// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ["http://localhost:3000"],
  credentials: true
}));
app.use(express.static("Public"));

// Routes
app.use("/user", UserRouter);
app.use("/consult", ConsultRoute);
app.use('/contact', ContactRouter);
app.use('/services', ServiceRouter);
app.use('/uploads', express.static('uploads'));
app.use('/career', CareerRoute);
// Start Server
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
