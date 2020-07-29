require("dotenv").config();
const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const path = require("path");

const userRoutes = require("./routes/user");
const sauceRoutes = require("./routes/sauce");

mongoose.connect('mongodb+srv://jeremy_bdx95:whSHSa8B1U8qeY1B@cluster0-5aq6g.mongodb.net/<dbname>?retryWrites=true&w=majority'
,
  { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));

const app = express();

app.use(helmet()); // https://www.npmjs.com/package/helmet#how-it-works

// Ajout de headers CORS à l'objet de réponse
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");  /* accéder à notre API depuis n'importe quelle origine ( '*' ) ;*/
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, PATCH, OPTIONS"); /* d'envoyer des requêtes avec les méthodes mentionnées */
  next();
});

app.use(bodyParser.json()); // Transforme le corps de la requête en un objet JSON

app.use("/images", express.static(path.join(__dirname, "images"))); // Autorise l'application à servir les fichiers statiques du dossier images

// Routage
app.use("/api/auth", userRoutes);
app.use("/api/sauces", sauceRoutes);

module.exports = app;