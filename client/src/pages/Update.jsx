import React, {useEffect, useState } from "react";
import categorystyle from "./CSS/categories.module.css";
import style from "./CSS/newRecipe.module.css";
import axios from "axios";
import { Redirect } from "react-router-dom";

import appStyle from "../App.module.css";
import { GrSend } from "react-icons/gr";



const Update = ({getrecipUpdate}) => {
  document.title = "My Recipe";
  const [id, setid] = useState("");
  const [title, settitle] = useState("");
  const [name, setname] = useState("");
  const [imgSrc, setsrc] = useState("");
  const [category, setcategory] = useState("");
  const [Ingredients, setIngredients] = useState("");
  const [Instructions, setInstructions] = useState("");
  const [Nots, setNots] = useState("");
  const [flag, setflag] = useState(false);
  
useEffect(()=>{
  let obj = getrecipUpdate();
  setid(obj.id);
  settitle(obj.title);
  setname(obj.name);
  setsrc(obj.src);
  setcategory(obj.category);
  setIngredients(obj.Ingredients);
  setInstructions(obj.Instructions);
  setNots(obj.Nots);
},[])

  const loadtoserver = (e) => {
    e.preventDefault(); 
    if (window.confirm("יש לאשר את העדכון")) {
      console.log("need to update");
      const URL = `/recipe/${id}`
      axios.patch(URL,{title,name,category,Ingredients,Instructions,Nots})
      .then((res)=>{
        
        if(res.status === 200){
          console.log("ok,recipe changed");
          setflag(true);
        }
      })
      .catch(err=>{console.log(err)})
    }else{
      console.log("don't want to be added");
    }
    
  }
  if (flag){
    return <Redirect to={"/MyRecipe"} />
  }
    return (
      <div className={appStyle.info}>
      <div className={style.fromRap}>
        <form className={style.form}  onSubmit={loadtoserver} dir="rtl">
        <h1 className={categorystyle.h1_style} >עדכון מתכון</h1>
        {imgSrc && <div>
          <img className={style.updateImg} src={imgSrc} alt={`${title} תמונה של`} />
        </div>}
          <div>
            <label htmlFor="title">שם המאכל:</label>
            <br />
            <input
              type="text"
              id="title"
              required
              defaultValue={title}
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
              defaultValue={name}
              onChange={(e) => setname(e.target.value)}
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
              checked={category==='Vegeterian'?true:""}
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Vegeterian">צמחוני:</label>
            <br />
            <input
              type="radio"
              id="Vegan"
              value="Vegan"
              name="category"
              checked={category==='Vegan'?true:""}
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Vegan">טבעוני:</label>
            <br />
            <input
              type="radio"
              id="Milk"
              value="Milk"
              name="category"
              checked={category==='Milk'?true:""}
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Milk">חלבי:</label>
            <br />
            <input
              type="radio"
              id="Meat"
              value="Meat"
              name="category"
              checked={category==='Meat'?true:""}
              onChange={(e) => setcategory(e.target.value)}
            />
            <label htmlFor="Meat">בשרי:</label>
            <br />
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
              defaultValue={Ingredients}
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
              defaultValue={Instructions}
              onChange={(e) => setInstructions(e.target.value)}
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
              onBlur={(e) => { 
                console.log(e.target.value);
                setNots(e.target.value)}}
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
  export default Update;
  