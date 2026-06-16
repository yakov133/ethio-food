import style from "./CSS/about.module.css"
import appStyle from "../App.module.css";
import React from "react";
const About = () => {
  document.title = "About";
    return (
      <div className={appStyle.info }>
          {/* <p className={style.p_first}>אתר זה הוקם על מנת שנוכל לשתף בנינו מתכון של הקהילה האתיפית וכך לשמר את המאכלים.</p>
          <img className={style.img} src="https://i.ibb.co/fYbLXPQ/passport.jpg" alt="תמונת פרופיל"/>
          <p className={style.p_second}>אז תרגישו חופשי לעלות את המתכון שאתם אוהב ויודעים לעשות ושיהיה לכולנו בתאבון </p> */}
        
        <div className={style.hero_image}>
          <div>
          <p className={style.phoneSize}>אתר זה הוקם על מנת שנוכל לשתף בנינו מתכונים של הקהילה האתיופית, ובכדי לשמר את המאכלים המיוחדים</p>
          <p>וכך להשריש את המטבח העשיר של הקהילה בחברה הישראלית.</p>
          <p>אז תרגישו חופשי לשתף את המתכונים שאתם אוהבים, ויודעים להכין וכך לקחת ולשמר את המסורת הנפלאה והיפה של הקהילה. </p>
          <p>המטבח האתיופי הוא המטבח הנפוץ באתיופיה. מרכיביו העיקריים הם קטניות לסוגיהן, ירקות מאכל וירקות תבלין, ובשר ודגים (בהתאם לאזור). מטבח זה מבוסס על תבשילים וקדירות בבישול ארוך, מתובלים בנדיבות ולרוב חריפים. השימוש הנרחב בתבלינים מעניק למאכלים טעמים ארומטיים וקשת טעמים מגוונת.</p>
          
          </div>
          <div>
          <p>ובלי מילים מיותרות שיהיה לכם בתאבון!</p>
          <p>אופק סעדון ויעקב קסה</p> 
          <div className={style.images_container}>
              <img className={style.img} src="https://i.ibb.co/6R9FVNs5/profile.png" alt="אופק תמונת פרופיל"/>
              <img className={style.img} src="https://i.ibb.co/fYbLXPQ/passport.jpg" alt="תמונת פרופיל"/>
           </div>
          </div>
        </div>
      </div>
    );
  };
  export default About;
  
