import React from "react";
import appStyle from "../App.module.css";
const PageNotFound = () => {
  document.title = "Error";
  return (
    <div className={appStyle.info}>
      <h1>Sorry This Page Can't Be Found</h1>
    </div>
  );
};
export default PageNotFound;
