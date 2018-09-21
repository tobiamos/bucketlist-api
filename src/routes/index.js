const express = require('express');

const router = express.Router();
const authRoutes = require('../modules/User/routes');
const bucketListRoutes = require('../modules/BucketList/routes');
const { sendJSONResponse } = require('../helpers');

router.get('/', (req, res) => sendJSONResponse(res, 200, null, req.method, 'Api is connected'));
router.use('/auth', authRoutes);
router.use('/bucketlists', bucketListRoutes);

module.exports = router;
