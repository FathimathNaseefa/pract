const isLogin=async(req,resizeBy,next)=>{
    try{

        if(req.session.user_id){}
        else{
            res.redirect("/admin")
        }
        next();

    }catch(error){
        console.log(error.message);
    }
}

const isLogout=async(req,resizeBy,next)=>{
    try{
        if(req.session.user_id){
            res.redirect("/admin/home")
        }next();

    }catch(error){
        console.log(error.message);
    }
}

module.exports={

    isLogin,
    isLogout
}