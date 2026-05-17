const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"from account is required"],
        index:true
    },
    toAccount:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"to account is required"],
        index:true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING","COMPLETED","FAILED","REVERSED"],
            message:"Status can only be PENDING, COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        min:[0,"Amount must be greater than 0"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required"],
        unique:true,
        index:true
    }
    
},{
    timestamps:true
})

const transcationModel=mongoose.model("transaction",transactionSchema)
module.exports=transcationModel