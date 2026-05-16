const mongoose=require("mongoose")


function connectToDB(){
    mongoose.connect(process.env.MONGO_URI)
    .then(()=>{
        console.log("DataBase connected succesfully")
    }).catch(err=>{
        console.log("Error connecting to DB")
        process.exit(1)
    })
}

module.exports=connectToDB