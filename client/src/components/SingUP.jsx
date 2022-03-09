import axios from "axios";
import React, { useState } from "react";
import style from "./CSS/Modal.module.css";
import { HashLoader } from "react-spinners";
import { IoLogInOutline } from "react-icons/io5";


const SignUp = ({ setuserLogedIn, setModal }) => {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [message, setmessage] = useState("");
  const [spinner, setspinner] = useState(false);

  const handelSubmit = (e) => {
    e.preventDefault();
    setspinner(true);
    setmessage("");
    const API_KEY = "AIzaSyDBeYMdSNAk0KglYfPOg6DygYyinxRfugo";
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${API_KEY}`;
    if (password1 === password2) {
      axios
        .post(URL, { email, password: password1 })
        .then((res) => {
          localStorage.setItem("auth", JSON.stringify(res.data));
          setuserLogedIn(res.data);
          setspinner(false);
          setModal(false);
        })
        .catch((err) => {
          let errMessage = err.response.data.error.message;
          errMessage = errMessage.replace("_", " ");
          setEmail("");
          setPassword1("");
          setPassword2("");
          setmessage(errMessage);
          setspinner(false);
        });
    } else {
      setTimeout(() => {
        setmessage("Password Does Not Match!");
        setEmail("");
        setPassword1("");
        setPassword2("");
        e.target[0].value = "";
        e.target[1].value = "";
        e.target[2].value = "";
        setspinner(false);
      }, 1500);
    }
  };

  return (
    <form onSubmit={handelSubmit} className={style.boder_main}>
      <h1>הרשמה מחדש</h1>
      <label htmlFor="email">אי-מייל:</label>
      <br />
      <input
        type="email"
        id="email"
        dir="ltr"
        placeholder="נא להקליד מייל"
        onChange={(e) => setEmail(e.target.value)}
      />
      <br />
      <br />
      <label htmlFor="password1">סיסמא:</label>
      <br />
      <input
        type="password"
        id="password1"
        placeholder="נא להקליד סיסמא"
        onChange={(e) => setPassword1(e.target.value)}
        autoComplete="on"
      />
      <br />
      <label htmlFor="password2">וידוי סיסמא:</label>
      <br />
      <input
        type="password"
        id="password2"
        placeholder="נא להקליד סיסמא"
        onChange={(e) => setPassword2(e.target.value)}
        autoComplete="on"
      />
      <br />
      <br />
      {!spinner ? <button type="submit"> <IoLogInOutline /> </button> : <p className={style.spiner}><HashLoader color="red"/></p>}
      <br />
      <p className={style.err}>{message}</p>
      <br />
    </form>
  );
};
export default SignUp;
