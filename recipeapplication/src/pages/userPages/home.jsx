import React, { useEffect, useState } from "react";
import Navbar from "./../../components/navbar/navbar";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const handleSeeMore = (id) => {
    navigate(`/recipe/${id}`);
  };
  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.post(
          "http://localhost/recipe/recipeApp/backend/recipes/getAllRecipes.php"
        );
        setRecipes(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <div className="home-container">
      <Navbar />
      <h1>Home Page</h1>
      <div className="cards-container">
        {recipes.map((recipe) => (
          <div key={recipe.recipe_id} className="card">
            <h2>{recipe.recipe_name}</h2>
            <p>Created by: {recipe.username}</p>
            <button onClick={() => handleSeeMore(recipe.recipe_id)}>
              See more
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
