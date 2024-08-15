const express=require('express')
const router=express.Router()
const productcontroller = require('../controllers/productController')

router.post('/addproduct/:firmid',productcontroller.addProduct);
router.get('/getAllProducts',productcontroller.getAllProducts);
router.get('/getproductbyid/:productid',productcontroller.getProductbyid);
router.delete('/deleteproductbyid/:productid',productcontroller.deleteProductById);
module.exports= router