const express = require('express')

const chatController = require('../controllers/chat');

const middleware = require('../middlewares/authorize');

const multer = require('multer');

const upload = multer({ dest: 'uploads/'});

const router = express.Router();

router.post('/send-chat/:activeGroup', middleware.authorize, chatController.postChat);

router.get('/get-chat/:activeGroup', chatController.getChat);

router.post('/get-multimedia-chat/:activeGroup', middleware.authorize, upload.single('message'), chatController.multimediaChat);

module.exports = router;