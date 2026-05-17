const accModel=require("../models/account")

async function createAccount(req,res){
    const user=req.user
    const account=await accModel.create({
        user:user._id
    })
    res.status(201).json({
        status:"success",
        account
    })
}
module.exports={
    createAccount
}