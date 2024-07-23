import React, { useEffect, useState } from "react";
import Navbar from "./../../components/navbar/navbar";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";
import SearchInput, { createFilter } from "react-search-input";

const KEYS_TO_FILTERS = ["recipe_name", "username"];

export default function Home() {
  const navigate = useNavigate();
  const [recipes, setRecipes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  const filteredRecipes = recipes.filter(
    createFilter(searchTerm, KEYS_TO_FILTERS)
  );

  return (
    <div className="home-container">
      <Navbar />
      <h1>Home Page</h1>
      <div className="search-container">
        <SearchInput
          className="search-input"
          onChange={(term) => setSearchTerm(term)}
          placeholder="Search recipes..."
        />
      </div>
      <div className="cards-container">
        {filteredRecipes.map((recipe) => (
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
