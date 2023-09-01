const express = require('express')

const adminController = require('../controllers/admin');

const router = express.Router();

router.post('/add-member', adminController.addToGroup);

router.delete('/remove-member/:id', adminController.removeMember);

router.put('/make-admin/:Id', adminController.makeAdmin);

module.exports = router;