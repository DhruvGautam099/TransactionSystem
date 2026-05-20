const mongoose=require("mongoose")


const TokenBlacklistSchema=new mongoose.Schema({
    token:{
        type:String,
        required:[true,"Token is required"],
        unique:[true,"Token is already blacklisted"],
    }
},{
    timestamps:true
})

TokenBlacklistSchema.index({createdAt:1},{expireAfterSeconds: 3*24*60*60})

const TokenBlacklistModel=mongoose.model("TokenBlacklist",TokenBlacklistSchema)
module.exports=TokenBlacklistModel