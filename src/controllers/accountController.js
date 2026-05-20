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
async function getAccounts(req, res) {
    const accounts = await accModel.find({
        user: req.user._id
    })
    res.status(200).json({
        accounts
    })
}
async function getBalance(req, res) {
    const { id: account_id } = req.params
    const account = await accModel.findOne({ _id: account_id, user: req.user._id })
    if (!account) {
        return res.status(404).json({
            status: "error",
            message: "Account not found"
        })
    }
    const balance = await account.getBalance()
    return res.status(200).json({
        account_id: account._id,
        balance: balance
    })

}
module.exports={
    createAccount,
    getAccounts,
    getBalance
}