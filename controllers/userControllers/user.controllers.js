const express = require('express');
const {User,userJoiSchema, userJoiSigninSchema} = require('../../models/userModel/user.model')
// const cources = require('../models/courseSchema')
const {Course} = require('../../models/courseModel/course.model');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sendOTPTOEmail= require('../../auth/auths.Email')

// User Registered

const userRegister = async (req, res) => {
  const { error } = userJoiSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  try {
    const { name, email, password, country, confirm_password, language, otp } = req.body;

    // Check if the email exists in the database
    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: 'This email is already registered' });
    }
    const points = 0;
    // function generateOTP() {
    //   const length = 6; 
    //   const charset = '0123456789';
    //   let otp = '';
    
    //   for (let i = 0; i < length; i++) {
    //     const randomIndex = Math.floor(Math.random() * charset.length);
    //     otp += charset[randomIndex];
    //   }
    
    //   return otp;
    // }

    // const generatedOtp = generateOTP();
    // sendOTPToEmail(email, generatedOtp); 
 

    // const storedOtp = ''; 
    // const otpTimestamp = ''; 

  
    // if (otp !== storedOtp || isOtpExpired(otpTimestamp)) {
    //   return res.status(401).json({ error: 'Invalid or expired OTP' });
    // }

    // OTP is correct and valid, proceed with user registration
    const image = req.file.filename;
    const newUser = new User({
      name,
      email,
      password,
      country,
      confirm_password,
      language,
      image,
      points
    });

    await newUser.save();
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      user: newUser
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to add user' });
  }
};
// function isOtpExpired(otpTimestamp) {
//   const currentTimestamp = Date.now();
//   const otpExpirationTime = 5 * 60 * 1000; // OTP expires after 5 minutes (adjust as needed)

//   return currentTimestamp - otpTimestamp > otpExpirationTime;
// }

const userRegisterOtp = async(req, res) =>{
  // const { email } = req.body;

  // const otp = generateOTP();

  // // Send the OTP to the user's email
  // try {
  //   await sendOTPToEmail(email, otp);
  //   res.status(200).json({ message: 'OTP sent successfully' });
  // } catch (error) {
  //   console.error(error);
  //   res.status(500).json({ error: 'Failed to send OTP' });
  // }
}


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
        // const token = jwt.sign(
        //   { userId: userLogin._id, userName: userLogin.name }, // Include user name here
        //   'pakistan009',
        //   {
        //     expiresIn: '1h'
        //   }
        // );
        // console.log(userLogin);
        // // Set the token as an HTTP-only cookie
        // res.cookie('jwtToken', token, {
        //   maxAge: 36000000, // Token expiration time in milliseconds (1 hour)
        //   httpOnly: true
        // });

        const token = jwt.sign(
          { userId: userLogin._id, userName: userLogin.name, userImage: userLogin.image,userPoints: userLogin.points },
          'pakistan009',
          {
            expiresIn: '1h',
          }
        );

        return res.status(200).json({
          // message: 'User Login Successfully',
          // token: token,
          // userId: userLogin._id,
          // name: userLogin.name, // Include the user's name here
          // image: userLogin.image
          message: 'User Login Successfully',
          token: token,
          userId: userLogin._id,
          name: userLogin.name,
          image: userLogin.image,
          points:userLogin.points,
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
// user iamge



const userInfo = async (req, res) => {
  try {
    const result = await User.updateOne(
      { _id: req.params._id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    console.error("Error while updating user points", error);
    res.status(500).json({ error: "Failed to update points Server Error" });
  }
};



// user image end
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

const updateCourseStatus = async (req, res) => {
  try { 
    const result = await Course.updateOne(
      { _id: req.params._id },
      { $set: req.body }
    );
    res.send(result);
  }
  catch (error)
  {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
// const updateCourseStatus = async (req, res) => {
//   try { 
//     const courseId = req.params._id; // Assuming this is the course ID
//     const { courseId: updatedCourseId, courseStatus: updatedCourseStatus } = req.body;
    
//     const result = await User.updateOne(
//       { 'course._id': courseId },
//       { $set: { 'course.$.courseId': updatedCourseId, 'course.$.courseStatus': updatedCourseStatus } }
//     );
    
//     res.send(result);
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };


const getCourseStatus = async(req,res) => {
  try {
    const course = await Course.findOne({_id:req.params.id});
    if (!course) {
      return res.status(404).send("Course not found");
    }
    res.status(200).json({ status: course.status });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
}
// const getCourseStatus = async (req, res) => {  
//   try {
//     const { userId, courseId } = req.params;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).send("User not found");
//     }

//     const course = user.courses.find(course => course.courseId.equals(courseId));
//     if (!course) {
//       return res.status(404).send("Course not found for this user");
//     }

//     res.status(200).json({ status: course.courseStatus });
//   } catch (error) {
//     console.error(error);
//     res.status(500).send("Internal Server Error");
//   }
// };

module.exports = {userRegister,userSigin,getMembers,dellMember,updateSingleMember,getSingleMember,getFalseStausCources,getTrueStausCources, userInfo,userRegisterOtp,updateCourseStatus,getCourseStatus}