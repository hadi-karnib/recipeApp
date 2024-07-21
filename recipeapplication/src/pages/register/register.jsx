import React, { useState } from "react";
import axios from "axios";
import "./register.css";
import { Link } from "react-router-dom";
export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost/recipe/recipeApp/backend/user/signup.php",
        formData
      );
      console.log("Success:", response.data);
    } catch (error) {
      console.error("Failed to register:", error);
    }
  };

  return (
    <div className="register-container">
      <h1>Register</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="input-group">
          <input
            type="text"
            name="username"
            required
            id="username"
            value={formData.username}
            onChange={handleInputChange}
          />
          <label htmlFor="username">Username</label>
        </div>
        <div className="input-group">
          <input
            type="email"
            name="email"
            required
            id="email"
            value={formData.email}
            onChange={handleInputChange}
          />
          <label htmlFor="email">Email</label>
        </div>
        <div className="input-group">
          <input
            type="password"
            name="password"
            required
            id="password"
            value={formData.password}
            onChange={handleInputChange}
          />
          <label htmlFor="password">Password</label>
        </div>
        <input type="submit" value="Submit" className="submit-btn" />
      </form>
      <p>
        Already have an account?<Link to="/login"> Login Here</Link>
      </p>
    </div>
  );
}
