const userModel=require("../models/user")
const jwt=require("jsonwebtoken")
const emailService=require("../services/email")
const blacklistModel = require("../models/blacklist")
async function userRegisterController(req,res){
    const {email,name,password}=req.body;
    const isExists=await userModel.findOne({
        email:email
    })
    if(isExists){
        return res.status(422).json({
            message:"user already exists with e mail",
            status:"failed"
        })
    }
    const user=await userModel.create({
        email,name,password
    })

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token",token)
    res.status(201).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })
    await emailService.sendRegistrationEmail(user.email,user.name);
}


async function userLoginController(req,res){
    const {email,password}=req.body
    const user=await userModel.findOne({email}).select("+password")

    if(!user){
        return res.status(401).json({
            message:"User not found"
        })
    }

    const isValidPassword=await user.comparePassword(password)

    if(!isValidPassword){
        return res.status(401).json({
            message:"Email or password invalid"
        })
    }

    const token=jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn:"3d"});
    res.cookie("token",token)
    res.status(200).json({
        user:{
            _id:user._id,
            email:user.email,
            name:user.name
        },
        token
    })

}

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(" ")[1]
    if (!token) {
        return res.status(400).json({
            message: "no token found"
        })
    }

    try {
        const isBlacklisted = await blacklistModel.findOne({ token })
        if (!isBlacklisted) {
            await blacklistModel.create({ token })
        }
    } catch (error) {
        console.log("Logout error:", error.message)
    }

    res.clearCookie("token")
    return res.status(200).json({
        message: "Logged out successfully"
    })



}

module.exports={
    userRegisterController,
    userLoginController,
    userLogoutController
}