const fs = require("fs");   // permet d'accéder au fichier image pour le supprimer //
const Sauce = require("../models/sauce");

// Crée une nouvelle sauce
exports.createSauce = (req, res) => {
  const sauceObject = JSON.parse(req.body.sauce);
  delete sauceObject._id; // Supprime l'id généré automatiquement
  const sauce = new Sauce({
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
  });
  sauce.save() // Enregistre la sauce dans la base de données
    .then(() => res.status(201).json({ message: "Sauce ajoutée !" }))
    .catch(error => {
      console.log(error)
     return res.status(400).json({ error })});
};

// Récupère toutes les sauces
exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then(sauces => res.status(200).json(sauces))
    .catch(error => res.status(400).json({ error }));
};

// Récupère une sauce précise
exports.getOneSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => res.status(200).json(sauce))
    .catch(error => res.status(404).json({ error }));
};

// Modifie une sauce
exports.modifySauce = (req, res) => {
  const sauceObject = req.file
    ? {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`,
    } : { ...req.body };
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      if (req.file) {
        const filename = sauce.imageUrl.split("/images/")[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
            .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
            .catch(error => res.status(400).json({ error }));
        });
      } else {
        Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce modifiée !" }))
          .catch(error => res.status(400).json({ error }));
      }
    })
    .catch(error => res.status(500).json({ error }));
};

// Supprime une sauce
exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then(sauce => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Sauce supprimée !" }))
          .catch(error => res.status(400).json({ error }));
      });
    })
    .catch(error => res.status(500).json({ error }));
};

// Like et dislike
exports.likeSauce = (req, res) => {
  // Si l'utilisateur like une sauce
  if (req.body.like === 1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $set: { usersLiked: req.body.userId }, // Ajoute l'id de l'utilisateur à la liste des utilisateurs aimant la sauce
      $inc: { likes: 1 }, // Incrémente de 1 le nombre d'utilisateurs aimant la sauce
    })
      .then(() => res.status(200).json({ message: "L'utilisateur a liké la sauce !" }))
      .catch(error => res.status(400).json({ error }));
  }
  // Si l'utilisateur dislike une sauce
  if (req.body.like === -1) {
    Sauce.updateOne({ _id: req.params.id }, {
      $set: { usersDisliked: req.body.userId }, // Ajoute l'id de l'utilisateur à la liste des utilisateurs n'aimant pas la sauce
      $inc: { dislikes: 1 }, // Incrémente de 1 le nombre d'utilisateurs n'aimant pas la sauce
    })
      .then(() => res.status(200).json({ message: "L'utilisateur a disliké la sauce !" }))
      .catch(error => res.status(400).json({ error }));
  }
  // Si l'utilisateur annule son like ou son dislike
  if (req.body.like === 0) {
    Sauce.findOne({ _id: req.params.id })
      .then(sauce => {
        const alreadyLiked = sauce.usersLiked.includes(req.body.userId); // Vérifie si la sauce a déjà un like de la part de l'utilisateur
        // Si l'utilisateur avait liké
        if (alreadyLiked) {
          Sauce.updateOne({ _id: req.params.id }, {
            $pull: { usersLiked: req.body.userId }, // Supprime l'id de l'utilisateur de la liste des utilisateurs aimant la sauce
            $inc: { likes: -1 }, // Décrémente de 1 le nombre d'utilisateurs aimant la sauce
          })
            .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son like !" }))
            .catch(error => res.status(400).json({ error }));
        // Si l'utilisateur avait disliké
        } else {
          Sauce.updateOne({ _id: req.params.id }, {
            $pull: { usersDisliked: req.body.userId }, // Supprime l'id de l'utilisateur de la liste des utilisateurs n'aimant pas la sauce
            $inc: { dislikes: -1 }, // Décrémente de 1 le nombre d'utilisateurs n'aimant pas la sauce
          })
            .then(() => res.status(200).json({ message: "L'utilisateur a supprimé son dislike !" }))
            .catch(error => res.status(400).json({ error }));
        }
      })
      .catch(error => res.status(500).json({ error }));
  }
};