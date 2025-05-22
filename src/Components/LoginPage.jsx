import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/login", {  // Changed URL here
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        alert("Login successful!");
      
        // ✅ Save token to localStorage so Dashboard can access it
        localStorage.setItem("token", data.token);
      
        // (Optional: Store user info if needed)
        localStorage.setItem("user", JSON.stringify({
          name: data.username,
          email: formData.email,
          designation: "",
          photo: "",
        }));
      
        navigate("/dashboard");
      }
      
      else {
        alert(data.message || "User not found. Please create your account.");
      }
    } catch (error) {
      alert("Error connecting to server");
    }
  };

  return (
    <div className="login-page">
      <h2>Login to Your Account</h2>
      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <br />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <br />
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
