import { Request, Response } from "express";
import bcrypt from "bcrypt";
import User from "../models/User";
import jwt from "jsonwebtoken";

export const signup = async (req: Request, res: Response) => {
  
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
  return res.status(400).json({
    message: "Please fill all the fields",
  });
}

const existingUser=await User.findOne({email});
if (existingUser) {
  return res.status(409).json({
    message: "User already exists",
  });
}
const hashedPassword = await bcrypt.hash(password, 10);

const user = await User.create({
  name,
  email,
  password: hashedPassword,
});

return res.status(201).json({
  message: "User created successfully",
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

};

export const login=async (req:Request,res:Response)=>{

  const {email,password}=req.body;

if (!email || !password) {
  return res.status(400).json({
    message: "Please fill all the fields",
  });
}
const user = await User.findOne({ email });

if (!user) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

const isMatch = await bcrypt.compare(password, user.password);

if (!isMatch) {
  return res.status(401).json({
    message: "Invalid email or password",
  });
}

const token = jwt.sign(
  { userId: user._id },
  process.env.JWT_SECRET as string,
  { expiresIn: "7d" }
);
return res.status(200).json({
  message: "Login successful",
  token,
  user: {
    id: user._id,
    name: user.name,
    email: user.email,
  },
});

};



