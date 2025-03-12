const express=require("express")
const app=express();

const port=3000

app.set("view engine","ejs")

const names={
    "firstname":"naseefa",
    "lastname":"riyas"
}
const courses=[
    {

    'title':'html',
    'description':'frontend'
    },
    {

        'title':'javascript',
        'description':'frontend'
    },
    {

        'title':'node.js',
        'description':'backend'
    },
    {

        'title':'css',
        'description':'frontend'
   },
   {

    'title':'express',
    'description':'framework'
   },
   {

    'title':'mongo DB',
    'description':'database'
}
]

app.get("/",(req,res)=>{
    res.render("pages/home",{values:names})
})

app.get("/courses",(req,res)=>{
    res.render("pages/course",{courses:courses})
})

app.listen(port,()=>{
    console.log("App listening");
})