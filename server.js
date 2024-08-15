    const express= require('express');
    const bodyparser=require('body-parser');
    const dotenv=require('dotenv');
    const mongoose=require('mongoose');
    const vendorRouter=require('./Routes/vendorRoute');
    const app=express()
    const productRouter=require('./Routes/productRoute')
    const port=7011
    dotenv.config()
    app.use(bodyparser.json())
    app.listen(port,()=>{
        console.log(`server is running on port ${port}`);
    })

    mongoose.connect(process.env.MONGO_URI).
    then(()=>{
        console.log("DB connected successfully")
    }).
    catch((err)=>{
        console.log(err)
    })


    app.use('/vendors',vendorRouter);
    app.use('/products',productRouter);
    app.use(express.json()); 

