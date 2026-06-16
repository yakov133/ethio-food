import React, { useEffect, useState } from "react";
import categorystyle from "./CSS/categories.module.css";
import style from "./CSS/newRecipe.module.css";
import { Redirect, useParams } from "react-router-dom";
import appStyle from "../App.module.css";
import { GrSend } from "react-icons/gr";
import ClipLoader from "react-spinners/ClipLoader";
import api, { getImageUrl } from "../api";

const Update = ({ userLogedIn }) => {
  document.title = "Update Recipe";

  const { id } = useParams();
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [imgSrc, setsrc] = useState("");
  const [category, setcategory] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [Nots, setNots] = useState("");
  const [mealTimes, setMealTimes] = useState([]);
  const [flag, setflag] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Loading by route id makes the update page survive refreshes and direct links.
  useEffect(() => {
    if (!userLogedIn) {
      setLoading(false);
      return;
    }

    api
      .get(`/recipe/${id}`)
      .then((res) => {
        const obj = res.data;
        settitle(obj.title || "");
        setname(obj.name || "");
        setsrc(obj.src || "");
        setcategory(obj.category || "");
        setIngredients(obj.Ingredients || "");
        setInstructions(obj.Instructions || "");
        setNots(obj.Nots || "");
        setMealTimes(obj.mealTimes || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading recipe:", err);
        setLoading(false);
      });
  }, [id, userLogedIn]);

  const handleMealTimeChange = (mealTime) => {
    setMealTimes((prev) => {
      if (prev.includes(mealTime)) {
        return prev.filter((time) => time !== mealTime);
      }

      return [...prev, mealTime];
    });
  };

  const loadtoserver = (e) => {
    e.preventDefault();

    if (mealTimes.length === 0) {
      alert("אנא בחר לפחות זמן אכילה אחד");
      return;
    }

    if (window.confirm("יש לאשר את העדכון")) {
      setSaving(true);

      // Only editable fields are sent; the server ignores ownership from the client.
      const updateData = {
        title,
        name,
        category,
        Ingredients,
        Instructions,
        Nots,
        mealTimes,
      };

      api
        .patch(`/recipe/${id}`, updateData)
        .then((res) => {
          if (res.status === 200) {
            setflag(true);
          }
        })
        .catch((err) => {
          console.error("Error updating recipe:", err);
          setSaving(false);
          alert("שגיאה בעדכון המתכון. אנא נסה שוב.");
        });
    }
  };

  if (flag) {
    return <Redirect to="/MyRecipe" />;
  }

  if (!userLogedIn) {
    return <Redirect to="/" />;
  }

  if (loading) {
    return <section className={style.spinner}><ClipLoader size={150} /></section>;
  }

  return (
    <div className={appStyle.info}>
      <div className={style.fromRap}>
        <form className={style.form} onSubmit={loadtoserver} dir="rtl">
          <h1 className={categorystyle.h1_style}>עדכון מתכון</h1>

          {imgSrc && (
            <div>
              <img
                className={style.updateImg}
                src={getImageUrl(imgSrc)}
                alt={`${title} תמונה של`}
              />
            </div>
          )}

          <div>
            <label htmlFor="title">שם המאכל:</label>
            <br />
            <input
              type="text"
              id="title"
              required
              value={title}
              onChange={(e) => settitle(e.target.value)}
              disabled={saving}
            />
          </div>

          <div>
            <label htmlFor="name">מקור:</label>
            <br />
            <input
              type="text"
              id="name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
              disabled={saving}
            />
          </div>
          <br />

          <div>
            <p>יש לבחור קטגוריה מתאימה למתכון:</p>
            <input
              type="radio"
              id="Vegeterian"
              value="Vegeterian"
              name="category"
              checked={category === "Vegeterian"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={saving}
            />
            <label htmlFor="Vegeterian">צמחוני:</label>
            <br />

            <input
              type="radio"
              id="Vegan"
              value="Vegan"
              name="category"
              checked={category === "Vegan"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={saving}
            />
            <label htmlFor="Vegan">טבעוני:</label>
            <br />

            <input
              type="radio"
              id="Milk"
              value="Milk"
              name="category"
              checked={category === "Milk"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={saving}
            />
            <label htmlFor="Milk">חלבי:</label>
            <br />

            <input
              type="radio"
              id="Meat"
              value="Meat"
              name="category"
              checked={category === "Meat"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={saving}
            />
            <label htmlFor="Meat">בשרי:</label>
            <br />
          </div>
          <br />

          <div>
            <p>מתי מומלץ לאכול את המתכון? (ניתן לבחור כמה אפשרויות):</p>
            <input
              type="checkbox"
              id="morning"
              value="בוקר"
              checked={mealTimes.includes("בוקר")}
              onChange={() => handleMealTimeChange("בוקר")}
              disabled={saving}
            />
            <label htmlFor="morning">בוקר</label>
            <br />

            <input
              type="checkbox"
              id="lunch"
              value="צהריים"
              checked={mealTimes.includes("צהריים")}
              onChange={() => handleMealTimeChange("צהריים")}
              disabled={saving}
            />
            <label htmlFor="lunch">צהריים</label>
            <br />

            <input
              type="checkbox"
              id="dinner"
              value="ערב"
              checked={mealTimes.includes("ערב")}
              onChange={() => handleMealTimeChange("ערב")}
              disabled={saving}
            />
            <label htmlFor="dinner">ערב</label>
            <br />

            <input
              type="checkbox"
              id="snacks"
              value="נשנושים וקינוחים"
              checked={mealTimes.includes("נשנושים וקינוחים")}
              onChange={() => handleMealTimeChange("נשנושים וקינוחים")}
              disabled={saving}
            />
            <label htmlFor="snacks">נשנושים וקינוחים</label>
            <br />
          </div>
          <br />

          <div>
            <label htmlFor="Ingredients">מצרכים:</label>
            <br />
            <textarea
              name="Ingredients"
              id="Ingredients"
              cols="60"
              rows="10"
              required
              value={Ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              disabled={saving}
            ></textarea>
          </div>
          <br />

          <div>
            <label htmlFor="Instructions">הוראות הכנה:</label>
            <br />
            <textarea
              name="Instructions"
              id="Instructions"
              cols="60"
              rows="10"
              required
              value={Instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={saving}
            ></textarea>
          </div>
          <br />

          <div>
            <label htmlFor="Nots">הערות:</label>
            <br />
            <textarea
              name="Nots"
              id="Nots"
              cols="60"
              rows="10"
              value={Nots}
              onChange={(e) => setNots(e.target.value)}
              disabled={saving}
            ></textarea>
          </div>
          <br />

          <button
            className={style.send}
            type="submit"
            title="לשלוח"
            disabled={saving}
          >
            {saving ? <ClipLoader size={20} /> : <GrSend />}
          </button>
        </form>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Update;
