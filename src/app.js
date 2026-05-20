const express=require("express")
const authRouter = require("./routes/auth")
const accountRouter = require("./routes/Account")
const TransactionRouter = require("./routes/Transaction")
const cookieParser = require("cookie-parser")
const app=express();
app.use(express.json())
app.use(cookieParser())

app.use("/api/auth", authRouter)
app.use("/api/accounts", accountRouter)
app.use("/api/transactions", TransactionRouter)

module.exports=app