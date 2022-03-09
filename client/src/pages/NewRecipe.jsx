import React,  { useState } from "react";
import appStyle from "../App.module.css";
import style from "./CSS/newRecipe.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { GrSend } from "react-icons/gr";

const NewRecipe = ({ userLogedIn }) => {
  document.title = "New Recipe";
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [file, setfile] = useState("");
  const [category, setcategory] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [Nots, setNots] = useState("");
  const [flag, setflag] = useState(false);

  const loadtoserver = (e) => {
    e.preventDefault();
    let formData = new FormData();
    formData.append("someFile", file);
    formData.append("title", title);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("Ingredients", Ingredients);
    formData.append("Instructions", Instructions);
    formData.append("Nots", Nots);
    formData.append("localId", userLogedIn.localId);

    const URL = "/recipe";
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(URL, formData, config)
      .then((res) => {
        if (res.status === 201) {
          setflag(true);
        } else {
          console.log(`error status code ${res.status}`);
        }
      })
      .catch((err) => console.error(err));
  };

  if (flag) {
    return <Redirect to="/AllRecips" />;
  }

  return (
    <div className={appStyle.info}>
      <div className={style.fromRap}>
        <form className={style.form} onSubmit={loadtoserver} dir="rtl">
          <div>
            <label htmlFor="title">שם המאכל:</label>
            <br />
            <input
              type="text"
              id="title"
              required
              onChange={(e) => settitle(e.target.value)}
            />
          </div>

          <div>
            <label htmlFor="name">מקור:</label>
            <br />
            <input
              type="text"
              id="name"
              required
              onChange={(e) => setname(e.target.value)}
            />
          </div>
          <br />
          <div >
            <p>יש לבחור קטגוריה מתאימה למתכון:</p>
            <input
              type="radio"
              id="Vegeterian"
              value="Vegeterian"
              name="category"
              required
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Vegeterian">צמחוני:</label>
            <br />

            <input
              type="radio"
              id="Vegan"
              value="Vegan"
              name="category"
              required
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Vegan">טבעוני:</label>
            <br />

            <input
              type="radio"
              id="Milk"
              value="Milk"
              name="category"
              required
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Milk">חלבי:</label>
            <br />
            <input
              type="radio"
              id="Meat"
              value="Meat"
              name="category"
              required
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Meat">בשרי:</label>
            <br />
          </div>

          <div className={style.div}>
            <p>:נא להעלות תמונה למתכון</p>
            <input type="file" onChange={(e) => setfile(e.target.files[0])} required/>
          </div>
          <br />

          <div>
            <label htmlFor="Ingredients">מצרכים:</label>
            <br />
            <textarea
              name=""
              id="ה"
              cols="60"
              rows="10"
              required
              onChange={(e) => setIngredients(e.target.value)}
            ></textarea>
          </div>
          <br />

          <div>
            <label htmlFor="Instructions">הוראות הכנה:</label>
            <br />
            <textarea
              name=""
              id="Instructions"
              cols="60"
              rows="10"
              required
              onChange={(e) => setInstructions(e.target.value)}
            ></textarea>
          </div>
          <br />

          <div required>
            <label htmlFor="Nots">הערות:</label>
            <br />
            <textarea
              name=""
              id="Nots"
              cols="60"
              rows="10"
              onChange={(e) => setNots(e.target.value)}
            ></textarea>
          </div>
          <br />

          <button className={style.send} type="submit" title="לשלוח">
            <GrSend />
          </button>
        </form>
      </div>
      <br />
      <br />
    </div>
  );
};
export default NewRecipe;
