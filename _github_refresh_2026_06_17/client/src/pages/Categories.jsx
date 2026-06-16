import React, { useEffect, useState } from "react";
import style from "./CSS/categories.module.css";
import { MdReadMore } from "react-icons/md";
import { useHistory, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import api, { getImageUrl } from "../api";

const Categories = () => {
  const [recipes, setRecipse] = useState([]);
  const [spinner, setspinner] = useState(true);
  const history = useHistory();
  const { category } = useParams();

  let h1_category;
  if (category === "Milk") {
    h1_category = "חלבי";
  } else if (category === "Meat") {
    h1_category = "בשרי";
  } else if (category === "Vegan") {
    h1_category = "טבעוני";
  } else {
    h1_category = "צמחוני";
  }

  useEffect(() => {
    setspinner(true);
    // Category pages use the server filter so pending recipes stay hidden.
    api
      .get(`/categories/${category}`)
      .then((res) => {
        setspinner(false);
        setRecipse(res.data);
      })
      .catch((err) => {
        console.log("Error fetching categories:", err);
        setspinner(false);
      });
  }, [category]);

  return (
    <div className={style.info}>
      <h1 className={style.h1_style}>קטגורית {h1_category}</h1>
      {spinner ? (
        <section className={style.spinner}>
          <ClipLoader size={150} />
        </section>
      ) : (
        <div className={style.order}>
          {recipes.map((recip) => (
            <div key={recip.id} className={style.card_option}>
              <p>
                {recip.title} מאת: {recip.name}
              </p>
              <br />
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
          ))}
        </div>
      )}
      {recipes.length === 0 && !spinner && (
        <p className={style.noRecipes}>{`* אין מתכונים זמינים כרגע בקטגורית ${h1_category} `}</p>
      )}
    </div>
  );
};

export default Categories;
