const express = require('express');
const router = express.Router();
const  isloggedin  = require('../Middlewares/Isloggedin');
const upload = require('../Config/MulterConfig');
const { createClothing,updateClothing,deleteClothing,getClothingById,getAllClothing,getMyListings } = require('../Controllers/clothingController');



router.post('/addclothing', isloggedin, upload.array('images', 5), createClothing);

router.get('/getallclothing', getAllClothing);

router.get('/mylistings', isloggedin, getMyListings);

router.get('/getclothing/:id', getClothingById);

router.put('/update/:id', isloggedin,upload.array('images', 5),updateClothing);

router.delete('/delete/:id', isloggedin, deleteClothing);


module.exports = router;