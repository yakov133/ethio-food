import style from "./App.module.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Switch, Route} from "react-router-dom";
import Home from "./pages/Home";
import AllRecips from "./pages/AllRecips";
import PageNotFound from "./pages/PageNotFound";
import NewRecipe from "./pages/NewRecipe";
import MyRecipe from "./pages/MyRecipe";
import About from "./pages/About";
import Details from "./pages/Details";
import Categories from "./pages/Categories";
import Update from "./pages/Update";
import { Admin } from "./pages/Admin";
import { AiFillGithub } from "react-icons/ai";
import Navbar from "./components/Navbar";



function App() {
  const [userLogedIn, setuserLogedIn] = useState(false);
  const [modal, setModal] = useState(false);
  const [humburgerlinks, sethumburgerlinks] = useState(false);

  let category = ""
  const getCategory = ()=>category;
  const setCategory = (str)=>category=str;
  let details = "";
  const getDetails = ()=>details;
  const setDetails = (str)=>details=str;
  let recipUpdate = "";
  const getrecipUpdate = ()=>recipUpdate;
  const setrecipUpdate = (obj)=>recipUpdate=obj;

  useEffect(() => {
    if (localStorage.getItem("auth")) {
      setuserLogedIn(JSON.parse(localStorage.getItem("auth")));
    }
  }, []);
  
  return (
    <BrowserRouter>
      <div>

      <Navbar userLogedIn={userLogedIn} setuserLogedIn={setuserLogedIn} modal={modal} setModal={setModal} humburgerlinks={humburgerlinks} sethumburgerlinks={sethumburgerlinks}/>
      
      
        <Switch>
          <Route exact path="/" render={() => <Home setCategory={setCategory}/>} />
          <Route exact path="/AllRecips" render={() => <AllRecips />} />
          <Route exact path="/NewRecipe" render={() => <NewRecipe userLogedIn={userLogedIn} />} />
          <Route exact path="/MyRecipe" render={() => <MyRecipe userLogedIn={userLogedIn} setrecipUpdate={setrecipUpdate}/>} />
          <Route exact path="/About" render={() => <About />} />
          <Route exact path="/Details/:id" render={() => <Details userLogedIn={userLogedIn} />} />
          <Route exact path="/Categories/:category" render={() => <Categories />} />
          <Route exact path="/Update" render={() => <Update getrecipUpdate={getrecipUpdate}/>} />
          <Route exact path="/Admin" render={() => <Admin />} />

          <Route component={() => <PageNotFound />} />
        </Switch>
        <footer >&copy;  <a className={style.linkdin} href="https://www.linkedin.com/in/yakov-kassa-406636116/" target="_blank" rel="noopener noreferrer">yakov kassa</a> <a href="https://github.com/yakov133/ethiopian_food" target="_blank" rel="noopener noreferrer"><AiFillGithub  className={style.icons}/></a> </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;





























// {userLogedIn ? (
//   <nav className={style.nav_user_loged_in}>
//     <Link className={style.link_nav} to="/About">
//       אודות
//     </Link>
//     <Link className={style.link_nav} to="/NewRecipe">
//       מתכון חדש
//     </Link>
//     <Link className={style.link_nav} to="/MyRecipe">
//       המתכונים שלי 
//     </Link>
//     <Link className={style.link_nav} to="/AllRecips">
//       כל המתכונים     
//     </Link>
//     <Link className={style.link_nav} to="/">
//       בית     
//     </Link>
    
//     <button
//       onClick={() => {
//         setuserLogedIn(false);
//         localStorage.clear();
//         return <Redirect to="/" />
//       }}
//       className={style.sign_out}
//     >
//       <AiOutlinePoweroff />
//       {/* <AiOutlineLogout />  */}
//     </button>
//   </nav>
// ) : (
//   <nav className={style.nav_no_user}>
//    <Link className={style.link_nav} to="/About">
//       אודות
//     </Link>
//     <Link className={style.link_nav} to="/AllRecips">
//       כל המתכונים     
//     </Link>
//     <Link className={style.link_nav} to="/">
//       בית     
//     </Link>
//     <button onClick={() => setModal(true)} className={style.sign_out}>
//       <FaRegUser />
//     </button>
//   </nav>
// )}
// {modal ? (    
//     <Modal setuserLogedIn={setuserLogedIn} setModal={setModal} />
// ) : (
//   ""
// )}