const express = require("express");
const userCtrl = require("../controllers/user");

const router = express.Router();

// Gestion des verbes HTTP
router.post("/signup", userCtrl.signup); // Crée un nouvel utilisateur
router.post("/login", userCtrl.login); // Connecte un utilisateur

module.exports = router