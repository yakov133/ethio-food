import React, { useState } from "react";
import { FaRegTrashAlt } from "react-icons/fa";
import api, { isAdminUser } from "../api";
import style from "./CSS/AdminRecipeDeleteButton.module.css";

const AdminRecipeDeleteButton = ({ userLogedIn, recipeId, onDeleted, className = "" }) => {
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isAdminUser(userLogedIn) || !recipeId) {
    return null;
  }

  const handleDelete = () => {
    if (!window.confirm("נא לאשר מחיקה!")) {
      return;
    }

    setIsDeleting(true);
    // The server still verifies admin permission before deleting the recipe.
    api
      .delete(`/recipe/${recipeId}`)
      .then(() => {
        if (onDeleted) {
          onDeleted(recipeId);
        }
      })
      .catch((err) => {
        console.error("Error deleting recipe:", err);
        alert("שגיאה במחיקת המתכון");
      })
      .finally(() => setIsDeleting(false));
  };

  return (
    <button
      type="button"
      className={`${style.button} ${className}`.trim()}
      onClick={handleDelete}
      disabled={isDeleting}
      title="מחיקת מתכון"
      aria-label="מחיקת מתכון"
    >
      <FaRegTrashAlt className={style.icon} />
    </button>
  );
};

export default AdminRecipeDeleteButton;
