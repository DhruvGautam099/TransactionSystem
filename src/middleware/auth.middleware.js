const userModel=require("../models/user")
const blacklistModel = require("../models/blacklist")
const jwt=require("jsonwebtoken")

async function authMiddleware(req,res,next){
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
        })
    }
    const isBlacklisted = await blacklistModel.findOne({ token })
    if (isBlacklisted) {
        return res.status(401).json({
            message: "This user is logged out, please log in again"
        })
    }
    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findById(decoded.userId)
        if(!user){
            return res.status(401).json({
                message:"Unauthorized"
            })
        }
        req.user=user
        next()

    }catch(err){
        console.log(err.message)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
}

async function systemUserMiddleware(req, res, next) {
    const token = req.headers.authorization?.split(" ")[1] || req.cookies.token

    if (!token) {
        return res.status(401).json({
            message: "Unauthorized"
        })
    }
    const isBlacklisted = await blacklistModel.findOne({ token })
    if (isBlacklisted) {
        return res.status(401).json({
            message: "This user is logged out, please log in again"
        })
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        const user = await userModel.findById(decoded.userId).select("+systemUser")
        if (!user.systemUser) {
            return res.status(403).json({
                message: "Only System User can perform this action"
            })
        }
        req.user = user
        return next()

    } catch (err) {
        console.log(err.message)
        return res.status(401).json({
            message: "Unauthorized"
        })
    }


}

module.exports = { authMiddleware, systemUserMiddleware }