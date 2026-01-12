import axios from "axios";
import React, { useEffect, useState } from "react";
import categorystyle from "./CSS/categories.module.css";
import style from "./CSS/details.module.css";
import ClipLoader from "react-spinners/ClipLoader";
import { useParams } from "react-router-dom";

const Details = ({ userLogedIn }) => {
  const { id } = useParams();
  const [recipe, setrecipe] = useState(false);
  const [newComment, setnewComment] = useState("");
  const [imgeFlag, setimgeFlag] = useState(false);
  const [readyToPresent, setreadyToPresent] = useState(false);


  useEffect(getRecipe, [id]);

  useEffect(() => {
    if (!imgeFlag && recipe.src) {
      getImage(recipe.src)
    }
  }, [recipe]);

  function getRecipe() {
    const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
    const URL = `${API_URL}/recipe/${id}`;  // הוסף את הכתובת המלאה

    axios
      .get(URL)
      .then((res) => {
        setrecipe(res.data);
        setimgeFlag(false);
      })
      .catch((err) => console.error(err));
  }
  // function getRecipe() {
  //   const recipeId = getDetails();
  //   const URL = `recipe/${recipeId}`;
  //   axios
  //     .get(URL)
  //     .then((res) => {
  //       setrecipe(res.data);
  //       setimgeFlag(false);
  //     })
  //     .catch((err) => console.error(err));
  // }


  const getImage = async (filename) => {
    const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";

    await axios
      .get(`${API_URL}/image/${filename}`, { responseType: "blob" })
      .then((res) => {
        if (res.status === 200) {
          const reader = new FileReader();
          reader.readAsDataURL(res.data);
          reader.onload = () => {
            const imgeDataURL = reader.result;
            let data = recipe;
            data.src = imgeDataURL;
            setimgeFlag(true)
            setrecipe(data);
            setreadyToPresent(true);
          };
        } else {
          console.log(`error status code: ${res.status}`);
        }
      })
      .catch((err) => console.error(err));
  };
  // const getImage = async (filename) => {
  //     await axios
  //       .get(`/image/${filename}`, { responseType: "blob" })
  //       .then((res) => {
  //         if (res.status === 200) {
  //           const reader = new FileReader();
  //           reader.readAsDataURL(res.data);
  //           reader.onload = () => {
  //             const imgeDataURL = reader.result;
  //             let data = recipe;
  //             data.src = imgeDataURL;
  //             setimgeFlag(true)
  //             setrecipe(data);
  //             setreadyToPresent(true);
  //           };
  //         } else {
  //           console.log(`error status code: ${res.status}`);
  //         }
  //       })
  //       .catch((err) => console.error(err));
  //   };


  const addNewComment = () => {
    let strNotEmpty = false;
    if (newComment) {
      for (let i = 0; i < newComment.length; i++) {
        if (newComment[i] !== " ") {
          strNotEmpty = true;
          break;
        }
      }
    }

    if (newComment && strNotEmpty) {
      const API_URL = process.env.REACT_APP_API_URL || "https://ethio-food-api.onrender.com";
      const URL = `${API_URL}/recipe/${id}`;
      const obj = {
        comments: newComment
      };

      axios
        .patch(URL, obj)
        .then((res) => {
          setimgeFlag(false);
          setreadyToPresent(false);
          setnewComment("");
          getRecipe();
        })
        .catch((err) => console.error(err));
    }
  };
  // const addNewComment = () => {
  //   let strNotEmpty = false;
  //   if (newComment) {
  //     for (let i = 0; i < newComment.length; i++) {
  //       if (newComment[i] !== " ") {
  //         strNotEmpty = true;
  //         break;
  //       }
  //     }
  //   }

  //   if (newComment && strNotEmpty) {
  //     const URL = `recipe/${recipe.id}`;
  //     const obj = {
  //       comments: newComment
  //     };
  //     axios
  //       .patch(URL, obj)
  //       .then((res) => {
  //         setimgeFlag(false);
  //         setreadyToPresent(false);
  //         setnewComment("");
  //         getRecipe();
  //       })
  //       .catch((err) => console.error(err));
  //   }
  // };


  return (
    readyToPresent ? <div className={categorystyle.info}>
      <h1 className={categorystyle.h1_style}>פרטים</h1>
      <div className={style.firstDiv}>
        <img className={style.img} src={recipe.src} alt={`${recipe.title} תמונה`} />
        <div>
          <section > מתכון: {recipe.title}</section>
          <section > נכתב על ידי: {recipe.name}</section>
          {recipe.mealTimes && recipe.mealTimes.length > 0 && (
            <section>
              מומלץ לאכילה: {recipe.mealTimes.join(", ")}
            </section>
          )}
        </div>
      </div>
      <main className={style.main}>
        <div className={style.secondDiv}>
          <details >
            <summary>מצרכים</summary>
            <p>{recipe.Ingredients}</p>
          </details>
        </div>
        <div className={style.therdDiv}>
          <details >
            <summary>הוראות הכנה</summary>
            <p>{recipe.Instructions}</p>
          </details>
        </div>
        <div className={style.fourthDiv}>
          <details >
            <summary>הערות</summary>
            <p>{recipe.Nots}</p>
          </details>
        </div>
      </main>
      <h2 className={style.h2}>5 התגובות האחרונות ביותר:</h2>
      <div className={style.comments}>
        {userLogedIn ? (
          <div className={style.userComments}>
            <button onClick={addNewComment}>הגב:</button>
            <input
              type="text"
              className={style.input}

              onChange={(e) => setnewComment(e.target.value)}
            />
          </div>
        ) : (
          ""
        )}

        <div className={style.p_comments}>
          {recipe
            ? recipe.comments.map((item, i) => <p key={i}>{item}</p>)
            : ""}
        </div>
      </div>
    </div>
      : <section className={style.spinner}><ClipLoader size={150} /></section>
  );
};

export default Details;
