import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDatabase from "./config/database";
import authRoutes from "./routes/authRoutes";
import userRoutes from "./routes/userRoutes";
import messageRoutes from "./routes/messageRoutes";

dotenv.config();

const app=express();
connectDatabase();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes);

app.get("/",(req,res)=>{
    res.send("chat app server is running")
});

app.listen(process.env.PORT || 5000,()=>{
    console.log("server is runnig on port 5000")

})