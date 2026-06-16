import React, { useCallback, useEffect, useState } from "react";
import categorystyle from "./CSS/categories.module.css";
import style from "./CSS/details.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useHistory, useParams } from "react-router-dom";
import api, { getImageUrl, isAdminUser } from "../api";
import AdminRecipeDeleteButton from "../components/AdminRecipeDeleteButton";

const Details = ({ userLogedIn }) => {
  const { id } = useParams();
  const history = useHistory();
  const [recipe, setrecipe] = useState(null);
  const [newComment, setnewComment] = useState("");
  const [loading, setLoading] = useState(true);

  // Reload through the API so private/pending recipes still respect server rules.
  const getRecipe = useCallback(() => {
    setLoading(true);

    api
      .get(`/recipe/${id}`)
      .then((res) => {
        setrecipe(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setrecipe(null);
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    getRecipe();
  }, [getRecipe]);

  const addNewComment = () => {
    const comment = newComment.trim();
    if (!comment) {
      return;
    }

    // Comments are saved through PATCH so the server can cap the list atomically.
    api
      .patch(`/recipe/${id}`, { comments: comment })
      .then(() => {
        setnewComment("");
        getRecipe();
      })
      .catch((err) => console.error(err));
  };

  const handleAdminDelete = () => {
    // After an admin deletes the current recipe there is no details page to display.
    history.push("/AllRecips");
  };

  if (loading) {
    return <section className={style.spinner}><ClipLoader size={150} /></section>;
  }

  if (!recipe) {
    return <p className={style.spinner}>המתכון לא נמצא</p>;
  }

  return (
    <div className={categorystyle.info}>
      <h1 className={categorystyle.h1_style}>פרטים</h1>
      {isAdminUser(userLogedIn) && !recipe.adminApproval && (
        <p className={style.pendingBadge}>ממתין לאישור</p>
      )}
      <div className={style.adminActions}>
        <AdminRecipeDeleteButton
          userLogedIn={userLogedIn}
          recipeId={recipe.id}
          onDeleted={handleAdminDelete}
        />
      </div>
      <div className={style.firstDiv}>
        <img className={style.img} src={getImageUrl(recipe.src)} alt={`${recipe.title} תמונה`} />
        <div>
          <section> מתכון: {recipe.title}</section>
          <section> נכתב על ידי: {recipe.name}</section>
          {recipe.mealTimes && recipe.mealTimes.length > 0 && (
            <section>
              מומלץ לאכילה: {recipe.mealTimes.join(", ")}
            </section>
          )}
        </div>
      </div>
      <main className={style.main}>
        <div className={style.secondDiv}>
          <details>
            <summary>מצרכים</summary>
            <p>{recipe.Ingredients}</p>
          </details>
        </div>
        <div className={style.therdDiv}>
          <details>
            <summary>הוראות הכנה</summary>
            <p>{recipe.Instructions}</p>
          </details>
        </div>
        <div className={style.fourthDiv}>
          <details>
            <summary>הערות</summary>
            <p>{recipe.Nots}</p>
          </details>
        </div>
      </main>
      <h2 className={style.h2}>5 התגובות האחרונות ביותר:</h2>
      <div className={style.comments}>
        {userLogedIn ? (
          <div className={style.userComments}>
            <button onClick={addNewComment}>הגב:</button>
            <input
              type="text"
              className={style.input}
              value={newComment}
              onChange={(e) => setnewComment(e.target.value)}
            />
          </div>
        ) : (
          ""
        )}

        <div className={style.p_comments}>
          {Array.isArray(recipe.comments)
            ? recipe.comments.map((item, i) => <p key={i}>{item}</p>)
            : ""}
        </div>
      </div>
    </div>
  );
};

export default Details;
