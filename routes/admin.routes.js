const express = require('express');
const { validateAdminApiKey, addTrain, updateTrain, deleteTrain, registerAdmin, loginAdmin } = require('../controllers/admin.controller');

const router = express.Router();

router.post('/register', registerAdmin);
router.post('/login', loginAdmin);

router.use(validateAdminApiKey);


router.post('/trains', addTrain);
router.put('/trains/:train_id', updateTrain);
router.delete('/trains/:train_id', deleteTrain);

module.exports = router;
