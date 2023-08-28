const express = require('express');

const router = express.Router();

const userControllers = require('../controllers/user');

router.post('/signup', userControllers.signup);

module.exports = router;