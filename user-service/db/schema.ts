import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
  empId: {
    type: Number,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    enum: ["Intern", "PM", "Founder"],
  },
  password: {
    type: String,
    required: true,
  },
  productManagerId: {
    type: Number,
  },
  employees: {
    type: [Number],
  },
});

export const UserModel = mongoose.model("User", userSchema);

export function connectDB() {
  if (process.env.MONGO_URL !== undefined) {
    mongoose
      .connect(process.env.MONGO_URL)
      .then(() => console.log("Connected to DB"))
      .catch((err) => console.log("Error connecting DB = " + err.message));
  }
}
