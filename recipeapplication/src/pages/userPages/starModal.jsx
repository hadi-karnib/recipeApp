import React, { useState } from "react";
import ReactStars from "react-rating-stars-component";
import "./starModal.css";

const StarModal = ({ show, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0);

  const handleRatingChange = (newRating) => {
    setRating(newRating);
  };

  const handleSubmit = () => {
    onSubmit(rating);
    onClose();
  };

  if (!show) {
    return null;
  }

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Rate this Recipe</h2>
        <div className="stars">
          <ReactStars
            count={5}
            onChange={handleRatingChange}
            size={50}
            activeColor="#ffd700"
            value={rating}
          />
        </div>
        <button onClick={handleSubmit}>Submit Rating</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default StarModal;
