const express = require('express');
const router = express.Router();

router.use('/admin', require('./admin.routes'));
router.use('/user', require('./user.routes'));

module.exports = router;