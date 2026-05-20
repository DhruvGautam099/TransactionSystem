const transactionModel=require("../models/transaction");
const accountModel=require("../models/account");
const mongoose=require("mongoose")
const ledgerModel=require("../models/ledger");
const emailService=require("../services/email");

async function createTransaction(req,res){
    const{fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount||!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            message:"All fields are required"
        }) 
    }

    const fromUserAccount=await accountModel.findOne({
        _id:fromAccount
    })
    if(!fromUserAccount){
        return res.status(404).json({
            message:"Account not found"
        })
    }
    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })
    if(!toUserAccount){
        return res.status(404).json({
            message:"Account not found"
        })
    }
    const existingTransaction=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
    })
    if(existingTransaction){
        if(existingTransaction.status==="COMPLETED"){
            return res.status(200).json({
                message:"Transaction already completed"
            })
        }
        if(existingTransaction.status==="PENDING"){
            return res.status(400).json({
                message:"Transaction is pending, wait for completion"
            })
        }
        if(existingTransaction.status==="FAILED"){
            return res.status(400).json({
                message:"Transaction failed"
            })
        }
    }
    if(fromUserAccount.status!=="ACTIVE"||toUserAccount.status!=="ACTIVE"){
        return res.status(400).json({
            message:"Accounts must be active to create a transaction"
        })
    }
    const fromAccountBalance=await fromUserAccount.getBalance()
    if(fromAccountBalance<amount){
        return res.status(400).json({
            message:"Insufficient Balance"
        })
    }
    let transaction
    try {
        const session=await mongoose.startSession()
        session.startTransaction()
        transaction=(await transactionModel.create([{
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING"
        }], {
            session
        }))[0]
        const debitLedgerEntry=await ledgerModel.create([{
            account:fromAccount,
            type:"DEBIT",
            amount:amount,
            transactionId:transaction._id
        }], {
            session
        })
        // await(()=>{
        //     return new Promise(resolve=>setTimeout(resolve,100*1000))
    
        // })()
        const creditLedgerEntry=await ledgerModel.create([{
            account:toAccount,
            type:"CREDIT",
            amount:amount,
            transactionId:transaction._id
        }], {
            session
        })
        await transactionModel.updateOne({
            _id:transaction._id
        },{
            $set:{
                status:"COMPLETED"
            }
        },{session})
        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        console.log(error.message)
        return res.status(400).json({
            message:"Transaction failed, try again later"
        })
        
    }
    await emailService.sendTransactionEmail(req.user.email,req.user.name,amount,toAccount)
    return res.status(201).json({
        transaction: transaction,
        message:"Transaction created successfully",
    })

}
async function systemTransaction(req,res){
    const{toAccount,amount,idempotencyKey}=req.body
    if(!toAccount||!amount||!idempotencyKey){
        return res.status(400).json({
            status:"failed",
            message:"All fields are required"
        })
    }
    const toUserAccount=await accountModel.findOne({_id:toAccount})
    if(!toUserAccount){
        return res.status(404).json({
            message:"Account not found"
        })
    }
    const fromUserAccount=await accountModel.findOne({
        user:req.user._id
    })
    if(!fromUserAccount){
        return res.status(404).json({
            message:"System Account not found"
        })
    }
    
    const session = await mongoose.startSession()
    session.startTransaction()

    try{
        const transaction = await transactionModel({
            fromAccount:fromUserAccount._id,
            toAccount:toUserAccount._id,
            amount,
            idempotencyKey,
            status:"PENDING"
        })


        const debitLedgerEntry=await ledgerModel.create([{
            account:fromUserAccount._id,
            type:"DEBIT",
            amount:amount,
            transactionId:transaction._id
        }], {
            session
        })
        const creditLedgerEntry=await ledgerModel.create([{
            account:toUserAccount._id,
            type:"CREDIT",
            amount:amount,
            transactionId:transaction._id
        }], {session})  
        transaction.status="COMPLETED"
        await transaction.save({session})
        await session.commitTransaction()
        session.endSession()
        
        return res.status(201).json({
            transaction: transaction,
            message:"Transaction created successfully",
        })
    }
    catch(err){
        await session.abortTransaction()
        session.endSession()
        console.log(err.message)
        return res.status(500).json({
            message:"Internal server error"
        })
    }
    
}
module.exports={
    createTransaction,
    systemTransaction
}