import React from "react";
import { Link } from "react-router-dom";
// import { AiFillGithub } from "react-icons/ai";
import { FaRegUser } from "react-icons/fa";
import { AiOutlinePoweroff } from "react-icons/ai";
import { Redirect } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import style from "../App.module.css";
import Modal from "./Modal";


function Navbar({userLogedIn,setuserLogedIn,modal,setModal,humburgerlinks,sethumburgerlinks}) {

  return <div>
      {userLogedIn ? (
          <nav className={style.nav_user_loged_in}>
            <Link className={style.link_nav} to="/About">
              אודות
            </Link>
            {(userLogedIn.email === "yakov133@walla.com"||userLogedIn.email === "ofekavi1104@gmail.com")?
            <Link className={style.link_nav} to="/Admin">
            ניהול
          </Link>
            :
            ""}

            <Link className={style.link_nav} to="/NewRecipe">
              מתכון חדש
            </Link>

            <Link className={style.link_nav} to="/MyRecipe">
              המתכונים שלי 
            </Link>
            
            <Link className={style.link_nav} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link className={style.link_nav} to="/">
              בית     
            </Link>
            
            <button
              onClick={() => {
                setuserLogedIn(false);
                localStorage.clear();
                return <Redirect to="/" />
              }}
              className={style.sign_out}
            >
              יציאה
            </button>
          </nav>
        ) : (
          <nav className={style.nav_no_user}>
           <Link className={style.link_nav} to="/About">
              אודות
            </Link>
            <Link className={style.link_nav} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link className={style.link_nav} to="/">
              בית     
            </Link>
            <button onClick={() => setModal(true)} className={style.sign_out}>
              התחברות/הרשמה
            </button>
          </nav>
        )}
        {modal ? (    
            <Modal setuserLogedIn={setuserLogedIn} setModal={setModal} />
        ) : (
          ""
        )}
      
      <div className={!humburgerlinks?style.humburger1:style.humburger2}>
       
       <button className={!humburgerlinks?style.btn_1:style.btn_2} onClick={()=>sethumburgerlinks(!humburgerlinks)}><TiThMenu /></button>

       <div className={humburgerlinks?style.humburger_links:style.humburger_links_hidde}>
       {userLogedIn ? (
          <nav className={style.nav_phone} >
            <button
              onClick={() => {
                setuserLogedIn(false);
                localStorage.clear();
                return <Redirect to="/" />
            }}
            className={style.sign_out_btn_mobile}>
              יציאה
            </button>

            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/">
              בית     
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/MyRecipe">
              המתכונים שלי 
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/NewRecipe">
              מתכון חדש
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/About">
              אודות
            </Link>
            {(userLogedIn.email === "yakov133@walla.com"||userLogedIn.email === "ofekavi1104@gmail.com")?
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/Admin">
            ניהול
          </Link>
            :
            ""}
            
          </nav>
        ) : (
          <nav className={style.nav_phone} >
           <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/About">
              אודות
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/">
              בית     
            </Link>
            <button onClick={() => setModal(true)} className={style.sign_in_btn_mobile}>
              התחברות/הרשמה
            </button>
          </nav>
        )}
       </div>

     </div>
     


      
  </div>;
}

export default Navbar;
