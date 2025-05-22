import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ManageEmployee = () => {
  const { id } = useParams(); // Get employee ID from route
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");

    if (!storedUser || !token) {
      alert("Unauthorized access. Please login.");
      navigate("/login");
      return;
    }

    setUser(storedUser);

    // Fetch employee by ID
    axios
      .get(`http://localhost:5000/api/employees/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setEmployee(res.data.employee);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching employee:", err);
        alert("Failed to fetch employee details.");
        navigate("/dashboard");
      });
  }, [id, navigate]);

  const handleEdit = () => {
    navigate(`/edit-employee/${employee._id}`); // absolute path
  };

  const handleDelete = () => {
    const confirmed = window.confirm("Are you sure you want to delete this employee?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/employees/${employee._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then(() => {
        alert("Employee deleted successfully.");
        navigate("/dashboard");
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("Failed to delete employee.");
      });
  };

  const handleToggleStatus = () => {
    const newStatus = employee.status === "inactive" ? "active" : "inactive";
    const token = localStorage.getItem("token");

    axios
      .patch(
        `http://localhost:5000/api/employees/${employee._id}/status`,
        { status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((res) => {
        setEmployee((prev) => ({ ...prev, status: newStatus }));
        alert(`Employee status updated to ${newStatus}.`);
      })
      .catch((err) => {
        console.error("Status update error:", err);
        alert("Failed to update status.");
      });
  };

  if (loading) return <p>Loading employee data...</p>;
  if (!employee) return <p>Employee not found.</p>;

  return (
    <div className="manage-container">
      <h2>👤 Manage Employee</h2>

      <div className={`employee-card ${employee.status === "inactive" ? "inactive" : ""}`}>
        <img
          src={employee.image || "https://via.placeholder.com/120"}
          alt="Employee"
          className="employee-photo"
        />
       <div className="text">
       <h3>{employee.name}</h3>
        <p><strong>Email:</strong> {employee.email}</p>
        <p><strong>Mobile:</strong> {employee.mobile}</p>
        <p><strong>Gender:</strong> {employee.gender}</p>
        <p><strong>Designation:</strong> {employee.designation}</p>
        <p><strong>Courses:</strong> {employee.courses?.join(", ") || "N/A"}</p>
        <p>
          <strong>Status:</strong>{" "}
          <span className={employee.status === "inactive" ? "red" : "green"}>
            {employee.status === "inactive" ? "Inactive" : "Active"}
          </span>
        </p>
       </div>

        <div className="button-group">
          <button className="edit-btn" onClick={handleEdit}>✏️ Edit</button>
          <button className="delete-btn" onClick={handleDelete}>🗑 Delete</button>
          <button className="deactivate-btn" onClick={handleToggleStatus}>
            {employee.status === "inactive" ? "Activate" : "Deactivate"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ManageEmployee;
