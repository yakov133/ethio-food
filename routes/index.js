var express = require('express');
const multer = require("multer");
const uploadDirectory = "uploads/";
const upload = multer({ dest: uploadDirectory });
var router = express.Router();
const {
  addMenyRecpies,
  newCollection,
  getAllRecipes,
  getByCategories,
  getOneRecip,
  updateRecipe,
  newRecipe,
  getImage,
  getUsersRecipes,
  deleteRecipe,
  recipeApprove,
} = require("../utilies.js")





router.post("/newCollection", (req, res) => {
  newCollection(req, res);
});

router.post("/recipes", (req, res) => {
  addMenyRecpies(req, res);
});

router.get("/recipes", (req, res) => {
  getAllRecipes(req, res);
});

router.get("/recipe/:id", (req, res) => {
  getOneRecip(req, res);
});

router.get("/categories/:category", (req, res) => {
  getByCategories(req, res);
});

router.patch("/recipe/:id", (req, res) => {
  updateRecipe(req, res);
});

router.post("/recipe", upload.single("someFile"), (req, res) => {
  newRecipe(req, res);
});

router.get("/image/:newFileName", (req,res)=>{
  getImage(req,res);
})

router.get("/recipe/user/:localId", (req, res) => {
  getUsersRecipes(req,res);
});

router.delete("/recipe/:id",(req,res)=>{
  deleteRecipe(req,res);
})

router.patch("/recipeApprove/:id", (req, res) => {
  recipeApprove(req, res);
});

module.exports = router;
