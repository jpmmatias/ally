const express = require('express');
const router = express.Router({mergeParams: true});
const {ensureAuthenticated} = require('../Config/auth');
const multer = require('multer');
const {videoUpload} = require('../Controllers/videoUpload')
const Video = require('../Models/Video');

//Servidor local
 const storage = multer.diskStorage({
     destination:(req,file,cb)=>{
         cb(null,'Uploads/Videos')
     },
     filename:(req,file,cb)=>{
         const ext =file.originalname
         console.log(ext)
         const filePath =`/Videos/${ext}`
         Video.create({filePath,user:req.user._id}).then(()=>{
             cb(null,file.originalname)
         }).catch(err=>{
             console.log(err)
         })
     }
 })
const upload = multer({storage})


router.post('/',ensureAuthenticated,upload.single('video'),videoUpload)
module.exports = router;