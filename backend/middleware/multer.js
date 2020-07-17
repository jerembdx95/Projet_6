const multer = require("multer");

// Crée un dictionnaire des types MIME
const mimeTypes = {
  "image/jpg": "jpg",
  "image/jpeg": "jpg",
  "image/png": "png",
};

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "images");
  },
  filename: (req, file, callback) => {
    const name = file.originalname.split(" ").join("_"); // Génère un nom en remplaçant les éventuels espaces par des underscores
    const extension = mimeTypes[file.mimetype]; // Génère l'extension du fichier
    callback(null, `${name + Date.now()}.${extension}`); // Genère le nom complet du fichier
  },
});

module.exports = multer({ storage }).single("image");