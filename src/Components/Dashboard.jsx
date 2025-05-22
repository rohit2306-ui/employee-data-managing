import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortKey, setSortKey] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    // Fetch user info
    axios
      .get("http://localhost:5000/api/user", config)
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        console.error("Error fetching user:", err);
        navigate("/login");
      });

    // Fetch employees list
    axios
      .get("http://localhost:5000/api/employees", config)
      .then((res) => {
        setEmployees(res.data.employees || []);
      })
      .catch((err) => {
        console.error("Error fetching employees:", err);
        setEmployees([]);
      });
  }, [navigate]);

  // Filter & sort employees
  const filteredSortedEmployees = useMemo(() => {
    let filtered = employees.filter((emp) => {
      const term = searchTerm.toLowerCase();
      return (
        (emp.name && emp.name.toLowerCase().includes(term)) ||
        (emp.email && emp.email.toLowerCase().includes(term)) ||
        (emp.mobile && emp.mobile.toLowerCase().includes(term))
      );
    });

    if (sortKey === "email") {
      filtered.sort((a, b) => a.email.localeCompare(b.email));
    } else if (sortKey === "date") {
      filtered.sort(
        (a, b) => new Date(b.joiningDate).getTime() - new Date(a.joiningDate).getTime()
      );
    }

    return filtered;
  }, [employees, searchTerm, sortKey]);

  if (!user) return <p>Loading user info...</p>;

  return (
    <div className="dashboard-container">
      {/* User details */}
      <h2>Welcome, {user.name || user.username} to your database</h2>
      {/* <img
        src={user.photo || "https://via.placeholder.com/150"}
        alt="Profile"
        className="profile-pic"
      /> */}
      {/* <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Designation:</strong> {user.designation || "N/A"}</p> */}

      {/* Employee controls */}
      <div className="controls" style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ marginRight: "1rem", padding: "6px", width: "250px" }}
        />
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
          style={{ padding: "6px" }}
        >
          <option value="">Sort By</option>
          <option value="email">Email (A-Z)</option>
          <option value="date">Joining Date (Newest First)</option>
        </select>
      </div>

      <button onClick={() => navigate("/add-employee")} className="add-employee-btn">
        ➕ Add Employee
      </button>

      {/* Employees table */}
      {filteredSortedEmployees.length === 0 ? (
        <p>No employees found.</p>
      ) : (
        <table className="employee-table" style={{ width: "100%", marginTop: "1rem" }}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Mobile</th>
              <th>Joining Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filteredSortedEmployees.map((emp) => (
              <tr
                key={emp._id}
                onClick={() => navigate(`/manage-employee/${emp._id}`)}
                style={{ cursor: "pointer" }}
              >
                <td>{emp.name}</td>
                <td>{emp.email}</td>
                <td>{emp.mobile}</td>
                <td>{emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString() : "N/A"}</td>
                <td>
                  <button
                  className="manage-btn"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/manage-employee/${emp._id}`);
                    }}
                  >
                    Manage
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Dashboard;
