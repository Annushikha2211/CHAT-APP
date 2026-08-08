import express from "express";
import cors from "cors";
import dotenv from "dotenv"
import connectDatabase from "./config/database";
import authRoutes from "./routes/authRoutes";

dotenv.config();

const app=express();
connectDatabase();
app.use(express.json());
app.use(cors());

app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
    res.send("chat app server is running")
});

app.listen(process.env.PORT || 5000,()=>{
    console.log("server is runnig on port 5000")

})