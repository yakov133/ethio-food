import React, { useState } from "react";
import appStyle from "../App.module.css";
import style from "./CSS/newRecipe.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import { GrSend } from "react-icons/gr";
import ClipLoader from "react-spinners/ClipLoader";

const NewRecipe = ({ userLogedIn }) => {
  document.title = "New Recipe";
  
  // הגדרת ה-API URL פעם אחת
  const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
  
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [file, setfile] = useState("");
  const [category, setcategory] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [Nots, setNots] = useState("");
  const [mealTimes, setMealTimes] = useState([]); // מערך של זמני אכילה
  const [flag, setflag] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleMealTimeChange = (mealTime) => {
    setMealTimes(prev => {
      if (prev.includes(mealTime)) {
        return prev.filter(time => time !== mealTime);
      } else {
        return [...prev, mealTime];
      }
    });
  };

  const loadtoserver = (e) => {
    e.preventDefault();
    
    // בדיקה שצריך לבחור לפחות זמן אכילה אחד
    if (mealTimes.length === 0) {
      alert("אנא בחר לפחות זמן אכילה אחד");
      return;
    }
    
    setLoading(true);
    
    let formData = new FormData();
    formData.append("someFile", file);
    formData.append("title", title);
    formData.append("name", name);
    formData.append("category", category);
    formData.append("Ingredients", Ingredients);
    formData.append("Instructions", Instructions);
    formData.append("Nots", Nots);
    formData.append("mealTimes", JSON.stringify(mealTimes)); // שליחה כ-JSON string
    formData.append("localId", userLogedIn.localId);

    const URL = `${API_URL}/recipe`;
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(URL, formData, config)
      .then((res) => {
        console.log("Server response:", res.status, res.data);
        if (res.status === 200 || res.status === 201) {
          setflag(true);
          alert("המתכון נוסף בהצלחה!");
        } else {
          console.log(`Error status code: ${res.status}`);
          setLoading(false);
          alert("שגיאה בהוספת המתכון");
        }
      })
      .catch((err) => {
        console.error("Error uploading recipe:", err);
        setLoading(false);
        alert("שגיאה בהעלאת המתכון. אנא נסה שוב.");
      });
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
              value={title}
              onChange={(e) => settitle(e.target.value)}
              disabled={loading}
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
              disabled={loading}
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
              required
              checked={category === "Vegeterian"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Vegeterian">צמחוני</label>
            <br />

            <input
              type="radio"
              id="Vegan"
              value="Vegan"
              name="category"
              required
              checked={category === "Vegan"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Vegan">טבעוני</label>
            <br />

            <input
              type="radio"
              id="Milk"
              value="Milk"
              name="category"
              required
              checked={category === "Milk"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Milk">חלבי</label>
            <br />
            <input
              type="radio"
              id="Meat"
              value="Meat"
              name="category"
              required
              checked={category === "Meat"}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Meat">בשרי</label>
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
              disabled={loading}
            />
            <label htmlFor="morning">בוקר</label>
            <br />

            <input
              type="checkbox"
              id="lunch"
              value="צהריים"
              checked={mealTimes.includes("צהריים")}
              onChange={() => handleMealTimeChange("צהריים")}
              disabled={loading}
            />
            <label htmlFor="lunch">צהריים</label>
            <br />

            <input
              type="checkbox"
              id="dinner"
              value="ערב"
              checked={mealTimes.includes("ערב")}
              onChange={() => handleMealTimeChange("ערב")}
              disabled={loading}
            />
            <label htmlFor="dinner">ערב</label>
            <br />

            <input
              type="checkbox"
              id="snacks"
              value="נשנושים וקינוחים"
              checked={mealTimes.includes("נשנושים וקינוחים")}
              onChange={() => handleMealTimeChange("נשנושים וקינוחים")}
              disabled={loading}
            />
            <label htmlFor="snacks">נשנושים וקינוחים</label>
            <br />
          </div>
          <br />

          <div className={style.div}>
            <p>נא להעלות תמונה למתכון:</p>
            <input 
              type="file" 
              onChange={(e) => setfile(e.target.files[0])} 
              required
              disabled={loading}
              accept="image/*"
            />
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
              disabled={loading}
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
              disabled={loading}
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
              disabled={loading}
            ></textarea>
          </div>
          <br />

          <button 
            className={style.send} 
            type="submit" 
            title="לשלוח"
            disabled={loading}
          >
            {loading ? <ClipLoader size={20} color="#ffffff" /> : <GrSend />}
          </button>
        </form>
      </div>
      <br />
      <br />
    </div>
  );
};

export default NewRecipe;