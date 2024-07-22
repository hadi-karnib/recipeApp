import React, { useState } from "react";
import axios from "axios";
import "./register.css";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Register() {
  const navigate = useNavigate();

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
      if (response.data.success) {
        toast.success("Registration successful!", {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
        setTimeout(() => navigate("/login"), 3000); // Navigate after the toast auto-closes
      } else {
        toast.error("Registration failed: " + response.data.error, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      }
    } catch (error) {
      toast.error("Failed to register: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "light",
      });
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <ToastContainer />
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
          Already have an account? <Link to="/login">Login Here</Link>
        </p>
      </div>
    </div>
  );
}
