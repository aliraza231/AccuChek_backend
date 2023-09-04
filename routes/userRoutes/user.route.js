const express = require('express');
const router = express.Router();
const {userRegister, userSigin , getMembers,dellMember,updateSingleMember,getSingleMember,getFalseStausCources,getTrueStausCources, userInfo,userRegisterOtp} = require('../../controllers/userControllers/user.controllers')
const multer = require('multer');
// user iamge
// router.route('/userRegister').post(userRegister);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads');
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`);
    },
  });
const upload = multer({ storage });
router.post("/userRegister", upload.single("image"), userRegister);

// end user image


// 
router.route('/userInfo/:_id').get(userInfo);


// 

router.route('/userSigin').post(userSigin);

router.route('/getMembers').get(getMembers);
router.route('/dellMember/:_id').delete(dellMember);

router.route('/getFalseStausCources').get(getFalseStausCources);
router.route('/getTrueStausCources').get(getTrueStausCources);
// Update Member
router.route('/updateSingleMember/:_id').put(updateSingleMember);
// Firt Get Member according to id 
router.route('/getSingleMember/:id').get(getSingleMember);

// otp
router.route('userRegisterOtp').post(userRegisterOtp);
// otp end



module.exports = router 