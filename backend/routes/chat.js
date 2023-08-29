const express = require('express')

const chatController = require('../controllers/chat');

const middleware = require('../middlewares/authorize')

const router = express.Router();

router.post('/send-chat', middleware.authorize, chatController.postChat);

router.get('/get-chat', chatController.getChat)

module.exports = router;