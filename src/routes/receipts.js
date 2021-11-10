const router = require('express').Router();
const passport = require('passport');

const ReceiptController = require('../controllers/ReceiptController');

router.post('/action', [
    passport.authenticate('jwt', {session: false}),
    ReceiptController.receiptHandler
])

module.exports = router;