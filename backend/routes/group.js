const express = require('express')

const groupController = require('../controllers/group');

const middleware = require('../middlewares/authorize')

const router = express.Router();

router.post('/create-group', middleware.authorize, groupController.createGroup);

router.post('/join-group', middleware.authorize, groupController.joinGroup);

router.get('/get-groups', middleware.authorize, groupController.getGroups);

router.get('/:get-members', groupController.getMembers);

module.exports = router;