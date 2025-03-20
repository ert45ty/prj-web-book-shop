import React from "react";

const StarRating = ({ value, onChange, readOnly = false, size = "medium" }) => {
  const stars = [1, 2, 3, 4, 5];

  const starSize = size === "small" ? "fs-6" : "fs-4";

  const handleClick = (rating) => {
    if (!readOnly && onChange) {
      onChange(rating);
    }
  };

  return (
    <div className="ec-pro-rating">
      {stars.map((star) => (
        <i
          key={star}
          className={` ${
            star <= value ? "ecicon eci-star fill" : "ecicon eci-star"
          } ${starSize} ${readOnly ? "" : "cursor-pointer"}`}
          style={{
            color: star <= value ? "#ffc107" : "#e4e5e9",
            marginRight: "5px",
          }}
          onClick={() => handleClick(star)}
        ></i>
      ))}
    </div>
  );
};

export default StarRating;
