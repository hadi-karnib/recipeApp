import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";
export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/recipe/recipeApp/backend/user/signin.php",
        formData
      );
      console.log(response);
      if (response.data.success) {
        navigate("/home");
      }
    } catch {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="login-container">
      <h1>Login</h1>
      <form className="form" onSubmit={handleSubmit}>
        <input
          placeholder="email"
          type="text"
          name="email"
          required
          value={formData.email}
          onChange={handleInputChange}
        />
        <input
          type="password"
          placeholder="password"
          name="password"
          required
          value={formData.password}
          onChange={handleInputChange}
        />
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
      <p>
        Don't have an account?<Link to="/"> Register Here</Link>
      </p>
    </div>
  );
}
