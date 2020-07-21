const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');  //contenu dupliqué base de donnée //

const sauceSchema = mongoose.Schema({
  userId: { type: String, required: true},
  name: { type: String, required: true,  unique:true },
  manufacturer: { type: String, required: true },
  description: { type: String },
  mainPepper: { type: String },
  imageUrl: { type: String, required: true },
  heat: { type: Number, required: true },
  likes: { type: Number},
  dislikes: { type: Number, },
  usersLiked: [{ type: String, required: false }],
  usersDisliked: [{ type: String, required: false }]
});

sauceSchema.plugin(uniqueValidator);

module.exports = mongoose.model('sauce', sauceSchema);