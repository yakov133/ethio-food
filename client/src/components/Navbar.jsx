import React from "react";
import { Link } from "react-router-dom";
import { TiThMenu } from "react-icons/ti";
import style from "../App.module.css";
import Modal from "./Modal";
import { isAdminUser } from "../api";


function Navbar({userLogedIn,setuserLogedIn,modal,setModal,humburgerlinks,sethumburgerlinks}) {
  // Logout clears only auth state, leaving unrelated browser storage untouched.
  const signOut = () => {
    setuserLogedIn(false);
    sethumburgerlinks(false);
    localStorage.removeItem("auth");
  };

  return <div>
      {userLogedIn ? (
          <nav className={style.nav_user_loged_in}>
            <Link className={style.link_nav} to="/">
              בית     
            </Link>
            <Link className={style.link_nav} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link className={style.link_nav} to="/MyRecipe">
              המתכונים שלי 
            </Link>
            <Link className={style.link_nav} to="/NewRecipe">
              מתכון חדש
            </Link>
            {isAdminUser(userLogedIn)?
            <Link className={style.link_nav} to="/Admin">
            ניהול
          </Link>
            :
            ""}
            <Link className={style.link_nav} to="/About">
              אודות
            </Link>
            
            <button
              onClick={signOut}
              className={style.sign_out}
            >
              יציאה
            </button>
          </nav>
        ) : (
          <nav className={style.nav_no_user}>
            <Link className={style.link_nav} to="/">
              בית     
            </Link>
            <Link className={style.link_nav} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link className={style.link_nav} to="/About">
              אודות
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
              onClick={signOut}
              className={style.sign_out_btn_mobile}>
              יציאה
            </button>

            {/* The admin link is convenience only; server middleware still enforces access. */}
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
            {isAdminUser(userLogedIn)?
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/Admin">
            ניהול
          </Link>
            :
            ""}
            
          </nav>
        ) : (
          <nav className={style.nav_phone} >
           <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/">
              בית     
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/AllRecips">
              כל המתכונים     
            </Link>
            <Link onClick={()=>sethumburgerlinks(!humburgerlinks)} to="/About">
              אודות
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
