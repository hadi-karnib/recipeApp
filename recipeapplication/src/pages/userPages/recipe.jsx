import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Navbar from "./../../components/navbar/navbar";
import "./recipe.css";
import "./../../components/navbar/navbar.css";
import jsPDF from "jspdf";
import StarModal from "./starModal";
import { toast, ToastContainer } from "react-toastify";

export default function Recipe() {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [showModal, setShowModal] = useState(false);

  const fetchComments = async () => {
    const recipe_id = id;
    try {
      const response = await axios.post(
        "http://localhost/recipe/recipeApp/backend/recipes/getRecipeComments.php",
        { recipe_id }
      );
      setComments(response.data);
      console.log("comments", response.data);
    } catch (error) {
      console.error("Error fetching comments:", error);
    }
  };

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

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    try {
      const userString = localStorage.getItem("user");
      if (userString && userString.length > 0) {
        const user = JSON.parse(userString);
        const response = await axios.post(
          "http://localhost/recipe/recipeApp/backend/recipes/addComment.php",
          {
            recipe_id: id,
            user_id: user.id,
            content: newComment,
          }
        );
        setNewComment("");
        fetchComments();
      } else {
        console.log("No user data found in local storage.");
      }
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  const handleSaveRating = async (rating) => {
    try {
      const userString = localStorage.getItem("user");
      if (userString && userString.length > 0) {
        const user = JSON.parse(userString);
        const response = await axios.post(
          "http://localhost/recipe/recipeApp/backend/recipes/addRating.php",
          {
            recipe_id: id,
            user_id: user.id,
            rating: rating,
          }
        );
        console.log("Rating saved:", response.data);
        toast.success("Rating submitted", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "colored",
        });
      } else {
        console.log("No user data found in local storage.");
      }
    } catch (error) {
      console.error("Failed to save rating:", error);

      toast.error("Failed to save rating: " + error.message, {
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

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.post(
          "http://localhost/recipe/recipeApp/backend/recipes/getRecipeDetails.php",
          { id }
        );
        setRecipe(response.data);
        fetchComments();
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
    <div className="mainDiv">
      <Navbar />
      <ToastContainer />
      <div className="content-container">
        <div className="recipe-container-custom">
          <h1 className="recipe-title-custom">{recipe.recipe_name}</h1>
          <p className="recipe-author-custom">Created by: {recipe.username}</p>
          <h2 className="recipe-section-title-custom">Ingredients</h2>
          <ul className="recipe-list-custom">
            {JSON.parse(recipe.ingredients).map((ingredient, index) => (
              <li key={index} className="recipe-list-item-custom">
                • {ingredient}
              </li>
            ))}
          </ul>
          <h2 className="recipe-section-title-custom">Steps</h2>
          <ol className="recipe-steps-custom">
            {JSON.parse(recipe.steps).map((step, index) => (
              <li key={index} className="recipe-step-item-custom">
                {index + 1}. {step}
              </li>
            ))}
          </ol>
          <button className="download-button-custom" onClick={downloadPdf}>
            Download as PDF
          </button>
        </div>
        <div className="comments-container">
          <h2>Comments</h2>
          {comments &&
            comments.map((comment, index) => (
              <div key={index} className="comment">
                <p className="comment-author">
                  {comment.username}: {comment.content}
                </p>
              </div>
            ))}
          <div className="add-comment">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment"
            ></textarea>
            <div className="buttons">
              <button onClick={handleCommentSubmit}>Submit Comment</button>
              <button
                className="rating-button"
                onClick={() => setShowModal(true)}
              >
                Rate this Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
      <StarModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSaveRating}
      />
    </div>
  );
}
