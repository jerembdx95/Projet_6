require("dotenv").config();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const passwordValidator = require("../middleware/password-validator");

// Crée un nouvel utilisateur
exports.signup = (req, res) => {
  if (passwordValidator.validate(req.body.password)) { // Si le mot de passe est validé par password-validator
    bcrypt.hash(req.body.password, 10) // Hashe et sale 10 fois le mot de passe récupéré dans la requête
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash,
        });
        user.save() // Enregistre l'utilisateur dans la base de données
          .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
          .catch(() => res.status(400).json({ message: "Il existe déjà un utilisateur avec cette adresse email." }));
      })
      .catch(error => res.status(500).json({ error }));
  } else { // Si le mot de passe n'est pas validé par password-validator
    res.status(400).json({ message: "Votre mot de passe doit contenir entre 8 et 30 caractères et comporter au moins une lettre minuscule, une lettre majuscule, un chiffre et un caractère spécial." });
  }
};

// Connecte un utilisateur
exports.login = (req, res) => {
  User.findOne({ email: req.body.email })
    .then(user => {
      console.log(user)
      if (!user) {
        return res.status(401).json({ message: "Utilisateur non trouvé !" });
      }
      bcrypt.compare(req.body.password, user.password)
        .then(valid => {
          if (!valid) {
            return res.status(401).json({ message: "Mot de passe incorrect !" });
          }
          res.status(200).json({
            userId: user._id,
            token: jwt.sign(
              { userId: user._id },
              process.env.TOKEN_SECRET_KEY,
              { expiresIn: "24h" },
            ),
          });
        })
        .catch(error => {
          console.log(error)
         return res.status(500).json({ error })
        });
    })
    .catch(error => res.status(500).json({ error }));
};