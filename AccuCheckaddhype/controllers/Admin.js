const express = require('express');
const Products = require('../models/productSchema');
const Course = require('../models/courseSchema')
const admin = require('../models/admin')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const app= express();


const adminSigin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Not Empty Fields' });
    }

    const adminLogin = await admin.findOne({ email: email });

    if (adminLogin) {
      const isMatched = await bcrypt.compare(password, adminLogin.password);

      if (!isMatched) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      } else {
        // If credentials are validate true then, generate a JWT token here
        const token = jwt.sign({ adminId: adminLogin._id }, 'pakistan009', {
          expiresIn: '1h' // Token will expire in 1 hour
        });
        console.log(token);
        // Set the token as an HTTP-only cookie
        res.cookie('jwtToken', token, {
          maxAge: 3600000, // Token expiration time in milliseconds (1 hour)
          httpOnly: true,
        });

        res.json({ message: 'Login Successful' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};


// admin Register
const adminRegister = async (req, res) => {
  const { email, password } = req.body;
  if (!email  || !password)  
  {
      return res.status(422).json({ error: 'Please enter all required fields' });
  }
  try {
      const adminExists= await admin.findOne({ email: email })
      if (adminExists) 
      {
        return res.status(422).json({ error: 'Email already exists' });
      }
      else
      {
        const adminC = new admin({ email, password,});
        // Encrypt the password befor saved
        await adminC.save();
        res.status(201).json({ message: 'Successfully admin created' });
      }
    } 
    catch (error) 
    {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Something went wrong' });
    };
};


// use this controler for multer to handle images/vedios i will combine into old
const addCources = async (req, res) => {
  const { name, id, discription, points, status, duration, url } = req.body;
  if (!name || !id || !discription || !points || !status || !duration || !url) 
  {
      return res.status(422).json({ error: 'Please enter all required fields' });
  }
  try {
    const { name, id, discription, points, status, duration, url } = req.body;
    const courseExict= await Course.findOne({ id : id })
    if (courseExict) {
         return res.status(422).json({ error: 'This course is already exists' });
    }
    else{
      const image = req.file.filename;
      const newCourse = new Course({
        name,
        id,
        discription,
        points,
        status,
        duration,
        image,
        url
      });
      // Return true if cource add return fale if not sucessfull
      console.log(newCourse instanceof Course); 
      await newCourse.save();
      res.status(201).send({
        success: true,
        message: "Course added successfully",
        Course: Course  
      });
  }
    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add course" });
  }
};




// Add product Images in db
const addProduct = async (req, res) => {
  const { title, id, description, points,category } = req.body;

  if (!title || !id || !description || !points || !category ) {
           // Unprocessable Entity 
          return res.status(422).json({ error: 'Please enter all required fields of products' });
    }
  
  try {
        const { title, id, description, points,category } = req.body;
        const productExict= await Products.findOne({ id:id })

        if (productExict) {
                // 422 (Unprocessable Entity)
                return res.status(422).json({ error: 'Product id already exists' });
              }else{
                // if image not upload from client side 500 (Internal Server Error)
                // Cannot read properties of undefined (reading 'filename') server not accepeted
                let image = req.file.filename;
                let newProducts = new Products({
                    title,
                    id,
                    description,
                    points,
                    category,
                    image,
                  });
                  // Return true if product add return fale if not sucessfull
                  console.log(newProducts instanceof Products); 
                  await newProducts.save();
                  res.status(201).send({
                    success: true,
                    message: "Product added successfully",
                    Products: Products  
                  });
            }

    
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to add Product" });
  }
};



// Get all products from DB
const getProducts = async (req, res) => {
    let data = await Products.find();
    console.log(data);
    data.length > 0 ? res.send(data) : res.send("<h1>No data</h1>");
};

// Delete Product from DB
const dellProduct = async (req, res) => {
    let dellCoourse = await Products.deleteOne({ _id: req.params._id  });
    if(dellCoourse)
    {
      res.status(201).json({ message: 'Successfully Product Delete' });
    }else{
      res.status(201).json({ message: 'Error while deleted' });
    }
};

// Add Product in DB
// const addProduct = async (req, res) => {
//     const { title, id, description, points } = req.body;
//     if (!title || !id || !description || !points) {
//       return res.status(422).json({ error: 'Please enter all required fields of products' });
//      }
    
//       try {
//         const productExict= await Products.findOne({ id:id })
  
//         if (productExict) {
//           return res.status(422).json({ error: 'Product id already exists' });
//         }else{
//           const product = new Products({ title, id, description, points });
//           await product.save();
//           res.status(201).json({ message: 'Successfully Product Inserted' });
//         }
        
//       } catch (error) {
//         console.error(error); // Log the error for debugging
//         res.status(500).json({ error: 'Something went wrong' });
//       };
// };
// Update Product
const updateSingleProduct = async (req, res) => {
  let result = await Products.updateOne(
    { _id: req.params._id },
    { $set: req.body }
  );
      res.send(result);
};


// get Single Product Update
const getSingleProduct = async (req, res) => {
  let result = await Products.findOne({ _id: req.params.id });
  res.send(result);
};

// Cources Operation 

// Get All Cources
const getCources = async (req, res) => {
    let data = await Course.find();
    console.log(data);
    data.length > 0 ? res.send(data) : res.send("No data");
};


// Add cources into DB
// const addCources = async (req, res) => {
//     const { name, id, discription,points, status, duration, url } = req.body;
    
//     if (!name || !id || !discription || !points || !status || !duration || !url) {
//         return res.status(422).json({ error: 'Please enter all required fields' });
//      }
//      try {
//       const courseExict= await Course.findOne({ id : id })

//       if (courseExict) {
//         return res.status(422).json({ error: 'This course is already exists' });
//       }else{
//         const course = new Course({ name, id, discription, points, status, duration, url });
//         await course.save();
//         res.status(201).json({ message: 'Successfully Course Created' });
//       }
      
//     } catch (error) {
//       console.error(error); // Log the error for debugging
//       res.status(500).json({ error: 'Something went wrong' });
//     };
// };
// Dell Course
const dellCource = async (req, res) => {
    let dellCoourse = await Course.deleteOne({ _id: req.params._id  });
    if(dellCoourse)
    {
       res.status(201).json({ message: 'Successfully Course Delete' });
    }
  else{
        res.status(201).json({ message: 'Error while deleted' });
  }
};
// Update Cource
const updateCource = async (req, res) => {
  let result = await Course.updateOne(
    { _id: req.params._id },
    { $set: req.body }
  );
    res.send(result);
};


module.exports = {getProducts,dellProduct,addProduct,addCources,dellCource,
                  getCources,getSingleProduct,updateSingleProduct,updateCource,adminSigin,adminRegister}