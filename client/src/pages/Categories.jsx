import React, { useEffect, useState } from "react";
import style from "./CSS/categories.module.css";
import axios from "axios";
import { MdReadMore } from "react-icons/md";
import { Redirect } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const Categories = ({ getCategory, setCategory, setDetails }) => {
  // הגדרת ה-API URL פעם אחת בראש הקומפוננטה
  const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
  
  const [recipes, setRecipse] = useState([]);
  const [imageFlag, setimageFlag] = useState(false);
  const [flag, setflag] = useState(false);
  const [spinner, setspinner] = useState(true);

  let h1_category;
  if (getCategory() === "Milk") {
    h1_category = "חלבי";
  } else if (getCategory() === "Meat") {
    h1_category = "בשרי";
  } else if (getCategory() === "Vegan") {
    h1_category = "טבעוני";
  } else {
    h1_category = "צמחוני";
  }

  useEffect(() => {
    const URL = `${API_URL}/categories/${getCategory()}`;
    
    axios
      .get(URL)
      .then((res) => {
        let temp = res.data;
        temp = temp.filter((recip) => recip.adminApproval);
        setspinner(false);
        setRecipse(temp);
      })
      .catch((err) => {
        console.log("Error fetching categories:", err);
        setspinner(false);
      });
  }, [getCategory]);

  useEffect(() => {
    if (!imageFlag && recipes.length > 0) {
      let temp = [...recipes];
      for (let i = 0; i < temp.length; i++) {
        getImage(temp, temp[i].src, i);
      }
    }
  }, [recipes, imageFlag]);

  const getImage = async (data, filename, i) => {
    try {
      const res = await axios.get(`${API_URL}/image/${filename}`, { 
        responseType: "blob" 
      });
      
      if (res.status === 200) {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          const imgeDataURL = reader.result;
          data[i].src = imgeDataURL;
          if (i + 1 === data.length) {
            setimageFlag(true);
            setRecipse(data);
          }
        };
      } else {
        console.log(`Error status code: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  if (flag) {
    return <Redirect to="/Details" />;
  }

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
                src={recip.src && recip.src.includes("data") ? recip.src : ""}
                alt={`${recip.title} תמונה`}
              />
              <p>
                <MdReadMore
                  title="למתכון"
                  className={style.icon}
                  onClick={() => {
                    setDetails(recip.id);
                    setflag(true);
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