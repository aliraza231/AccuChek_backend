const express = require('express');
const User = require('../models/userSchema')
const Course = require('../models/courseSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registered

const userRegister = async (req, res) => {
    const { name, email, country , langguage, password, confrim_password } = req.body;
    if (!name || !email || !country || !langguage || !password|| !confrim_password)  
    {
        return res.status(422).json({ error: 'Please enter all required fields' });
    }
    try {
        const userExists= await User.findOne({ email: email })
        if (userExists) 
        {
          return res.status(422).json({ error: 'Email already exists' });
        }
        else if(password!=confrim_password) 
        {
          return res.status(422).json({ error: 'Password not matched' });
        }
        else
        {
          const user = new User({ name, email, country, langguage, password, confrim_password});
          // Encrypt the password befor saved
          await user.save();
          res.status(201).json({ message: 'Successfully created' });
        }
      } 
      catch (error) 
      {
        console.error(error); // Log the error for debugging
        res.status(500).json({ error: 'Something went wrong' });
      };
};

// User Sign in 
const userSigin = async (req, res) => {
    try{
        const {email, password} = req.body
        if(!email || !password)
        {
          return res.status(400).json({ message: 'Not Empty Fileds'})
        }
        const userLogin = await User.findOne({ email : email})
        // login functionality
        if(userLogin)
        {
          const isMatched= await bcrypt.compare(password,userLogin.password)
          const token = jwt.sign({ userId: userLogin._id }, 'pakistan009', {
            expiresIn: '1h' // Token will expire in 1 hour
           });
          console.log(token);
          // Set the token as an HTTP-only cookie
          res.cookie('jwtToken', token, {
            maxAge: 3600000, // Token expiration time in milliseconds (1 hour)
            httpOnly: true,
          });
           if(!isMatched){
            res.status(400).json({message:'Invalid Cranditionals'});
          }
          else
          {
            res.json({message:'User Login Successfully'});
          }
         
        } 
        else{
          res.status(400).json({message:'Invalid Cranditionals'});
        }
        console.log(userLogin);
       
        }
        catch (error) 
        {
          console.error(error);
        }
};

// Get All Users
const getMembers = async (req, res) => {
  let data = await User.find();
    console.log(data);
    data.length > 0 ? res.send(data) : res.send("No data");
};

// Dell Member
const dellMember = async (req, res) => {
  let dellCoourse = await User.deleteOne({ _id: req.params._id  });
  if(dellCoourse)
  {
    res.status(201).json({ message: 'Successfully Member Delete' });
  }else{
    res.status(201).json({ message: 'Error while deleted User' });
  }
};



// Update Product
const updateSingleMember = async (req, res) => {
  let result = await User.updateOne(
    { _id: req.params._id },
    { $set: req.body }
  );
      res.send(result);
};


// get Single Product Update
const getSingleMember = async (req, res) => {
  let result = await User.findOne({ _id: req.params.id });
  res.send(result);
};

// get Cources whos has status false
const getFalseStausCources = async (req, res) => {
  try {
    let data = await Course.find({status: false});
    console.log(data);
    data.length > 0 ? res.send(data) : res.send("No data");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}

// get Cources whos has status false
const getTrueStausCources = async (req, res) => {
  try {
    let data = await Course.find({status: true});
    console.log(data);
    data.length > 0 ? res.send(data) : res.send("No data");
  } catch (error) {
    console.log(error);
    res.status(500).send("Internal Server Error");
  }
}
module.exports = {userRegister,userSigin,getMembers,dellMember,updateSingleMember,getSingleMember,getFalseStausCources,getTrueStausCources}