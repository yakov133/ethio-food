const createError = require("http-errors");
const fs = require("fs-extra");
const path = require("path");
const { randomUUID } = require("crypto");
const { getDb } = require("./db");
const { isAdminUser } = require("./auth");

const uploadDirectory = path.resolve(__dirname, "uploads");
const recipesCollection = "recipes";

const allowedCategories = new Set(["Vegeterian", "Vegan", "Milk", "Meat"]);
const allowedMealTimes = new Set(["בוקר", "צהריים", "ערב", "נשנושים וקינוחים"]);
const editableRecipeFields = ["title", "name", "category", "Ingredients", "Instructions", "Nots", "mealTimes"];

// These helpers normalize user input before any value reaches MongoDB.
function cleanText(value) {
  return typeof value === "string" ? value.trim() : "";
}

function requireText(body, field, label, maxLength = 5000) {
  const value = cleanText(body[field]);
  if (!value) {
    throw createError(400, `${label} is required`);
  }

  if (value.length > maxLength) {
    throw createError(400, `${label} is too long`);
  }

  return value;
}

function optionalText(body, field, maxLength = 5000) {
  const value = cleanText(body[field]);
  if (value.length > maxLength) {
    throw createError(400, `${field} is too long`);
  }

  return value;
}

function parseMealTimes(value) {
  let mealTimes = value;

  if (typeof value === "string") {
    try {
      mealTimes = JSON.parse(value);
    } catch (err) {
      throw createError(400, "mealTimes must be a valid array");
    }
  }

  if (!Array.isArray(mealTimes) || mealTimes.length === 0) {
    throw createError(400, "At least one meal time is required");
  }

  const uniqueMealTimes = [...new Set(mealTimes.map(cleanText))];
  const invalidMealTime = uniqueMealTimes.find((mealTime) => !allowedMealTimes.has(mealTime));
  if (invalidMealTime) {
    throw createError(400, "Invalid meal time");
  }

  return uniqueMealTimes;
}

function requireCategory(category) {
  const cleanCategory = cleanText(category);
  if (!allowedCategories.has(cleanCategory)) {
    throw createError(400, "Invalid category");
  }

  return cleanCategory;
}

// Prevents directory traversal when serving or deleting uploaded files.
function safeUploadPath(filename) {
  const cleanFileName = path.basename(filename || "");
  if (!cleanFileName) {
    throw createError(400, "Image filename is required");
  }

  const filePath = path.resolve(uploadDirectory, cleanFileName);
  if (!filePath.startsWith(`${uploadDirectory}${path.sep}`)) {
    throw createError(400, "Invalid image path");
  }

  return filePath;
}

function ensureCollectionName(collectionName) {
  const cleanCollectionName = cleanText(collectionName);
  if (!/^[a-zA-Z0-9_-]{1,50}$/.test(cleanCollectionName)) {
    throw createError(400, "Invalid collection name");
  }

  return cleanCollectionName;
}

async function getRecipesCollection() {
  const db = await getDb();
  return db.collection(recipesCollection);
}

async function newCollection(req, res) {
  const collectionName = ensureCollectionName(req.body.collectionName);
  const db = await getDb();
  await db.createCollection(collectionName);
  return res.status(201).json({ message: "Collection created" });
}

async function addMenyRecpies(req, res) {
  const collectionName = ensureCollectionName(req.body.collectionName);
  const data = Array.isArray(req.body.data) ? req.body.data : null;
  if (!data || data.length === 0) {
    throw createError(400, "Data must be a non-empty array");
  }

  const docs = data.map((recipe) => ({
    ...recipe,
    id: recipe.id || randomUUID(),
    comments: Array.isArray(recipe.comments) ? recipe.comments.slice(0, 5) : [],
    adminApproval: Boolean(recipe.adminApproval),
    createdAt: recipe.createdAt ? new Date(recipe.createdAt) : new Date(),
    updatedAt: new Date(),
  }));

  const db = await getDb();
  const result = await db.collection(collectionName).insertMany(docs);
  return res.status(201).json({ insertedCount: result.insertedCount });
}

async function getAllRecipes(req, res) {
  const collection = await getRecipesCollection();
  // Public users see only approved recipes; admins can request the review queue.
  const filter = req.query.includePending === "true" && isAdminUser(req.user)
    ? {}
    : { adminApproval: true };
  const result = await collection.find(filter).sort({ createdAt: -1, title: 1 }).toArray();
  return res.status(200).json(result);
}

async function getByCategories(req, res) {
  const category = requireCategory(req.params.category);
  const collection = await getRecipesCollection();
  const result = await collection
    .find({ category, adminApproval: true })
    .sort({ createdAt: -1, title: 1 })
    .toArray();
  return res.status(200).json(result);
}

async function getOneRecip(req, res) {
  const collection = await getRecipesCollection();
  const recipe = await collection.findOne({ id: req.params.id });
  if (!recipe) {
    throw createError(404, "Recipe was not found");
  }

  const canViewPending = recipe.adminApproval
    || (req.user && (isAdminUser(req.user) || recipe.localId === req.user.localId));
  if (!canViewPending) {
    throw createError(404, "Recipe was not found");
  }

  return res.status(200).json(recipe);
}

async function updateRecipe(req, res) {
  const collection = await getRecipesCollection();
  const recipe = await collection.findOne({ id: req.params.id });
  if (!recipe) {
    throw createError(404, "Recipe was not found");
  }

  const bodyKeys = Object.keys(req.body || {});
  if (bodyKeys.length === 1 && Object.prototype.hasOwnProperty.call(req.body, "comments")) {
    const comment = requireText(req.body, "comments", "Comment", 500);
    // Keep only the newest five comments without reading and rewriting the document.
    await collection.updateOne(
      { id: req.params.id },
      {
        $push: { comments: { $each: [comment], $position: 0, $slice: 5 } },
        $set: { updatedAt: new Date() },
      }
    );
    return res.status(200).json({ message: "Comment added" });
  }

  if (!isAdminUser(req.user) && recipe.localId !== req.user.localId) {
    throw createError(403, "You can only update your own recipes");
  }

  const update = {};
  if (Object.prototype.hasOwnProperty.call(req.body, "title")) {
    update.title = requireText(req.body, "title", "Title", 120);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "name")) {
    update.name = requireText(req.body, "name", "Name", 120);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "category")) {
    update.category = requireCategory(req.body.category);
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "Ingredients")) {
    update.Ingredients = requireText(req.body, "Ingredients", "Ingredients");
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "Instructions")) {
    update.Instructions = requireText(req.body, "Instructions", "Instructions");
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "Nots")) {
    update.Nots = optionalText(req.body, "Nots");
  }
  if (Object.prototype.hasOwnProperty.call(req.body, "mealTimes")) {
    update.mealTimes = parseMealTimes(req.body.mealTimes);
  }

  const invalidField = bodyKeys.find((field) => !editableRecipeFields.includes(field));
  if (invalidField) {
    throw createError(400, `Field ${invalidField} cannot be updated`);
  }

  if (Object.keys(update).length === 0) {
    throw createError(400, "No recipe fields were provided");
  }

  update.updatedAt = new Date();
  if (!isAdminUser(req.user)) {
    // User edits return a recipe to the approval queue.
    update.adminApproval = false;
  }

  await collection.updateOne({ id: req.params.id }, { $set: update });
  return res.status(200).json({ message: "Recipe updated" });
}

async function newRecipe(req, res) {
  if (!req.file) {
    throw createError(400, "Recipe image is required");
  }

  try {
    // Store the owner from the verified token, not from editable form fields.
    const category = requireCategory(req.body.category);
    const mealTimes = parseMealTimes(req.body.mealTimes);
    const myobj = {
      title: requireText(req.body, "title", "Title", 120),
      name: requireText(req.body, "name", "Name", 120),
      category,
      Ingredients: requireText(req.body, "Ingredients", "Ingredients"),
      Instructions: requireText(req.body, "Instructions", "Instructions"),
      Nots: optionalText(req.body, "Nots"),
      mealTimes,
      src: req.file.filename,
      comments: [],
      id: randomUUID(),
      localId: req.user.localId,
      createdByEmail: req.user.email,
      adminApproval: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const collection = await getRecipesCollection();
    await collection.insertOne(myobj);
    return res.status(201).json({ message: "Recipe created", id: myobj.id });
  } catch (err) {
    // If validation or Mongo insert fails, do not leave an orphan image on disk.
    await fs.remove(req.file.path).catch(() => {});
    throw err;
  }
}

async function getImage(req, res) {
  const filename = req.params.newFileName;
  const filePath = safeUploadPath(filename);
  if (!(await fs.pathExists(filePath))) {
    throw createError(404, "Image was not found");
  }

  return res.sendFile(filePath);
}

async function getUsersRecipes(req, res) {
  const collection = await getRecipesCollection();
  const result = await collection
    .find({ localId: req.params.localId })
    .sort({ createdAt: -1, title: 1 })
    .toArray();

  return res.status(200).json(result);
}

async function deleteRecipe(req, res) {
  const collection = await getRecipesCollection();
  const recipe = await collection.findOne({ id: req.params.id });
  if (!recipe) {
    throw createError(404, "Recipe was not found");
  }

  if (!isAdminUser(req.user) && recipe.localId !== req.user.localId) {
    throw createError(403, "You can only delete your own recipes");
  }

  await collection.deleteOne({ id: req.params.id });
  if (recipe.src) {
    // Remove the upload only after the DB delete succeeds.
    await fs.remove(safeUploadPath(recipe.src)).catch(() => {});
  }

  return res.status(200).json({ message: "Recipe deleted" });
}

async function recipeApprove(req, res) {
  const collection = await getRecipesCollection();
  const result = await collection.updateOne(
    { id: req.params.id },
    {
      $set: {
        adminApproval: true,
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
    }
  );

  if (result.matchedCount === 0) {
    throw createError(404, "Recipe was not found");
  }

  return res.status(200).json({ message: "Recipe approved" });
}

module.exports = {
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
};

