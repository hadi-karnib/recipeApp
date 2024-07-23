import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "./../../components/navbar/navbar";
import "./addRecipe.css";
import { toast, ToastContainer } from "react-toastify";

const AddRecipe = () => {
  const [formData, setFormData] = useState({
    recipe_name: "",
    ingredients: "",
    steps: "",
    user_id: "",
  });

  useEffect(() => {
    const userString = localStorage.getItem("user");

    if (userString) {
      const user = JSON.parse(userString);
      const id = user.id;
      console.log("User ID:", id);
      setFormData((prevFormData) => ({
        ...prevFormData,
        user_id: id,
      }));
    } else {
      console.log("No user data found in local storage.");
    }
  }, []);

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
      const ingredientsArray = formData.ingredients.split("\n");
      const stepsArray = formData.steps.split("\n");

      const response = await axios.post(
        "http://localhost/recipe/recipeApp/backend/recipes/createRecipe.php",
        {
          recipe_name: formData.recipe_name,
          ingredients: ingredientsArray,
          steps: stepsArray,
          user_id: formData.user_id,
        }
      );
      console.log("Success:", response.data);
      toast.success("Recipe added successfuly", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    } catch (error) {
      console.error("Failed to add recipe:", error);
      toast.error("Recipe failed to create", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
      });
    }
  };

  return (
    <div className="mainDiv">
      <Navbar />
      <ToastContainer />
      <div className="add-recipe-container">
        <h1>Add New Recipe</h1>
        <form className="form" onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              name="recipe_name"
              id="recipe_name"
              value={formData.recipe_name}
              onChange={handleInputChange}
              required
              placeholder="Recipe name"
            />
          </div>
          <div className="input-group">
            <textarea
              name="ingredients"
              id="ingredients"
              value={formData.ingredients}
              onChange={handleInputChange}
              required
              placeholder="Ingredients (one per line)"
            ></textarea>
          </div>
          <div className="input-group">
            <textarea
              name="steps"
              id="steps"
              value={formData.steps}
              onChange={handleInputChange}
              required
              placeholder="Steps (one per line)"
            ></textarea>
          </div>
          <input type="submit" value="Add Recipe" className="submit-btn" />
        </form>
      </div>
    </div>
  );
};

export default AddRecipe;
