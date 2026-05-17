const mongoose=require("mongoose")
const userModel=require("./user")

const accountSchema=new mongoose.Schema({
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"user",
        required:[true,"User id is required for account creation"],
        index:true
    },
    status: {
    type: String,
    enum: {
      values: ['FROZEN', 'ACTIVE', 'CLOSED'], // <-- Only one set of brackets here
      message: 'Status can only be FROZEN, ACTIVE or CLOSED'
    },
    default: 'ACTIVE'
  },
    currency:{
        type:String,
        required:[true,"Please provide currency"],
        default:"INR"
    }
},
{
    timestamps:true
})

accountSchema.index({user:1,status:1})


const accountModel=mongoose.model("account",accountSchema)
module.exports=accountModel
