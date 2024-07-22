import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            email: response.data.email,
            username: response.data.username,
          })
        );
        toast.success("Login successful!", {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });

        setTimeout(() => navigate("/home"), 2000); // Navigate after the toast auto-closes
      } else {
        toast.error("Login failed: " + response.data.error, {
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
      toast.error("Failed to login: " + error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1>Login</h1>
        <ToastContainer />
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
          Don't have an account? <Link to="/">Register Here</Link>
        </p>
      </div>
    </div>
  );
}
