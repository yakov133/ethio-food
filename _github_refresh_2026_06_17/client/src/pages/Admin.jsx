import React, { useEffect, useState } from "react";
import style from "./CSS/admin.module.css";
import { BsDisplay, BsTrash } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import ClipLoader from "react-spinners/ClipLoader";
import { Redirect } from "react-router-dom";
import api, { getImageUrl, isAdminUser } from "../api";

export const Admin = ({ userLogedIn }) => {
  const [recipes, setrecipes] = useState([]);
  const [sneakpic, setsneakpic] = useState(null);
  const [showBtn, setshowBtn] = useState(false);
  const [spinner, setspinner] = useState(true);

  // Admin data is fetched only after the local user passes the admin check.
  useEffect(() => {
    if (isAdminUser(userLogedIn)) {
      getRecpies();
    }
  }, [userLogedIn]);

  function getRecpies() {
    api
      // The server honors includePending only for verified admin users.
      .get("/recipes?includePending=true")
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
    api
      .delete(`/recipe/${id}`)
      .then((res) => {
        if (res.status === 200) {
          setspinner(true);
          getRecpies();
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
      api
        .patch(`/recipeApprove/${recip.id}`)
        .then((res) => {
          if (res.status === 200) {
            setspinner(true);
            getRecpies();
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

  if (!userLogedIn || !isAdminUser(userLogedIn)) {
    return <Redirect to="/" />;
  }

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
              src={getImageUrl(sneakpic.src)}
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
                      src={getImageUrl(recip.src)}
                      alt={recip.title}
                      loading="lazy"
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
