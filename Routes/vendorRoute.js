const express = require('express');
const vendorController = require('../controllers/vendorController');
const router = express.Router();
const jwtTokenVerify=require('../Middlewares/jwttokenverify');

router.post('/register', vendorController.vendorRegister);
router.post('/login', vendorController.vendorLogin);

// Spread the array so that the middlewares are passed individually
router.post('/add-firm',jwtTokenVerify, vendorController.addFirm);
router.get('/getvendor/:id',vendorController.getvendor);
router.get('/getAllVendors',vendorController.getAllVendors);
router.get('/getallfirms',vendorController.getAllFirms);
router.get('/getfirmbyid/:firmid',vendorController.getFirmById);
router.delete('/deletefirmbyid/:firmid',vendorController.deleteFirmById);

module.exports = router;
