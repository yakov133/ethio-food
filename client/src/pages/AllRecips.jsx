import React, { useEffect, useState } from "react";
import style from "./CSS/allRecips.module.css";
import { MdReadMore } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import mainVideo from "../videos/Tibs.mp4"
import api, { getImageUrl, isAdminUser } from "../api";
import AdminRecipeDeleteButton from "../components/AdminRecipeDeleteButton";

const AllRecips = ({ userLogedIn }) => {
  document.title = "All Recips";
  const [recipes, setrecipes] = useState([]);
  const [search, setsearch] = useState(false);
  const history = useHistory();

  useEffect(() => {
    getRecpies();
  }, [userLogedIn]);

  function getRecpies() {
    const adminQuery = isAdminUser(userLogedIn) ? "?includePending=true" : "";
    // Admins can review/delete all recipes; public users still receive only approved recipes.
    api
      .get(`/recipes${adminQuery}`)
      .then((res) => {
        setrecipes(res.data);
      })
      .catch((err) => console.error(err));
  }

  const removeDeletedRecipe = (recipeId) => {
    // Keep both the full list and active search results in sync after admin deletion.
    setrecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeId));
    setsearch((currentSearch) => (
      Array.isArray(currentSearch)
        ? currentSearch.filter((recipe) => recipe.id !== recipeId)
        : currentSearch
    ));
  };

  const handelSearch = (e) => {
    const searchValue = e.target.value.trim().toLowerCase();
    if (searchValue) {
      // Search locally over the loaded approved recipes to avoid extra API calls.
      const tempRecipes = recipes.filter((recipe) => (
        [recipe.title, recipe.name, recipe.Ingredients, recipe.Instructions, recipe.Nots]
          .some((value) => (value || "").toLowerCase().includes(searchValue))
      ));

      if (tempRecipes.length > 0) {
        if (tempRecipes.length > 10) {
          setsearch(tempRecipes.slice(0, 10));
        } else {
          setsearch(tempRecipes);
        }
      } else {
        setsearch(true);
      }
    } else {
      setsearch(false);
    }
  };

  const renderRecipeCard = (recip, i) => (
    <div key={recip.id || i}>
      <div className={style.center_all}>
        <p>
          {recip.title} מאת {recip.name}
        </p>
        {isAdminUser(userLogedIn) && !recip.adminApproval && (
          <p className={style.pendingBadge}>ממתין לאישור</p>
        )}
        <br />
        <img
          src={getImageUrl(recip.src)}
          alt={`${recip.title} תמונה`}
          loading="lazy"
        />
        <div className={style.actions}>
          <MdReadMore
            title="למתכון"
            className={style.icon}
            onClick={() => {
              history.push(`/Details/${recip.id}`);
            }}
          />
          <AdminRecipeDeleteButton
            userLogedIn={userLogedIn}
            recipeId={recip.id}
            onDeleted={removeDeletedRecipe}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div>
      <div className={style.info}>
        
        <div className={style.searchBar}>
          <BsSearch className={style.searchIcon} />
          <input
            placeholder="חיפוש אחר מתכון "
            type="search"
            className={style.searchInput}
            onChange={handelSearch}
          />
        </div>
        
      <video className={style.iframe} src={mainVideo} autoPlay loop muted />

        <div className={style.order}>
          {!search &&
            recipes.map(renderRecipeCard)}
          {search ? Array.isArray(search) ? (
            search.map(renderRecipeCard)
          ) : (
            <span> לא נמצאו תוצאות</span>
          ) : []}
        </div>
      </div>
    </div>
  );
};

export default AllRecips;
