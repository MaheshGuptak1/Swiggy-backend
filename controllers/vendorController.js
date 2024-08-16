const Vendor = require('../models/Vendor');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const Firm = require('../models/Firm');
const multer = require('multer');
const path = require('path');
dotenv.config();
const secretkey = process.env.secretkey;


// Asyncronus functions will Return a promise (e.g., database calls, API requests)
// we need to handle them with the help of await keyword 

// ex: Database queries (like findById() in Mongoose)
// Fetching data from APIs (fetch())
// File system operations (using fs.promises in Node.js)
// Timers (setTimeout(), setInterval())



const vendorRegister = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const hashedpassword = await bcrypt.hash(password, 10);
        const data = new Vendor({
            username,
            email,
            password:hashedpassword
        });
        await data.save();
        res.status(200).json(data);
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

const vendorLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const vendor = await Vendor.findOne({ email });
        if (!vendor || !(await bcrypt.compare(password, vendor.password))) {
            res.status(401).json({ message: "invalid credentials" });
        } else {
            const token = jwt.sign({ vendorId: vendor._id }, secretkey, { expiresIn: "1h" });
            req.vendorId=vendor._id;
            res.status(200).json({ status: "login successful", tokenData: token });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "error occurred" });
    }
};





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



// post firm 
const addFirm = async (req, res) => {
    try {
        // req.vendorId is available from the middleware
        const vendorId = req.vendorId;
        const { firmname, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined; // Image filename from multer


        
        const firmdata = new Firm({
            firmname,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendorId  // Use vendorId from the middleware
        });


        const newFirm = await firmdata.save();

        // Find the vendor and push the new firm to the vendor's firms array
        const vendor = await Vendor.findById(vendorId);
        if (vendor) {
            vendor.firm.push(newFirm._id);
            await vendor.save();
        }  

        res.status(200).json({ message: "Firm added successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ Error: err.message });
    }
};

//get firm 
const getAllFirms=async (req,res)=>{
    const vendorid=req.params.vendorid;
    const data= await Vendor.find(vendorid).populate('firm');
    if(!data){
        res.status(200).json({message : "no firms found for this vendor" });
    }
    res.status(200).json({data});
}



//get vendor 
const getvendor=async (req,res)=>{
    const id=req.params.id;
    const vendor=await Vendor.findById(id).populate('firm');
    res.status(200).json(vendor);
}  

//get vendor
const getAllVendors = async (req,res)=>{
    const vendor=await Vendor.find().populate('firm');
    res.status(200).json(vendor);
}

//get firm 

const getFirmById=async (req,res)=>{
    const firmid=req.params.firmid;
    const data= await Firm.findById(firmid);
    if(!data){
        res.status(400).json({message: "firm not found with given id"});
    }
    else{
        res.status(200).json({data});
    }
}

const deleteFirmById=async (req,res)=>{
    const firmid= req.params.firmid;
    const data=await Firm.findByIdAndDelete(firmid);
    if(!data){
        res.status(400).json({message : "firm not found"})
    }
    else{
        res.status(200).json({message : "firm deleted successfully"})
    }
}


// Export upload middleware and addFirm function
module.exports = {
    vendorRegister,
    vendorLogin,
    addFirm: [upload.single('image'), addFirm],
    getvendor,
    getAllVendors,
    getAllFirms,
    getFirmById,
    deleteFirmById
};
