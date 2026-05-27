// routes/statsRoutes.js
const express    = require('express');
const router     = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { getOverview, getMonthly, getActivity, getTraffic, getRoles } = require('../controllers/statsController');

router.get('/overview',  protect, getOverview);
router.get('/monthly',   protect, getMonthly);
router.get('/activity',  protect, getActivity);
router.get('/traffic',   protect, getTraffic);
router.get('/roles',     protect, getRoles);

module.exports = router;
