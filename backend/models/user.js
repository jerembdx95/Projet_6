const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');  // assure qu'aucun utilisateur partage la même adresse e-mail. //

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);   //permet d'appliquer UV au schéma //

module.exports = mongoose.model('User', userSchema);