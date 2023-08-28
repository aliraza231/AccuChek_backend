const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userSchema= new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    country:{
        type:String,
        required: true
    },
    langguage:{
        type:String,
        required: true
    },
    password:{
        type:String,
        required: true
    },
    confrim_password:{
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

userSchema.pre('save', async function(next){
    console.log("Hi Hash Password Middeleware");
    if(this.isModified('password')){
        this.password= await bcrypt.hash(this.password,12)
        this.confrim_password= await bcrypt.hash(this.confrim_password,12)
        next();
    }
})
userSchema.methods.generateAuthToken= async function (){
    try {
        let token = jwt.sign({_id:this._id},process.env.SCRET_KEY)
        this.tokens = this.tokens.concat({token:token});
        await this.save();
        return this.token;
    } catch (error) {
        console.log(error);
    }
}

const User = mongoose.model('users',userSchema)
module.exports = User 