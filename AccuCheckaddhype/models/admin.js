const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const adminSchema= new mongoose.Schema({
    email:{
        type: String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    tokens:[
        {
            token:{
                type:String,
                required: true
            }
        }
    ]
},{timestamps: true})



adminSchema.pre('save', async function(next){
    console.log("Hi Hash Password Middeleware");
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12)
        next();
    }
})

const admin = mongoose.model('admin',adminSchema)
module.exports = admin