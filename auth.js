// backend/routes/auth.js

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const SECRET_KEY = "rohit_secret"; // Replace with env in production

// User Schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);

// Employee Schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  designation: String,
  gender: String,
  courses: [String],
  image: String,
  joiningDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

const Employee = mongoose.model("Employee", employeeSchema);

// ------------------ SIGNUP ------------------
router.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    const newUser = new User({ name, email, password });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ------------------ LOGIN ------------------
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", user, token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ------------------ ADD EMPLOYEE ------------------
router.post("/employees", async (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    const userId = decoded.id;

    const { name, email, mobile, designation, gender, courses, image } = req.body;

    const newEmp = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image,
      userId,
    });

    await newEmp.save();
    res.status(201).json({ message: "Employee added", employee: newEmp });
  } catch (error) {
    console.error(error);
    res.status(401).json({ message: "Unauthorized or Invalid Token" });
  }
});

module.exports = router;
