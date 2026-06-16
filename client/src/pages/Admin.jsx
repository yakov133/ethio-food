import React, { useEffect, useState } from "react";
import style from "./CSS/admin.module.css";
import { BsDisplay } from "react-icons/bs";
import { FcApproval } from "react-icons/fc";
import ClipLoader from "react-spinners/ClipLoader";
import { Redirect } from "react-router-dom";
import api, { getImageUrl, isAdminUser } from "../api";
import AdminRecipeDeleteButton from "../components/AdminRecipeDeleteButton";

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
      // Admin management needs both approved recipes and recipes waiting for approval.
      .get("/recipes?includePending=true")
      .then((res) => {
        setspinner(false);
        setrecipes(res.data);
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

  const removeDeletedRecipe = (recipeId) => {
    // Keep the admin table and preview modal aligned after a successful delete.
    setrecipes((currentRecipes) => currentRecipes.filter((recipe) => recipe.id !== recipeId));
    if (sneakpic && sneakpic.id === recipeId) {
      setsneakpic(null);
      setshowBtn(false);
    }
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
      <h1 className={style.preveiew}>ניהול מתכונים</h1>
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
              <th>סטטוס</th>
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
                <td>
                  {recip.adminApproval ? (
                    <span className={style.approvedText}>מאושר</span>
                  ) : (
                    <span className={style.pendingText}>ממתין לאישור</span>
                  )}
                </td>
                <td title="מחיקה">
                  <AdminRecipeDeleteButton
                    userLogedIn={userLogedIn}
                    recipeId={recip.id}
                    onDeleted={removeDeletedRecipe}
                  />
                </td>
                <td title="אישור">
                  {recip.adminApproval ? (
                    <span className={style.approvedText}>כבר אושר</span>
                  ) : (
                    <FcApproval
                      onClick={() => recipApprove(recip)}
                      className={style.icon}
                    />
                  )}
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
