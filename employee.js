const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const Employee = require("../models/Employee");

const JWT_SECRET = process.env.JWT_SECRET || "your_jwt_secret_key";

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader)
    return res.status(401).json({ message: "Access Denied: No Token" });

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid Token" });
  }
};

// Add Employee
router.post("/", verifyToken, async (req, res) => {
  const { name, email, mobile, designation, gender, courses, image } = req.body;

  try {
    const newEmployee = new Employee({
      name,
      email,
      mobile,
      designation,
      gender,
      courses,
      image,
      userId: req.user.id,
    });

    await newEmployee.save();

    res.status(201).json({ message: "Employee added", employee: newEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding employee" });
  }
});

// Get Employees of logged-in user
router.get("/", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.user.id });
    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

module.exports = router;
