import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    designation: "",
    gender: "",
    image: "",
    status: "active",  // default status
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch(`http://localhost:5000/api/employees/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const emp = data.employee || data;

        if (emp) {
          setForm({
            name: emp.name || "",
            email: emp.email || "",
            mobile: emp.mobile || "",
            designation: emp.designation || "",
            gender: emp.gender || "",
            image: emp.image || "",
            status: emp.status || "active",  // status bhi set karo
          });
          setLoading(false);
        } else {
          alert("Employee not found");
          navigate("/dashboard");
        }
      })
      .catch((err) => {
        console.error("Fetch error:", err);
        alert("Error fetching employee");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
  
    try {
      const res = await fetch(`http://localhost:5000/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
  
      if (!res.ok) {
        const text = await res.text();
        alert("Error updating employee: " + text);
        return;
      }
  
      alert("Employee updated successfully!");
      navigate("/dashboard");
    } catch (err) {
      alert("Server error while updating");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="edit-employee-container" style={{ maxWidth: "500px", margin: "auto", padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Edit Employee</h2>
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
        {/* Existing inputs */}
        <input
          name="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <input
          name="mobile"
          type="text"
          placeholder="Mobile Number"
          value={form.mobile}
          onChange={handleChange}
          required
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <input
          name="designation"
          placeholder="Designation"
          value={form.designation}
          onChange={handleChange}
          required
          style={{ padding: "8px", fontSize: "1rem" }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <label>Gender:</label>
          <label>
            <input
              type="radio"
              name="gender"
              value="M"
              checked={form.gender === "M"}
              onChange={handleChange}
              required
            />
            M
          </label>
          <label>
            <input
              type="radio"
              name="gender"
              value="F"
              checked={form.gender === "F"}
              onChange={handleChange}
            />
            F
          </label>
        </div>
        <input
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          style={{ padding: "8px", fontSize: "1rem" }}
        />

        {/* New Status Dropdown */}
        <label>Status:</label>
        <select name="status" value={form.status} onChange={handleChange} style={{ padding: "8px", fontSize: "1rem" }}>
          <option value="active">Active</option>
          <option value="inactive">Inactive (Deactivate Account)</option>
        </select>

        <button type="submit" style={{ padding: "10px", fontSize: "1rem", cursor: "pointer" }}>
          Update
        </button>
      </form>
    </div>
  );
};

export default EditEmployee;
