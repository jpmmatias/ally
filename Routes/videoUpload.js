const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const multer = require('multer');
const {videoUpload} = require('../Controllers/videoUpload');

const upload = multer({dest:'uploads/'})
router.post('/',ensureAuthenticated,upload.single('video'),videoUpload)
module.exports = router;