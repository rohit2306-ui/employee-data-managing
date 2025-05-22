import React from "react";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const navigate = useNavigate();

  return (
    <div className="main-page">
      <div className="main-content">
        <h1>Welcome to LifeLinkr</h1>
        <p>Manage employees smartly with our secure and fast admin panel.</p>

        <div className="main-buttons">
          <button onClick={() => navigate("/signup")}>Create Your Account</button>
          <button onClick={() => navigate("/login")}>Login Into Your Account</button>
        </div>
      </div>
    </div>
  );
};

export default MainPage;
