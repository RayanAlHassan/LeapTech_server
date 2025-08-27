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
import chatbot from './routes/ChatBotRoute.js'
import quotation from "./routes/serviceQuotationRoute.js"
import category from "./routes/CategoriesRoute.js"
import  path  from "path";
import project from "./routes/ProjectRoute.js";

// Handle multipart/form-data before JSON
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
  origin: [
    "http://localhost:3000",
    "http://192.168.0.108:3000",
    "http://172.20.10.3:3000",
    "http://207.154.254.206"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],

  credentials: true
}));

app.use(express.static("Public"));

// Routes
app.use('/api/uploads', express.static(path.join(process.cwd(), 'uploads')));

// app.use('/api/uploads', express.static('uploads'));
// app.use('/api/uploads/images', express.static(path.join(process.cwd(), 'Uploads/images')));

app.use("/api/user", UserRouter);
app.use("/api/consult", ConsultRoute);
app.use('/api/contact', ContactRouter);
app.use('/api/services', ServiceRouter);
app.use('/api/career', CareerRoute);
app.use('/api/chatbot', chatbot); 
app.use('/api/quotation', quotation);
app.use('/api/category', category);
app.use("/api/projects", project);

app.get("/", (req, res) => {
  res.send("Backend is working");
});
// Start Server
app.listen(PORT, () => {

  console.log(`Server is running on port ${PORT}`);
});
