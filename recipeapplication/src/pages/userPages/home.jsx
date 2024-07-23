import React, { useEffect, useState } from "react";
import Navbar from "./../../components/navbar/navbar";
import axios from "axios";
import "./home.css";
import { useNavigate } from "react-router-dom";
import SearchInput, { createFilter } from "react-search-input";
import { gsap } from "gsap";

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

        gsap.fromTo(
          ".card",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.8, stagger: 0.2, ease: "power2.out" }
        );
      } catch (error) {
        console.error("Error fetching recipes:", error);
      }
    };

    fetchRecipes();
  }, []);

  useEffect(() => {
    const input = document.querySelector(".search-input");

    if (input) {
      gsap
        .fromTo(
          input,
          { scale: 1 },
          {
            scale: 1.05,
            duration: 0.5,
            ease: "power1.inOut",
            repeat: -1,
            yoyo: true,
            onUpdate: function () {
              input.style.boxShadow = `0 0 ${10 * this.progress()}px lightgrey`;
            },
          }
        )
        .play();

      input.addEventListener("focus", () => {
        gsap.to(input, {
          scale: 1.1,
          boxShadow: "0 0 20px lightgrey",
          duration: 0.3,
        });
      });

      input.addEventListener("blur", () => {
        gsap.to(input, {
          scale: 1,
          boxShadow: "0 0 10px lightgrey",
          duration: 0.3,
        });
      });
    }
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
