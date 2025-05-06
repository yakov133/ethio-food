import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./CSS/allRecips.module.css";
import { MdReadMore } from "react-icons/md";
import { Redirect } from "react-router-dom";
import { BsSearch } from "react-icons/bs";
import mainVideo from "../videos/Tibs.mp4"

const AllRecips = ({ setDetails }) => {
  document.title = "All Recips";
  const [recipes, setrecipes] = useState([]);
  const [imageFlag, setimageFlag] = useState(false);
  const [search, setsearch] = useState(false);
  const [flag, setflag] = useState(false);

  // בדיקה שמשתנה הסביבה נטען כראוי
  useEffect(() => {
    console.log("API URL:", process.env.REACT_APP_API_URL);
  }, []);

  useEffect(getRecpies, []);

  useEffect(() => {
    if (!imageFlag) {
      let temp = [...recipes];
      // temp = temp.filter(recip => recip.adminApproval);
      for (let i = 0; i < temp.length; i++) {
        getImage(temp, temp[i].src, i);
      }
    }
  }, [recipes]);

  function getRecpies() {
    // שימוש במשתנה סביבה או בכתובת קבועה אם אין משתנה
    const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
    const URL = `${API_URL}/recipes`;
    
    axios
      .get(URL)
      .then((res) => {
        let temp = res.data;
        temp = temp.filter(recip => recip.adminApproval);
        setrecipes(temp);
      })
      .catch((err) => console.error(err));
  }

  const getImage = async (data, filename, i) => {
    try {
      // שימוש במשתנה סביבה גם בפונקציית התמונות
      const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
      const URL = `${API_URL}/image/${filename}`;
      
      const res = await axios.get(URL, { responseType: "blob" });
      
      if (res.status === 200) {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          const imgeDataURL = reader.result;
          data[i].src = imgeDataURL;
          if (i + 1 === data.length) {
            setimageFlag(true);
            setTimeout(() => setrecipes(data), 1000);
          }
        };
      } else {
        console.log(`error status code: ${res.status}`);
      }
    } catch (error) {
      console.error("Error fetching image:", error);
    }
  };

  const handelSearch = (e) => {
    if (e.target.value !== "" && e.target.value !== " ") {
      let tempRecipes = [];
      for (let i = 0; i < recipes.length; i++) {
        if (
          recipes[i].title.includes(e.target.value) ||
          recipes[i].name.includes(e.target.value) ||
          recipes[i].Ingredients.includes(e.target.value) ||
          recipes[i].Instructions.includes(e.target.value) ||
          recipes[i].Nots.includes(e.target.value)
        ) {
          tempRecipes.push(recipes[i]);
        }
      }
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

  if (flag) {
    return <Redirect to="/Details" />;
  }

  return (
    <div>
      <video className={style.iframe} src={mainVideo} autoPlay loop muted />
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
                    src={recip.src.includes("data") ? recip.src : ""}
                    alt={`${recip.title} תמונה`}
                  />
                  <p>
                    <MdReadMore
                      className={style.icon}
                      onClick={() => {
                        setDetails(recip.id);
                        setflag(true);
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
                    src={recip.src.includes("data") ? recip.src : ""}
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