import React from "react";
import { Link } from "react-router-dom";
import style from "./CSS/pageNotFound.module.css";

const PageNotFound = () => {
  document.title = "העמוד לא נמצא";
  return (
    <main className={style.wrapper} dir="rtl">
      <section className={style.content}>
        <p className={style.code}>404</p>
        <h1>העמוד לא נמצא</h1>
        <p className={style.message}>הכתובת שהוזנה לא קיימת באתר. אפשר לחזור למסך הבית או לעבור לכל המתכונים.</p>
        {/* These links keep users inside the React app instead of leaving them on a blank error state. */}
        <div className={style.actions}>
          <Link className={style.primaryLink} to="/">חזרה לדף הבית</Link>
          <Link className={style.secondaryLink} to="/AllRecips">כל המתכונים</Link>
        </div>
      </section>
    </main>
  );
};

export default PageNotFound;
