const Firm = require('../models/Firm');
const Product = require('../models/Product');
const multer = require('multer');
const path = require('path'); 





const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});



const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, 
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png/;
        const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = fileTypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new Error('Only images are allowed (jpeg, jpg, png)'));
        }
    }
});



const addProduct = async (req, res) => {
    try {
        const firmid = req.params.firmid;
        const firmobj = await Firm.findById(firmid);

        if (!firmobj) {
            return res.status(404).json({ "msg": "firm not found" });
        }

        const { productname, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined; 
        const Firmid=firmobj._id;
        const newProduct = new Product({
            productname,
            price,
            category,
            image,
            bestseller,
            description,
            firm: firmobj._id
        });

        const product = await newProduct.save();

        
        firmobj.products.push(product._id);
        await firmobj.save();


        res.status(201).json({ data: product });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": err.message });
    }
};



const getAllProducts = async (req, res) => {
    try {
        const data = await Product.find();
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": err.message });
    }
};


const getProductbyid = async (req, res) => {
    try {
        const productid=req.params.productid;
        const data = await Product.findById(productid);
        res.status(200).json({ data });
    } catch (err) {
        console.error(err);
        res.status(500).json({ "Error": err.message });
    }
};





const deleteProductById=async (req,res)=>{
    const productid=req.params.productid;
    const deletedproduct=await Product.findByIdAndDelete(productid);
    if(!deletedproduct){
        res.status(400).json({message : "product not found "})
    }
    else{
        res.status(200).json({message : "product found and deleted "})
    }
}






module.exports = {
    addProduct: [upload.single('image'), addProduct],
    getAllProducts,
    getProductbyid,
    deleteProductById
};
