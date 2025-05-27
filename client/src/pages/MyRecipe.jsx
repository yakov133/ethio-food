import axios from "axios";
import React, { useEffect, useState } from "react";
import appStyle from "../App.module.css";
import style from "./CSS/allRecips.module.css";
import { FaRegTrashAlt } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { Redirect } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

const MyRecipe = ({ userLogedIn, setrecipUpdate }) => {
  document.title = "My Recipe";
  
  // הגדרת ה-API URL פעם אחת
  const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
  
  const [recipes, setrecipes] = useState([]);
  const [imageFlag, setimageFlag] = useState(false);
  const [flag, setflag] = useState(false);
  const [spinner, setspinner] = useState(true);

  useEffect(getUsersRecipes, []);

  useEffect(() => {
    if (!imageFlag && recipes.length > 0) {
      let temp = [...recipes];
      for (let i = 0; i < temp.length; i++) {
        getImage(temp, temp[i].src, i);
      }
    }
  }, [recipes, imageFlag]);

  function getUsersRecipes() {
    const URL = `${API_URL}/recipe/user/${userLogedIn.localId}`;
    axios
      .get(URL)
      .then((res) => {
        setspinner(false);
        setrecipes(res.data);
      })
      .catch((err) => {
        console.log("Error fetching user recipes:", err);
        setspinner(false);
      });
  }

  const getImage = async (temp, newFileName, i) => {
    try {
      const URL = `${API_URL}/image/${newFileName}`;
      const res = await axios.get(URL, { responseType: "blob" });
      
      if (res.status === 200) {
        const reader = new FileReader();
        reader.readAsDataURL(res.data);
        reader.onload = () => {
          const imgeDataURL = reader.result;
          temp[i].src = imgeDataURL;
          if (i + 1 === temp.length) {
            setimageFlag(true);
            setrecipes(temp);
          }
        };
      } else {
        console.log(`Error status code: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };
  
  function myFunction(id) {
    if (window.confirm("נא לאשר מחיקה!")) {
      console.log(`Deleting recipe with id: ${id}`);
      deltefromDB(id);
    } else {
      console.log("Deletion cancelled");
    }
  }

  const deltefromDB = (id) => {
    const URL = `${API_URL}/recipe/${id}`;
    axios
      .delete(URL)
      .then((res) => {
        if (res.status === 200) {
          getUsersRecipes();
          setimageFlag(false);
        }
      })
      .catch((err) => console.log("Error deleting recipe:", err));
  };

  if (flag) {
    return <Redirect to="/Update" />;
  }
  
  return (
    <div className={appStyle.info}>
      {spinner ? (
        <section className={style.spinner}>
          <ClipLoader size={150} />
        </section>
      ) : (
        <div className={style.order}>
          {recipes.length !== 0 &&
            recipes.map((recip, i) => (
              <div key={i}>
                <div className={style.center_all}>
                  <p>
                    {recip.title} מאת {recip.name}
                  </p>
                  <br />
                  <img
                    src={recip.src && recip.src.includes("data") ? recip.src : ""}
                    alt={`${recip.title} תמונה`}
                  />
                </div>
                <div className={style.my_rcepsis}>
                  <button
                    onClick={() => {
                      setrecipUpdate(recip);
                      setflag(true);
                    }}
                    className={style.btnIcon1}
                  >
                    <FiEdit title="עדכון" className={style.icon_size} />
                  </button>
                  <button
                    onClick={() => {
                      myFunction(recip.id);
                    }}
                    className={style.btnIcon2}
                  >
                    <FaRegTrashAlt title="מחיקה" className={style.icon_size} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      )}
      {recipes.length === 0 && !spinner && (
        <p className={style.noRecipes}>* לא הועלו מתכונים... </p>
      )}
    </div>
  );
};

export default MyRecipe;