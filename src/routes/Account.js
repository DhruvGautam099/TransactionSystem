const express=require("express")
const authMiddleware=require("../middleware/auth.middleware")
const accountController=require("../controllers/accountController")
const router=express.Router()

router.post("/", authMiddleware.authMiddleware, accountController.createAccount)

router.get("/", authMiddleware.authMiddleware, accountController.getAccounts)

router.get("/balance/:id", authMiddleware.authMiddleware, accountController.getBalance)

module.exports=router