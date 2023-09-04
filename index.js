const express = require('express');
const dotenv = require('dotenv');
const app = express();

const Products = require('./models/productModel/product.model')
// Today
const multer = require('multer');
const path= require('path');
const ejs = require('ejs');

var cors = require('cors')
dotenv.config({path:'config.env'})
require('./configuration/connection/connection')
app.use(cors());

// DATABASE = mongodb+srv://ayanmali358:1234567ali@cluster0.hzs2gkl.mongodb.net/AccuCheck
app.use("/uploads", express.static("uploads"));
// app.use("/products", express.static("uploads"));
// const get_Admin_routes=require("./routes/Admin")
const get_Admin_routes=require("./routes/adminRoutes/admin.route")
const get_User_routes=require("./routes/userRoutes/user.route")

app.use(express.json());

const { json } = require('body-parser');


app.use('/Admin',get_Admin_routes)
app.use('/User',get_User_routes)
const PORT=process.env.PORT


app.get("/helohamza",(req, res) => {
    res.send("HEY MARA")
})


// Running server 
app.listen(PORT, (req, res)=>{
    console.log(`Server listening on Port  ${PORT}` )
})
