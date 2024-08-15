const mongoose = require('mongoose');
const path = require('path'); 

const Productschema = mongoose.Schema({
    productname: {
        type: String,
        required: true 
    },
    price: {
        type: String,
    },
    category: [{
        type: String,
        enum: ["veg", "non-veg"],
        required: true
    }],
    image: {
        type: String
    },
    bestseller: {
        type: String
    },
    description: {
        type: String
    },
    firm: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Firm'
    }
});

module.exports = mongoose.model('Product', Productschema);