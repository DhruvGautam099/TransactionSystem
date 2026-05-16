const mongoose=require("mongoose")
const bcrypt=require("bcryptjs")


const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:[true,"Email is necessary"],
        trim:true,
        lowercase:true,
        match:[/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
        unique:[true,"Email already exists"]
    },
    name:{
        type:String,
        required:[true,"Please Enter Name"]
    },
    password:{
        type:String,
        required:[true,"Please password required"],
        minlength:[6,"Password cannot be < 6"],
        select:false,
    }
},
{
    timestamps:true
})

userSchema.pre("save",async function(next){
    if(!this.isModified(password)){
        return next()
    }
    const hash = await bcrypt.hash(this.password,10)
    this.password=hash
    next()
})

userSchema.methods.comparePassword=async function (password){
    return await bcrypt.compare(password,this.password)
}

const userModel=mongoose.model("user",userSchema)
module.exports=userModel