const LocalStrategy=require("passport-local").Strategy
const bcrypt=require("bcrypt")

function initialize(passport){
    const authenticateUsers=async(email,password,done)=>{
        const user=getUserByEmail(email)
        if(user==null){
            return done(null,false,{messages:"No user found with that email"})
        }
        try{
            if(await bcrypt.compare(passport,user.password)){
                return done(null,user)
            }
        }catch(e){
            return done(e)
        }
    }
    passport.use(new LocalStrategy({username:"email"}))
    passport.serializeUser((user,done)=>{})
    passport.deserializeUser((id,done)=>{})
}
module.exports=initialize