const mongoose = require('mongoose');
const User = require('../models/user');
const Address = require('../models/address');
const bcrypt = require("bcryptjs");
const { issueJWT } = require("../helper/jwt");

//---------------- userRegister ----------------
module.exports.userRegister = async(req, res) => {
    try {
        let {
            body:{
            email,    
            name,
            image,
            password
            }
        }=req;
        let UserDetail=await User.find({email:email});
        if(UserDetail.length==0|| UserDetail==null){
            let hashpassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
            let user=new User({
                email:email,
                password:hashpassword,
                name:name,
                image:image
            })
            let userDetail = await user.save();
            if(userDetail){
                res.status(200).json({
                    status:true,
                    message:"User insert successfully"
                })
            }
        }else{
            res.status(404).json({
                status:false,
                message:"User already exits"
            })
        }
    } catch (error) {
        const Data = {
            status: false,
            message: "something went wrong"
        }
        res.status(400).send(Data)
    }
}

//---------------- Login ----------------
module.exports.Login = async (req, res) => {
    try {
        let {
            body:{
                email,
                password
            }
        }=req;
        let  userDetail = await User.findOne({
            'email': email
        })
        if( userDetail != null) {
            let compare = await bcrypt.compare(password, userDetail.password);
            if(compare==true){
                let token =await issueJWT(userDetail);
                userDetail.token=token;
                res.status(200).json({
                    status  : true,
                    message : "User login successfully",
                    data    : userDetail,
                    token   : token
                })
            }else{
                res.status(404).json({
                    status:false,
                    message:"password not match"
                })
            }
        }else{
            res.status(404).json({
                status:false,
                message:"user not exist"
            })
        }
    } catch (error) {
        const Data = {
            'success': false,
            'message': "something went wrong"
        }
        res.status(400).send(Data)
    }
}

//---------------- userUpdate ----------------
module.exports.userUpdate = async (req, res) => {
    try {
        console.log(req.user)
        let {
            body:{
                email,
                name,
                image
            },
            user:{
                id
            }
        }=req;
        console.log(id)
        let  userDetail = await User.findOne({'_id':id })
        console.log(userDetail)
        if(userDetail!=null){
            let  userDetail = await User.updateOne({'_id':id },{$set:{email:email,name:name,image:image}})
            res.status(200).json({
                status  :true,
                message :"User detail updated successfully"
            })
        }else{
            res.status(404).json({
                status:false,
                message:"user not exist"
            })
        }
    } catch (error) {
        const Data = {
            'success': false,
            'message': "something went wrong"
        }
        res.status(400).send(Data)
    }
}

//---------------- userAddress ----------------
module.exports.userAddress = async (req, res) => {
    try {
        let {
            body:{
                type,
                city,
                pin,
                state,
            },
            user:{
                id
            }
        }=req;
        let userAddress = new Address({
            user_id:id,
            type:type,
            city:city,
            pin:pin,
            state:state
        });
        let userAddressDetail=await userAddress.save();
        if(userAddressDetail){
            let t =await  User.updateOne({_id:id},{$push:{address:userAddressDetail._id}})            
            res.status(200).json({
                status:true,
                message:"User address add successfully",t 
            })
        }else{
            res.status(404).json({
                status:false,
                message:"Something went wrong"
            })
        }
    } catch (error) {
        const Data = {
            'success': false,
            'message': "something went wrong"
        }
        res.status(400).send(Data)
    }
}

//---------------- userList ----------------
module.exports.userList = async (req, res) => {
    try {
        let {
            user:{
                id
            }
        }=req;
        let userDetail=await User.findOne({"_id":id},{"_id":1,"name":1,"image":1}).populate('address');
        res.status(200).json({
            status  : true,
            message : "Record found successfully.",
            data    : userDetail
        })
    } catch (error) {
        const Data = {
            'success': false,
            'message': "something went wrong"
        }
        res.status(400).send(Data)
    }
}

//---------------- UploadImage ----------------

var multer = require("multer");

var upload = multer({ dest: "upload/"});

var storage = multer.diskStorage({
  destination: function (req, file, cd) {
      cd(null, "upload/");  
  },

  filename: function (req, file, cd) {
    var str = file.originalname;
    var dotIndex = str.lastIndexOf(".");
    var ext = str.substring(dotIndex);
    var val = ext.split(".")[1];
    cd(null, Date.now() + "-image." + val);
  },
});

var upload = multer({
  storage: storage,
}).any("");

module.exports.UploadImage = async (req, res) => {
    try {
        upload(req, res, async (err) => {
            var imagename = req.files;      
            path = await imagename.map((data) => {
            return data.filename;
            });
            res.status(200).json({
            success: true,
            message: "Image upload successfully",
            data: 'http://localhost:4000/'+path,
            });
        });
    } catch (error) {
        const Data = {
            'success': false,
            'message': "something went wrong"
        }
        res.status(400).send(Data)
    }
}