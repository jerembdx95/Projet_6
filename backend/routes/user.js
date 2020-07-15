const express = require ('express');
const rooter = express.Router(); //permet de creer le router //
const userCtrl = require('../controllers/user');

const {router} = require('../app');

router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

module.exports = router;