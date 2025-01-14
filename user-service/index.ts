import express from "express";
import cors from "cors";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { connectDB, UserModel } from "./db/schema";

dotenv.config();

const app = express();
const PORT = 8002;

app.use(
  cors({
    origin: "https://main.d2dwjnixvn5b5o.amplifyapp.com", // replace with frontend route
    methods: ["GET", "POST", "PATCH", "DELETE"],
  })
);
app.use(express.json());

// @ts-ignore
async function authMiddleware(req, res, next) {
  const token = req.headers.authorization;

  try {
    let jwtPayload;
    if (process.env.JWT_SECRET !== undefined) {
      jwtPayload = jwt.verify(token, process.env.JWT_SECRET);
    }
    // @ts-ignore
    req.empId = jwtPayload?.empId;
    next();
  } catch (e) {
    // @ts-ignore
    console.log("Error in middleware " + e.message);
    return res.json({ message: "Error in Auth Middleware" });
  }
}

app.get("/user/all", authMiddleware, async (req, res) => {
  const users = await UserModel.find({});
  //@ts-ignore
  const filteredUsers = users.filter((user) => user.empId !== req.empId);
  res.json({ users: filteredUsers });
});

app.get("/user/:empId", async (req, res) => {
  const { empId } = req.params;
  const user = await UserModel.findOne({ empId });
  res.json({ user });
});

//@ts-ignore
app.patch("/user/:empId", async (req, res) => {
  const { empId } = req.params;
  const isPresent = await UserModel.findOne({ empId });
  if (!isPresent) {
    return res.json({ message: "user not present" });
  }

  const user = await UserModel.findOneAndUpdate({ empId }, req.body, {
    new: true,
  });

  res.json({ user });
});

//@ts-ignore
app.delete("/user/:empId", async (req, res) => {
  const { empId } = req.params;
  const isPresent = await UserModel.findOne({ empId });
  if (!isPresent) {
    return res.json({ message: "user not present" });
  }

  await UserModel.findOneAndDelete({ empId });
  res.json({ message: "user deleted successfully" });
});

app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
  connectDB();
});
