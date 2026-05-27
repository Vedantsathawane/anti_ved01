// routes/userRoutes.js
const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getAllUsers, updateUser, deleteUser } = require('../controllers/userController');

router.get('/',       protect, getAllUsers);
router.put('/:id',    protect, updateUser);
router.delete('/:id', protect, deleteUser);

module.exports = router;
