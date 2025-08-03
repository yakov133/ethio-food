import React, { useState } from "react";
import { Redirect, useHistory } from "react-router-dom";
import style from "./CSS/home.module.css";
import appStyle from "../App.module.css";

const Home = ({ setCategory }) => {
  const [flag, setflag] = useState(false);
  const history = useHistory();
  document.title = "Home";

  if (flag) {
    return <Redirect to="/Categories" />;
  }

  return (
    <div className={appStyle.info}>
      
      <main>
        <section className={style.slide}>
          <article className={style.card}>
            <img src="https://media.istockphoto.com/photos/ethiopian-meal-with-injera-picture-id1266172610?b=1&k=20&m=1266172610&s=170667a&w=0&h=0uy8vf3WCxQDlxHClbRbZirqigrzz2UGLxaLbgFVqWM=" 
            alt="ethyopian food"/>
          </article>

          <article className={style.card}>
            <img
              src="https://media.istockphoto.com/photos/injera-and-toppings-picture-id1014317248?b=1&k=20&m=1014317248&s=170667a&w=0&h=d8t5df97lod8bcj1yo9cjUYQpFRdW-kjv8iiQiZynWE="
              alt="tibs3 meat"
            />
          </article>

          <article className={style.card}>
            <img
              src="https://media.istockphoto.com/photos/traditional-ethiopian-coffee-pot-picture-id603255020?k=20&m=603255020&s=612x612&w=0&h=-yHcSuC35lROdeONkjl6JtI6ak29wse_sanWKRfkbnI="
              alt="tibs4 meat"
            />
          </article>

          <article className={style.card}>
            <img
              src="https://media.istockphoto.com/photos/injera-dish-made-of-teff-cereal-debre-birhanethiopia-0013-picture-id506912094?b=1&k=20&m=506912094&s=170667a&w=0&h=-xmIs_d6_zHmtKrt3yoOpfKCRPB4HUqMS6NJEjNnONE="
              alt="tibs2meat"
            />
          </article>

          <article className={style.card}>
            <img
              src="https://media.istockphoto.com/photos/ethiopian-injera-picture-id492133042?k=20&m=492133042&s=612x612&w=0&h=GpBveRSLtokPTnjbtgqTdsUKDkSDx0Xn8LFyvZ7GeN8="
              alt="tibs meat"
            />
          </article>
        </section>
      </main>
      <div className={style.top_categories}>
        <div
          className={style.card_option}
          onClick={() => {
            history.push("/Categories/Meat");
          }}
        >
          <img
          title="לדף הקטגוריות"
            src="https://cdn.pixabay.com/photo/2016/10/17/14/31/background-1747777_1280.jpg"
            alt="meat"
          />
          <p className={style.p_category}>בשרי</p>
        </div>

        <div
          className={style.card_option}
          onClick={() => {
            history.push("/Categories/Milk");
          }}
        >
          <img
          title="לדף הקטגוריות"
            src="https://cdn.pixabay.com/photo/2016/10/17/14/31/background-1747777_1280.jpg"
            alt="milk"
          />
          <p className={style.p_category}> חלבי</p>
        </div>

        <div
          className={style.card_option}
          onClick={() => {
            history.push("/Categories/Vegan");
          }}
        >
          <img
          title="לדף הקטגוריות"
            src="https://cdn.pixabay.com/photo/2016/10/17/14/31/background-1747777_1280.jpg"
            alt="vegan"
          />
          <p className={style.p_category}>טבעוני</p>
        </div>

        <div
          className={style.card_option}
          onClick={() => {
            history.push("/Categories/Vegeterian");
          }}
        >
          <img
          title="לדף הקטגוריות"
            src="https://cdn.pixabay.com/photo/2016/10/17/14/31/background-1747777_1280.jpg"
            alt="vegeterian"
          />
          <p className={style.p_category}>צמחוני</p>
        </div>
      </div>
    </div>
  );
};

export default Home;
