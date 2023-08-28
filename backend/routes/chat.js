const express = require('express')

const chatController = require('../controllers/chat');

const middleware = require('../middlewares/authorize')

const router = express.Router();

router.post('/send-chat', middleware.authorize, chatController.postChat);

module.exports = router;