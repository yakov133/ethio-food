import React,  { useState } from "react";
import SignIn from "./SignIn";
import SignUp from "./SingUP";
import style from "./CSS/Modal.module.css";
import { IoCloseCircle } from "react-icons/io5";

const Modal = ({ setuserLogedIn, setModal }) => {
  const [changOperation, setchangOperation] = useState(true);

  return (
    <div className={style.main_modal}>
      <div className={style.sun}>
        <p onClick={() => setModal(false)} className={style.close_btn}>
          <IoCloseCircle />
        </p>
        {changOperation ? (
          <SignUp setuserLogedIn={setuserLogedIn} setModal={setModal} />
        ) : (
          <SignIn setuserLogedIn={setuserLogedIn} setModal={setModal} />
        )}
        {!changOperation ? (
          <p
            dir="ltr"
            className={style.p_link}
            onClick={() => setchangOperation(!changOperation)}
          >
            ? צריך להירשם
          </p>
        ) : (
          <p
            dir="ltr"
            className={style.p_link}
            onClick={() => setchangOperation(!changOperation)}
          >
            ? כבר רשום לאתר{" "}
          </p>
        )}
      </div>
    </div>
  );
};
export default Modal;
