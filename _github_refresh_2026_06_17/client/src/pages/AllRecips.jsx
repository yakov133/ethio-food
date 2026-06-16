import React, { useEffect, useState } from "react";
import style from "./CSS/allRecips.module.css";
import { MdReadMore } from "react-icons/md";
import { useHistory } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import mainVideo from "../videos/Tibs.mp4"
import api, { getImageUrl } from "../api";

const AllRecips = () => {
  document.title = "All Recips";
  const [recipes, setrecipes] = useState([]);
  const [search, setsearch] = useState(false);
  const history = useHistory();

  useEffect(getRecpies, []);

  function getRecpies() {
    // The server already filters unapproved recipes for public requests.
    api
      .get("/recipes")
      .then((res) => {
        setrecipes(res.data);
      })
      .catch((err) => console.error(err));
  }

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
                  <p>
                    <MdReadMore
                      className={style.icon}
                      onClick={() => {
                        history.push(`/Details/${recip.id}`);
                      }}
                    />
                  </p>
                </div>
              </div>
            ))}
          {search ? Array.isArray(search) ? (
            search.map((recip, i) => (
              <div key={i}>
                <div className={style.center_all}>
                  <p>
                    {recip.title} מאת {recip.name}
                  </p>
                  <img
                    src={getImageUrl(recip.src)}
                    alt={`${recip.title} תמונה`}
                    loading="lazy"
                  />
                  <p>
                    <MdReadMore
                      title="למתכון"
                      className={style.icon}
                      onClick={() => {
                        history.push(`/Details/${recip.id}`);
                      }}
                    />
                  </p>
                </div>
              </div>
            ))
          ) : (
            <span> לא נמצאו תוצאות</span>
          ) : []}
        </div>
      </div>
    </div>
  );
};

export default AllRecips;
