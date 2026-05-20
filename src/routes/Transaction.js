const {Router}=require("express")
const TransactionRouter=Router()
const authMiddleware=require("../middleware/auth.middleware")
const transactionController=require("../controllers/transactionController")

TransactionRouter.post("/",authMiddleware.authMiddleware,transactionController.createTransaction)

TransactionRouter.post("/system-transaction",authMiddleware.systemUserMiddleware,transactionController.systemTransaction)

module.exports=TransactionRouter