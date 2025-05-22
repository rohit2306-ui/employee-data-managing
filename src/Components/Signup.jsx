import { useState } from "react";

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    designation: "",
    photo: "",
  });
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Signup successful! You can login now.");
        setForm({ name: "", email: "", password: "", designation: "", photo: "" });
      } else {
        setMessage(`❌ ${data.message}`);
      }
    } catch (err) {
      setMessage("❌ Error connecting to server");
    }
  };

  return (
    <div className="signup-container">
      <h2>Create your account</h2>
      <form onSubmit={handleSubmit} className="signup-form">
        <input
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          minLength={6}
        />
        <input
          name="designation"
          placeholder="Designation (e.g., Software Engineer)"
          value={form.designation}
          onChange={handleChange}
          required
        />
        <input
          name="photo"
          placeholder="Photo URL"
          value={form.photo}
          onChange={handleChange}
        />

        <button type="submit">Sign Up</button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
}
