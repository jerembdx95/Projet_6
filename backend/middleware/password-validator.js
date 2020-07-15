const passwordValidator = require("password-validator");

const validPassword = new passwordValidator();

validPassword
  .is()
  .min(10)
  .max(35)
  .has()
  .lowercase()
  .uppercase()
  .digits()
  .symbols();

module.exports = validPassword;