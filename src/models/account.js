const mongoose=require("mongoose")
const userModel=require("./user")
const ledgerModel = require("./ledger")

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

accountSchema.methods.getBalance = async function () {
  const balanceData = await ledgerModel.aggregate([
    {
      $match: {
        account: this._id,
      }
    },
    {
      $group: {
        _id: null,
        totalDebited: {
          $sum: {
            $cond: [
              { $eq: ["$type", "DEBIT"] },
              "$amount",
              0
            ]
          }
        },
        totalCredited: {
          $sum: {
            $cond: [
              { $eq: ["$type", "CREDIT"] },
              "$amount",
              0
            ]
          }
        }
      }
    },
    {
      $project: {
        _id: 0,
        balance: {
          $subtract: ["$totalCredited", "$totalDebited"]
        }
      }
    }
  ])
  if (balanceData.length === 0) {
    return 0
  }
  return balanceData[0].balance

}

const accountModel=mongoose.model("account",accountSchema)
module.exports=accountModel
