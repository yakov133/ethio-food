import axios from "axios";
import style from "./CSS/Modal.module.css";
import { HashLoader } from "react-spinners";
import React, { useState } from "react";
import { IoLogInOutline } from "react-icons/io5";

const SignIn = ({ setuserLogedIn, setModal }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setmessage] = useState("");
  const [spinner, setspinner] = useState(false);

  const handelSubmit = (e) => {
    e.preventDefault();
    setmessage("");
    setspinner(true);

    const API_KEY = "AIzaSyDBeYMdSNAk0KglYfPOg6DygYyinxRfugo";
    const URL = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`;
    axios
      .post(URL, { email, password })
      .then((res) => {
        localStorage.setItem("auth", JSON.stringify(res.data));
        setuserLogedIn(res.data);
        setspinner(false);
        setModal(false);
      })
      .catch((err) => {
        e.target[0].value = "";
        e.target[1].value = "";
        let errMessage = err.response.data.error.message;
        errMessage = errMessage.replace("_", " ");
        setEmail("");
        setPassword("");    
        setmessage(errMessage);
        setspinner(false);
      });
  };

  return (
    <form onSubmit={handelSubmit} className={style.boder_main_singIn}>
      <h1>התחברות</h1>
      <label htmlFor="email">אי-מייל:</label>
      <br />
      <input
        type="email"
        id="email"
        dir="ltr"
        placeholder="נא להקליד מייל"
        onChange={(e) => setEmail(e.target.value)}
        autoComplete="on"
      />
      <br />
      <br />
      <label htmlFor="password">סיסמא:</label>
      <br />
      <input
        type="password"
        id="password"
        placeholder="נא להקליד סיסמא"
        onChange={(e) => setPassword(e.target.value)}
        autoComplete="on"
      />
      <br />
      <br />
      {!spinner ? <button type="submit"> <IoLogInOutline /> </button> : <p className={style.spiner}><HashLoader color="red"/></p>}
      <br />
      <p className={style.err}> {message} </p>
      <br />
    </form>
  );
};

export default SignIn;
