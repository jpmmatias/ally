const express = require('express');
const router = express.Router({ mergeParams: true });
const { ensureAuthenticated } = require('../Config/auth');
const multer = require('multer');
const { videoUpload } = require('../Controllers/videoUpload');
const Video = require('../Models/Video');
const path = require('path');

//Servidor local
const pathV = path.join(__dirname, '../Uploads/Videos');
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, pathV);
	},
	filename: (req, file, cb) => {
		const ext = file.originalname;
		const filePath = `/Videos/${ext}`;
		console.log(req.params);
		Video.create({ filePath, user: req.user._id, userNome: req.user.nome, testeId: req.params.id })
			.then(() => {
				cb(null, file.originalname);
			})
			.catch((err) => {
				console.log(err);
			});
	}
});
const upload = multer({ storage });

router.post('/', ensureAuthenticated, upload.single('video'), videoUpload);
module.exports = router;
