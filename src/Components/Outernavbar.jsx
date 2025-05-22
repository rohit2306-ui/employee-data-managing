import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";

const OuterNavbar = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    navigate("/login");
  };

  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <nav className="outer-navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-brand">LifeLinkr</Link>
        <Link to="/" className="navbar-link">Home</Link>
      </div>
      <div className="navbar-right">
        {isLoggedIn && <span className="username">Hi, {username}</span>}
        {isLoggedIn && (
          <button className="logout-btn" onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
};

export default OuterNavbar;
