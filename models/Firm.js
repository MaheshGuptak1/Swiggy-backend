const mongoose=require('mongoose')
const firmSchema= mongoose.Schema({
    firmname:{
        type:String,
        required:true
    },
    area:{
        type:String,
        required:true
    },
    category:[
        {
            type:String,
            enum:['veg','non-veg']
        }
    ],
    region:[
        {
            type:String,
            enum:['south-indian','north-indian','chinese','bakery']
        }
    ],
    offer:{
        type:String
    },
    image:{
        type:String
    },
    vendor:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref: 'Vendor'
        }
    ],
    products :[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:'Product'
        }
    ]
})

module.exports=mongoose.model('Firm',firmSchema);