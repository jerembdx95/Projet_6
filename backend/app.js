const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

// Connection à la base de données MongoDB
mongoose.connect('mongodb+srv://jeremy_bdx95:whSHSa8B1U8qeY1B@cluster0-5aq6g.mongodb.net/<dbname>?retryWrites=true&w=majority'
,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

// Ajout de headers CORS à l'objet de réponse
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS");
  next();
});

app.use(bodyParser.json()); // Transforme le corps de la requête en un objet JSON

// Routage
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);
