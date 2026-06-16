var express = require('express');
const multer = require("multer");
const fs = require("fs-extra");
const path = require("path");
const { randomUUID } = require("crypto");
const {
  requireAuth,
  optionalAuth,
  requireAdmin,
  requireSelfOrAdmin,
} = require("../auth");

const uploadDirectory = path.resolve(__dirname, "..", "uploads");
fs.ensureDirSync(uploadDirectory);

const allowedImageTypes = new Map([
  ["image/jpeg", ".jpg"],
  ["image/png", ".png"],
  ["image/webp", ".webp"],
  ["image/gif", ".gif"],
]);

// Uploaded names are generated server-side so user filenames never become paths.
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDirectory),
  filename: (req, file, cb) => {
    const ext = allowedImageTypes.get(file.mimetype);
    cb(null, `${randomUUID()}${ext}`);
  },
});

// Multer rejects oversized files and risky image types before they reach handlers.
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    if (!allowedImageTypes.has(file.mimetype)) {
      const err = new Error("Only jpg, png, webp, and gif images are allowed");
      err.status = 400;
      return cb(err);
    }

    return cb(null, true);
  },
});

// Keeps route definitions readable while forwarding async failures to Express.
const asyncHandler = (handler) => (req, res, next) => (
  Promise.resolve(handler(req, res, next)).catch(next)
);

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





// Write/admin routes are protected here; controller functions still validate data.
router.post("/newCollection", requireAuth, requireAdmin, asyncHandler(newCollection));

router.post("/recipes", requireAuth, requireAdmin, asyncHandler(addMenyRecpies));

router.get("/recipes", optionalAuth, asyncHandler(getAllRecipes));

router.get("/recipe/:id", optionalAuth, asyncHandler(getOneRecip));

router.get("/categories/:category", asyncHandler(getByCategories));

router.patch("/recipe/:id", requireAuth, asyncHandler(updateRecipe));

router.post("/recipe", requireAuth, upload.single("someFile"), asyncHandler(newRecipe));

router.get("/image/:newFileName", asyncHandler(getImage))

router.get("/recipe/user/:localId", requireAuth, requireSelfOrAdmin, asyncHandler(getUsersRecipes));

router.delete("/recipe/:id", requireAuth, asyncHandler(deleteRecipe))

router.patch("/recipeApprove/:id", requireAuth, requireAdmin, asyncHandler(recipeApprove));

module.exports = router;

