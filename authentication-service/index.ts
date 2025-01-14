import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import jwt from "jsonwebtoken";
import { connectDB, UserModel } from "./db/schema";

dotenv.config();

const app = express();
const PORT = 8001;

app.use(
  cors({
    origin: "https://main.d2dwjnixvn5b5o.amplifyapp.com", // replace with frontend route
    methods: ["POST"],
  })
);
app.use(express.json());

// @ts-ignore
app.post("/auth/new", async (req, res) => {
  const { empId } = req.body;

  const isPresent = await UserModel.findOne({ empId });
  if (isPresent) {
    return res.json({ message: "user already present" });
  }

  const newUser = new UserModel(req.body);
  await newUser.save();

  const pmId = req.body.productManagerId;
  if (pmId) {
    await UserModel.findOneAndUpdate(
      { empId: pmId },
      { $push: { employees: newUser.empId } },
      { new: true }
    );
  }

  res.json({ message: "user created successfully" });
});

// @ts-ignore
app.post("/auth/login", async (req, res) => {
  const { empId, password } = req.body;

  const user = await UserModel.findOne({ empId });
  if (!user) {
    return res.json({ message: "user not present" });
  }

  if (password !== user.password) {
    return res.json({ message: "Password Incorrect" });
  }

  const userPayload = {
    empId: user.empId,
    role: user.role,
    users: user.employees,
  };

  if (process.env.JWT_SECRET) {
    const token = jwt.sign(userPayload, process.env.JWT_SECRET);
    res.json({ token });
  }
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
