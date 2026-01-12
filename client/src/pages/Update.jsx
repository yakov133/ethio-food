import React, { useEffect, useState } from "react";
import categorystyle from "./CSS/categories.module.css";
import style from "./CSS/newRecipe.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";
import appStyle from "../App.module.css";
import { GrSend } from "react-icons/gr";
import ClipLoader from "react-spinners/ClipLoader";

const Update = ({ getrecipUpdate }) => {
  document.title = "Update Recipe";
  
  // הגדרת ה-API URL פעם אחת
  const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
  
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [imgSrc, setsrc] = useState("");
  const [category, setcategory] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [Nots, setNots] = useState("");
  const [mealTimes, setMealTimes] = useState([]); // מערך של זמני אכילה
  const [flag, setflag] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    let obj = getrecipUpdate();
    if (obj) {
      setid(obj.id);
      settitle(obj.title);
      setname(obj.name);
      setsrc(obj.src);
      setcategory(obj.category);
      setIngredients(obj.Ingredients);
      setInstructions(obj.Instructions);
      setNots(obj.Nots || "");
      setMealTimes(obj.mealTimes || []); // טעינת זמני אכילה קיימים
    }
  }, [getrecipUpdate]);

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
    
    if (window.confirm("יש לאשר את העדכון")) {
      setLoading(true);
      console.log("Updating recipe...");
      
      const URL = `${API_URL}/recipe/${id}`;
      const updateData = {
        title,
        name,
        category,
        Ingredients,
        Instructions,
        Nots,
        mealTimes // הוספת זמני אכילה לעדכון
      };
      
      axios
        .patch(URL, updateData)
        .then((res) => {
          if (res.status === 200) {
            console.log("Recipe updated successfully");
            setflag(true);
          }
        })
        .catch((err) => {
          console.error("Error updating recipe:", err);
          setLoading(false);
          alert("שגיאה בעדכון המתכון. אנא נסה שוב.");
        });
    } else {
      console.log("Update cancelled");
    }
  };

  if (flag) {
    return <Redirect to="/MyRecipe" />;
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
                src={imgSrc} 
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
              defaultValue={title}
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
              defaultValue={name}
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
              checked={category === 'Vegeterian'}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Vegeterian">צמחוני:</label>
            <br />
            
            <input
              type="radio"
              id="Vegan"
              value="Vegan"
              name="category"
              checked={category === 'Vegan'}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Vegan">טבעוני:</label>
            <br />
            
            <input
              type="radio"
              id="Milk"
              value="Milk"
              name="category"
              checked={category === 'Milk'}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
            />
            <label htmlFor="Milk">חלבי:</label>
            <br />
            
            <input
              type="radio"
              id="Meat"
              value="Meat"
              name="category"
              checked={category === 'Meat'}
              onChange={(e) => setcategory(e.target.value)}
              disabled={loading}
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

          <div>
            <label htmlFor="Ingredients">מצרכים:</label>
            <br />
            <textarea
              name=""
              id="Ingredients"
              cols="60"
              rows="10"
              required
              defaultValue={Ingredients}
              onChange={(e) => setIngredients(e.target.value)}
              disabled={loading}
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
              defaultValue={Instructions}
              onChange={(e) => setInstructions(e.target.value)}
              disabled={loading}
            ></textarea>
          </div>
          <br />

          <div>
            <label htmlFor="Nots">הערות:</label>
            <br />
            <textarea
              name=""
              id="Nots"
              cols="60"
              rows="10"
              defaultValue={Nots}
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
            {loading ? <ClipLoader size={20} /> : <GrSend />}
          </button>
        </form>
      </div>
      <br />
      <br />
    </div>
  );
};

export default Update;