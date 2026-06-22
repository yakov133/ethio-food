import style from "./App.module.css";
import React, { useState } from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
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
import { getStoredAuth } from "./api";

function App() {
  // Hydrate auth synchronously so protected routes do not flicker on refresh.
  const [userLogedIn, setuserLogedIn] = useState(() => getStoredAuth() || false);
  const [modal, setModal] = useState(false);
  const [humburgerlinks, sethumburgerlinks] = useState(false);

  return (
    // HashRouter keeps client routes after # so refreshes never ask the static host for unknown paths.
    <HashRouter>
      <div>
        <Navbar
          userLogedIn={userLogedIn}
          setuserLogedIn={setuserLogedIn}
          modal={modal}
          setModal={setModal}
          humburgerlinks={humburgerlinks}
          sethumburgerlinks={sethumburgerlinks}
        />

        <Switch>
          <Route exact path="/" render={() => <Home />} />
          <Route exact path="/AllRecips" render={() => <AllRecips userLogedIn={userLogedIn} />} />
          <Route exact path="/NewRecipe" render={() => <NewRecipe userLogedIn={userLogedIn} />} />
          <Route exact path="/MyRecipe" render={() => <MyRecipe userLogedIn={userLogedIn} />} />
          <Route exact path="/About" render={() => <About />} />
          <Route exact path="/Details/:id" render={() => <Details userLogedIn={userLogedIn} />} />
          <Route exact path="/Categories/:category" render={() => <Categories userLogedIn={userLogedIn} />} />
          {/* Update uses the recipe id in the URL so direct links and refreshes work. */}
          <Route exact path="/Update/:id" render={() => <Update userLogedIn={userLogedIn} />} />
          <Route exact path="/Admin" render={() => <Admin userLogedIn={userLogedIn} />} />
          <Route component={() => <PageNotFound />} />
        </Switch>

        <footer>&copy;
          <a className={style.linkdin} href="https://www.linkedin.com/in/yakov-kassa-406636116/" target="_blank" rel="noopener noreferrer">Yakov Kassa</a>
          &nbsp;
          <a className={style.linkdin} href="https://www.linkedin.com/in/ofek-saadon-369067194/" target="_blank" rel="noopener noreferrer">Ofek Saadon</a>
          <a href=" https://github.com/yakov133/ethio-food" target="_blank" rel="noopener noreferrer"><AiFillGithub className={style.icons} /></a>
        </footer>
      </div>
    </HashRouter>
  );
}

export default App;
