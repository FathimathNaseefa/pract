const User=require("../models/userModel")
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")
const randormstring=require("randomstring")

const securePassword=async(password)=>{

    try{
        const passwordHash=await bcrypt.hash(password,10);
        return passwordHash;
    }catch(error){
        console.log(error.message)
    }
}

const sendVerifyMail=async(name,email,user_id)=>{

    try{
        const transporter= nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"naseefabroto@gmail.com",
                pass:"saob uauj lxkm grcw"
            }
        });
        const mailOptions={
            from:"naseefabroto@gmail.com",
            to:email,
            subject:"For Verification mail",
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/verify?id='+user_id+'">Verify </a>your mail.</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent:- ",info.response)
            }
        })
    }catch(error){
        console.log(error.message)
    }
}


const sendResetPasswordMail=async(name,email,token)=>{

    try{
        const transporter= nodemailer.createTransport({
            host:"smtp.gmail.com",
            port:587,
            secure:false,
            requireTLS:true,
            auth:{
                user:"naseefabroto@gmail.com",
                pass:"saob uauj lxkm grcw"
            }
        });
        const mailOptions={
            from:"naseefabroto@gmail.com",
            to:email,
            subject:"For Reset Password",
            html:'<p>Hii '+name+', please click here to <a href="http://127.0.0.1:3000/forget-password?token='+token+'">Reset </a>your password.</p>'
        }
        transporter.sendMail(mailOptions,function(error,info){
            if(error){
                console.log(error)
            }else{
                console.log("Email has been sent:- ",info.response)
            }
        })
    }catch(error){
        console.log(error.message)
    }
}

const loadRegister=async(req,res)=>{
    try{

        res.render("registration")
    }catch(error){
        console.log(error.message)
    }
}
const insertUser=async(req,res)=>{
    try{
        const spassword=await securePassword(req.body.password);
        const user=new User({
            name:req.body.name,
            email:req.body.email,
            mobile:req.body.mno,
            image:req.file.filename,
            password:spassword,
            is_admin:0
        })

        const userData=await user.save();

        if(userData){
            sendVerifyMail(req.body.name,req.body.email,userData._id)

            res.render("registration",{message:"Your registration has been successfully.Please verify your mail"})
        }else{
            res.render("registration",{message:"Your registration has failed"})

        }
    }catch(error){
        console.log(error.message)
    }
}

const verifyMail=async(req,res)=>{

    try{

       const updateInfo=await User.updateOne({_id:req.query.id},{$set:{ is_verified:1}})
       console.log(updateInfo)
       res.render("email-verified");
    }catch(error){
        console.log(error.message)
    }
}

const loginLoad=async(req,res)=>{

    try{
        res.render("login")
    }catch(error){
        console.log(error.message)
    }
}

const verifyLogin=async(req,res)=>{

    try{

        const email=req.body.email;
        const password=req.body.password;

        const userData=await User.findOne({email:email})
    

        if(userData){

            const passwordMatch=await bcrypt.compare(password,userData.password)
            if(passwordMatch){
                if(userData.is_verified ===0){
                    res.render("login",{message:"Please verify your email"})
                    
                }else{
                    
                    console.log(userData._id);
                    req.session.user_id=userData._id;
                
                    res.redirect("/home")
                    
                    
                }


            }else{
                res.render("login",{message:"email and password is incorrect"})
            }
        }else{
            res.render("login",{message:"Email and password is incorrect"})
        }
    }catch(error){
        console.log(error.message)
    }
}

const loadHome=async(req,res)=>{
    try{
        const userData=await User.findById({_id:req.session.user_id})
        


        res.render("home",{user:userData})
    }catch(error){
        console.log(error.message)
    }
}

const userLogout=async(req,res)=>{

    try{
        req.session.destroy();
        res.redirect("/");

    }catch(error){
    console.log(error.message)
}}

const forgetLoad=async(req,res)=>{
    try{


        res.render("forget")
    }catch(error){
        console.log(error.message)
    }
}
const forgetVerify=async(req,res)=>{
    try{

        const email=req.body.email;
        const userData=await User.findOne({email:email})
        if(userData){
            if(userData.is_verified === 0){
                res.render("forget",{message:"Please verify your email."})

            }else{
                const randomString=randormstring.generate();
                const updatedData= await User.updateOne({email:email},{$set:{token:randomString}})
                sendResetPasswordMail(userData.name,userData.email,randomString)
                res.render("forget",{message:"Please check your email to reset your password"})

            }
            

        }else{
            

            res.render("forget",{message:"User email is incorrect."})
        }


        res.render("forget")
    }catch(error){
        console.log(error.message)
    }
}

const forgetPasswordLoad=async(req,res)=>{
    try{
        const token=req.query.token;
        const tokenData=await User.findOne({token:token})
        if(tokenData){
            res.render("forget-password",{user_id:tokenData._id})
        }else{
            res.render("404",{message:"Token is invalid"})
        }
    }catch(error){
        console.log(error.message)
    }
}
const resetPassword=async(req,res)=>{
    try{
        const password=req.body.password;
        const user_id=req.body.user_id;
        const secure_password=await securePassword(password)
        const updatedData=await User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:""}})
        res.redirect("/")
    }catch(error){
        console.log(error.message)
    }
}
const verificationLoad=async(req,res)=>{
    try{


        res.render("verification")
    }catch(error){
        console.log(error.message)
    }
}
const sentVerificationLink=async(req,res)=>{
    try{

        const email=req.body.email;
        const userData=await User.findOne({email:email})
        if(userData){
            sendVerifyMail(userData.name,userData.email,userData._id)
            res.render("verification",{message:"Reset verification mail sent your mail id,please check"})
        }else{
            res.render("verification",{message:"this email not exist"})

        }
    }catch(error){
        console.log(error.message)
    }}

    const editLoad=async(req,res)=>{
        try{
            const id=req.query.id;
            const userData=await User.findById({_id:id})

            if(userData){
                res.render("edit",{user:userData})
            }else{
                res.redirect("/home")
            }
            
        }catch(error){
            console.log(error.message)
        }
    }

    const updateProfile=async(req,res)=>{
        try{
            if(req.file){
                const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno,image:req.file.filename}})

            }else{
               const userData= await User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name,email:req.body.email,mobile:req.body.mno}})

            }
            res.redirect("/home")

        }catch(error){
            console.log(error.message)
        }
    }




module.exports={
    loadRegister,
    insertUser,
    verifyMail,
    loginLoad,
    verifyLogin,
    loadHome,
    userLogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    sentVerificationLink,
    editLoad,
    updateProfile
}