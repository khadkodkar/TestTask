const express = require('express')
const router = express.Router();
let { verifyTokenFn } = require("../helper/jwt");
//--------------- Controller ---------------
const controller = require('../controller/Usercontroller')

//--------------- Routes ---------------
router.post('/userRegister',controller.userRegister);
router.post('/login',controller.Login);
router.post('/userUpdate',verifyTokenFn,controller.userUpdate);
router.post('/userAddress',verifyTokenFn,controller.userAddress);
router.get('/userList',verifyTokenFn,controller.userList);
router.get('/uploadImage',verifyTokenFn,controller.UploadImage);
module.exports = router