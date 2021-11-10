const router = require('express').Router();
const passport = require('passport');

const UsersController = require('../controllers/UserController');

router.post('/sign-up', [
    passport.authenticate('jwt', {session: false}),
    UsersController.signUp
]);
router.post('/sign-in', [
    passport.authenticate('local', {session: false}),
    UsersController.signIn
]);

module.exports = router;