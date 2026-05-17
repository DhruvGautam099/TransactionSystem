const mongoose =require("mongoose")

const ledgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"account",
        required:[true,"Account is required"],
        immutable:true
    },
    amount:{
        type:Number,
        required:[true,"Amount is required"],
        immutable:true 
    },
    transactionId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"transaction",
        required:[true,"Transaction id is required"],
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT","CREDIT"],
            message:"Type can only be DEBIT or CREDIT"
        },
        required:[true,"Type is required"],
        immutable:true
    }
    
},{
    timestamps:true
})

function preventLedgerModification(){
    throw new Error("Ledger cannot be modified")
}
ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
ledgerSchema.pre("findOneAndReplace",preventLedgerModification)
ledgerSchema.pre("findOneAndDelete",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("updateMany",preventLedgerModification)
ledgerSchema.pre("deleteMany",preventLedgerModification)
ledgerSchema.pre("replaceOne",preventLedgerModification)
ledgerSchema.pre("replaceMany",preventLedgerModification)



const ledgerModel=mongoose.model("ledger",ledgerSchema)
module.exports=ledgerModel