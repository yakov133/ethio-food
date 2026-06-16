import React, { useCallback, useEffect, useState } from "react";
import appStyle from "../App.module.css";
import style from "./CSS/allRecips.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { Redirect, useHistory } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import api, { getImageUrl } from "../api";

const MyRecipe = ({ userLogedIn }) => {
  document.title = "My Recipe";
  const [recipes, setrecipes] = useState([]);
  const [spinner, setspinner] = useState(true);
  const history = useHistory();

  // The server verifies this localId against the Firebase token on every request.
  const getUsersRecipes = useCallback(() => {
    if (!userLogedIn) {
      setspinner(false);
      return;
    }

    api
      .get(`/recipe/user/${userLogedIn.localId}`)
      .then((res) => {
        setspinner(false);
        setrecipes(res.data);
      })
      .catch((err) => {
        console.log("Error fetching user recipes:", err);
        setspinner(false);
      });
  }, [userLogedIn]);

  useEffect(() => {
    getUsersRecipes();
  }, [getUsersRecipes]);
  
  function myFunction(id) {
    if (window.confirm("נא לאשר מחיקה!")) {
      console.log(`Deleting recipe with id: ${id}`);
      deltefromDB(id);
    } else {
      console.log("Deletion cancelled");
    }
  }

  const deltefromDB = (id) => {
    // Deletes are authenticated by the API layer and authorized on the server.
    api
      .delete(`/recipe/${id}`)
      .then((res) => {
        if (res.status === 200) {
          getUsersRecipes();
        }
      })
      .catch((err) => console.log("Error deleting recipe:", err));
  };

  if (!userLogedIn) {
    return <Redirect to="/" />;
  }
  
  return (
    <div className={appStyle.info}>
      {spinner ? (
        <section className={style.spinner}>
          <ClipLoader size={150} />
        </section>
      ) : (
        <div className={style.order}>
          {recipes.length !== 0 &&
            recipes.map((recip, i) => (
              <div key={i}>
                <div className={style.center_all}>
                  <p>
                    {recip.title} מאת {recip.name}
                  </p>
                  <br />
                  <img
                    src={getImageUrl(recip.src)}
                    alt={`${recip.title} תמונה`}
                    loading="lazy"
                  />
	                </div>
	                <div className={style.my_rcepsis}>
	                  <button
	                    onClick={() => {
	                      history.push(`/Update/${recip.id}`);
	                    }}
	                    className={style.btnIcon1}
	                  >
                    <FiEdit title="עדכון" className={style.icon_size} />
                  </button>
                  <button
                    onClick={() => {
                      myFunction(recip.id);
                    }}
                    className={style.btnIcon2}
                  >
                    <FaRegTrashAlt title="מחיקה" className={style.icon_size} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      {recipes.length === 0 && !spinner && (
        <p className={style.noRecipes}>* לא הועלו מתכונים... </p>
      )}
    </div>
  );
};

export default MyRecipe;
