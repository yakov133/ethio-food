import axios from "axios";
import React, { useEffect, useState } from "react";
import style from "./CSS/admin.module.css";
import { BsDisplay, BsTrash } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import ClipLoader from "react-spinners/ClipLoader";

export const Admin = () => {
  // הגדרת ה-API URL פעם אחת
  const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
  
  const [recipes, setrecipes] = useState([]);
  const [imageFlag, setimageFlag] = useState(false);
  const [sneakpic, setsneakpic] = useState(null);
  const [showBtn, setshowBtn] = useState(false);
  const [spinner, setspinner] = useState(true);
  
  useEffect(getRecpies, []);

  useEffect(() => {
    if (!imageFlag && recipes.length > 0) {
      let temp = [...recipes];
      for (let i = 0; i < temp.length; i++) {
        getImage(temp, temp[i].src, i);
      }
    }
  }, [recipes, imageFlag]);

  function getRecpies() {
    const URL = `${API_URL}/recipes`;
    axios
      .get(URL)
      .then((res) => {
        let temp = res.data;
        temp = temp.filter((recip) => !recip.adminApproval);
        setspinner(false);
        setrecipes(temp);
      })
      .catch((err) => {
        console.error("Error fetching recipes:", err);
        setspinner(false);
      });
  }

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
            setrecipes(data);
          }
        };
      } else {
        console.log(`Error status code: ${res.status}`);
      }
    } catch (err) {
      console.error("Error fetching image:", err);
    }
  };

  const show = (recip) => {
    setsneakpic(recip);
    setshowBtn(true);
  };

  const deleteNewRecip = (recip) => {
    if (window.confirm("נא לאשר מחיקה!")) {
      deltefromDB(recip.id);
    } else {
      console.log("Deletion cancelled");
    }
  };

  const deltefromDB = (id) => {
    const URL = `${API_URL}/recipe/${id}`;
    axios
      .delete(URL)
      .then((res) => {
        if (res.status === 200) {
          setspinner(true);
          getRecpies();
          setimageFlag(false);
          setsneakpic(null);
          setshowBtn(false);
        }
      })
      .catch((err) => {
        console.log("Error deleting recipe:", err);
        alert("שגיאה במחיקת המתכון");
      });
  };

  const recipApprove = (recip) => {
    if (window.confirm("בטוח שאתה מאשר?")) {
      const URL = `${API_URL}/recipeApprove/${recip.id}`;
      axios
        .patch(URL)
        .then((res) => {
          if (res.status === 200) {
            setspinner(true);
            getRecpies();
            setimageFlag(false);
            setsneakpic(null);
            setshowBtn(false);
            alert("המתכון אושר בהצלחה!");
          } else {
            console.log("Something went wrong");
          }
        })
        .catch((err) => {
          console.log("Error approving recipe:", err);
          alert("שגיאה באישור המתכון");
        });
    }
  };

  return (
    <div className={style.space}>
      <h1 className={style.preveiew}>ניהול של מתכונים חדשים</h1>
      <br />
      
      {showBtn && sneakpic && (
        <div className={style.modal}>
          <section 
            className={style.closeBtn}
            onClick={() => setshowBtn(false)}
          >
            X
          </section>
          <p>כותרת: {sneakpic.title}</p>
          <p className={style.detailsPreveiew}>קטגוריה: {sneakpic.category}</p>

          <details>
            <summary>מצרכים:</summary>
            <p className={style.detailsPreveiew}>{sneakpic.Ingredients}</p>
          </details>
          <br />

          <details>
            <summary>הוראות הכנה:</summary>
            <p className={style.detailsPreveiew}>{sneakpic.Instructions}</p>
          </details>
          <br />
          
          <details>
            <summary>הערות:</summary>
            <p className={style.detailsPreveiew}>{sneakpic.Nots || "אין הערות"}</p>
          </details>
          <br />
          
          {sneakpic.src && (
            <img 
              className={style.sneakPicImg} 
              src={sneakpic.src} 
              alt={sneakpic.title} 
            />
          )}
        </div>
      )}
      
      {spinner ? (
        <section className={style.spinner}>
          <ClipLoader size={150} />
        </section>
      ) : recipes.length ? (
        <table>
          <thead>
            <tr>
              <th>תמונה</th>
              <th>פרטים</th>
              <th>הסרה של המתכון</th>
              <th>אישור של המתכון</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recip, i) => (
              <tr key={recip.id || i}>
                <td>
                  {recip.src && (
                    <img 
                      src={recip.src} 
                      alt={recip.title} 
                    />
                  )}
                </td>
                <td title="הצצה">
                  <BsDisplay 
                    onClick={() => show(recip)} 
                    className={style.icon} 
                  />
                </td>
                <td title="מחיקה">
                  <BsTrash 
                    onClick={() => deleteNewRecip(recip)} 
                    className={style.icon} 
                  />
                </td>
                <td title="אישור">
                  <FcApproval 
                    onClick={() => recipApprove(recip)} 
                    className={style.icon} 
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className={style.noRecipes}>* אין מתכונים חדשים</p>
      )}
    </div>
  );
};