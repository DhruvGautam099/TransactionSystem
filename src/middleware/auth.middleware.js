const userModel=require("../models/user")
const jwt=require("jsonwebtoken")

async function authMiddleware(req,res,next){
    const token=req.cookies.token||req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized"
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

module.exports=authMiddleware