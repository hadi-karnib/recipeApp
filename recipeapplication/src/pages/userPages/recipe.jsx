// Recipe.js
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./../../components/navbar/navbar";
import "./recipe.css";
import jsPDF from "jspdf";
export default function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const downloadPdf = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxLineWidth = pageWidth - margin * 2;
    const lineHeight = 10;
    let y = 20;

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(24);
    doc.text(recipe.recipe_name, margin, y);
    y += 10;

    doc.setFont("Helvetica", "normal");
    doc.setFontSize(16);
    doc.text(`Created by: ${recipe.username}`, margin, y);
    y += 20;

    doc.setFontSize(18);
    doc.setTextColor("#007bff");
    doc.text("Ingredients", margin, y);
    y += 10;
    doc.setTextColor("#000000");
    const ingredients = JSON.parse(recipe.ingredients);
    ingredients.forEach((ingredient, index) => {
      const lines = doc.splitTextToSize(`- ${ingredient}`, maxLineWidth);
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    });

    doc.setFontSize(18);
    doc.setTextColor("#007bff");
    doc.text("Steps", margin, y);
    y += 10;
    doc.setTextColor("#000000");
    const steps = JSON.parse(recipe.steps);
    steps.forEach((step, index) => {
      const lines = doc.splitTextToSize(`${index + 1}. ${step}`, maxLineWidth);
      lines.forEach((line) => {
        if (y + lineHeight > pageHeight - margin) {
          doc.addPage();
          y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
      });
    });

    doc.save(`${recipe.recipe_name}.pdf`);
  };
  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.post(
          "http://localhost/recipe/recipeApp/backend/recipes/getRecipeDetails.php",
          { id }
        );
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
      }
    };

    fetchRecipe();
  }, [id]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div className="recipe-container">
      <Navbar />
      <h1>{recipe.recipe_name}</h1>
      <p>Created by: {recipe.username}</p>
      <h2>Ingredients</h2>
      <ul>
        {JSON.parse(recipe.ingredients).map((ingredient, index) => (
          <li key={index}>{ingredient}</li>
        ))}
      </ul>
      <h2>Steps</h2>
      <ol>
        {JSON.parse(recipe.steps).map((step, index) => (
          <li key={index}>{step}</li>
        ))}
      </ol>
      <button className="download-button" onClick={downloadPdf}>
        Download as PDF
      </button>
    </div>
  );
}
