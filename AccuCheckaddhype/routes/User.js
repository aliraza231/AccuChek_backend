const express = require('express');
const router = express.Router();
const {userRegister, userSigin , getMembers,dellMember,updateSingleMember,getSingleMember,getFalseStausCources,getTrueStausCources} = require('../controllers/User')

router.route('/userRegister').post(userRegister);
router.route('/userSigin').post(userSigin);
router.route('/getMembers').get(getMembers);
router.route('/dellMember/:_id').delete(dellMember);

router.route('/getFalseStausCources').get(getFalseStausCources);
router.route('/getTrueStausCources').get(getTrueStausCources);
// Update Member
router.route('/updateSingleMember/:_id').put(updateSingleMember);
// Firt Get Member according to id 
router.route('/getSingleMember/:id').get(getSingleMember);

module.exports = router