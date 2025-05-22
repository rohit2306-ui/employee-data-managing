const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
const JWT_SECRET = "your_jwt_secret_key"; // Production में env से लें

// MongoDB कनेक्शन
mongoose.connect("mongodb://localhost:27017/lifelinkrDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.log(err));

// ----------------------- SCHEMAS -----------------------

// User schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  designation: String,
  photo: String,
});

const User = mongoose.model("User", userSchema);

// Employee schema
const employeeSchema = new mongoose.Schema({
  name: String,
  email: String,
  mobile: String,
  designation: String,
  gender: String,
  courses: [String],
  image: String,
  joiningDate: { type: Date, default: Date.now },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User से कनेक्ट
});

const Employee = mongoose.model("Employee", employeeSchema);

// ---------------------- ROUTES -------------------------

// Signup route
app.post("/api/signup", async (req, res) => {
  const { name, email, password, designation, photo } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password required" });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username: name,
      email,
      passwordHash,
      designation,
      photo,
    });

    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Login route
app.post("/api/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(400).json({ message: "Invalid email or password" });

    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });

    res.json({ token, username: user.username });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ message: "Access Denied: No Token" });

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ message: "Invalid Token" });
  }
};

// Add Employee (only if logged in)
app.post("/api/employees", verifyToken, async (req, res) => {
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
app.get("/api/employees", verifyToken, async (req, res) => {
  try {
    const employees = await Employee.find({ userId: req.user.id });
    res.status(200).json({ employees });
  } catch (err) {
    res.status(500).json({ message: "Error fetching employees" });
  }
});

// Get user info
app.get("/api/user", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Get specific employee by ID
app.get("/api/employees/:id", verifyToken, async (req, res) => {
  try {
    const employee = await Employee.findOne({ _id: req.params.id, userId: req.user.id });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.status(200).json({ employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});
// Update employee by ID (PUT)
app.put("/api/employees/:id", verifyToken, async (req, res) => {
  const employeeId = req.params.id;
  const userId = req.user.id;
  const updateData = req.body;

  try {
    const employee = await Employee.findOne({ _id: employeeId, userId });

    if (!employee) {
      return res.status(404).json({ message: "Employee not found or not authorized" });
    }

    const updatedEmployee = await Employee.findOneAndUpdate(
      { _id: employeeId, userId },
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error while updating employee" });
  }
});


// Delete employee by ID
app.delete("/api/employees/:id", verifyToken, async (req, res) => {
  try {
    const deleted = await Employee.findOneAndDelete({ _id: req.params.id, userId: req.user.id });

    if (!deleted) {
      return res.status(404).json({ message: "Employee not found or not authorized" });
    }

    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});


// Update employee status
app.patch("/api/employees/:id/status", verifyToken, async (req, res) => {
  const { status } = req.body;

  if (!["active", "inactive"].includes(status)) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  try {
    const employee = await Employee.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { status },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found or not authorized" });
    }

    res.status(200).json({ message: "Status updated", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
