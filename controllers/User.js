const express = require('express');
const {User,userJoiSchema, userJoiSigninSchema} = require('../models/userSchema')
const Course = require('../models/courseSchema')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// User Registered

const userRegister = async (req, res) => {
    
    const {error} = userJoiSchema.validate(req.body);
    if (error){
      return res.status(404).json({error: error.details[0].message});
    }
    try {
      const { name, email, country , language, password, confirm_password } = req.body;
        const userExists= await User.findOne({ email: email })
        if (userExists) 
        {
          return res.status(422).json({ error: 'Email already exists' });
        }
        else
        {
          const user = new User({ name, email, country, language, password, confirm_password});
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
  const {error} = userJoiSigninSchema.validate(req.body);
  if (error){
    return res.status(404).json({error: error.details[0].message});
  }
    try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Not Empty Fields' });
    }
    const userLogin = await User.findOne({ email: email });
    // login functionality
    if (userLogin) {
      const isMatched = await bcrypt.compare(password, userLogin.password);
      if (!isMatched) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      } else {
        const token = jwt.sign(
          { userId: userLogin._id, userName: userLogin.name }, // Include user name here
          'pakistan009',
          {
            expiresIn: '1h'
          }
        );
        console.log(userLogin);
        // Set the token as an HTTP-only cookie
        res.cookie('jwtToken', token, {
          maxAge: 36000000, // Token expiration time in milliseconds (1 hour)
          httpOnly: true
        });

        return res.status(200).json({
          message: 'User Login Successfully',
          token: token,
          userId: userLogin._id,
          name: userLogin.name // Include the user's name here
          
        });
      }
    } else {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Internal Server Error' });
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
  // let result = await Products.findOne({ _id: req.params.id });
  // res.send(result);
};


// get Single Product Update
const getSingleMember = async (req, res) => {
  // let result = await Products.updateOne(
  //   { _id: req.params._id },
  //   { $set: req.body }
  // );
  //     res.send(result);
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