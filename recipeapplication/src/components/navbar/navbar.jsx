// Navbar.js
import React from "react";
import "./navbar.css";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const logout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div className="navbar">
      <div className="navbar-container">
        <h1>Hadis Recipe Book</h1>
        <ul className="links">
          <li>
            <Link to="/home">All Recipes</Link>
          </li>
          <li>
            <Link to="/add-recipe">Add a new recipe</Link>
          </li>
        </ul>
        <button onClick={logout}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
