const express = require("express");
const userdb=require("../models/userSchema")
const router = new express.Router();
const bcrypt=require('bcryptjs')
const authenticate=require("../middleware/authenticate")

router.use(express.json()); 
 

// Route for user registration

router.post("/register", async (req, resp) => {
    
    // Extract data from the request body
    //console.log(req.body);
    const { fname, email, password, cpassword } = req.body;
    
    try {
        
        const preuser = await userdb.findOne({ email: email });
        if (preuser) {
            return resp.status(422).json({ error: "User already exists!!" });
        }

        const finalUser = new userdb({
            fname: fname,
            email: email,
            password: password,
            cpassword:cpassword
        });
            

        //password hashing
       const storeData= await finalUser.save();
        
        return resp.status(201).json({status:201,storeData}); 
    } catch (error) {
        console.error("Error occurred during registration:", error);
        return resp.status(500).json({ error: "An error occurred during registration" });
    }
});

// Route for user registration

router.post("/login",async(req,resp)=>{
   // console.log(req.body)
   const{email,password}=req.body;
   try{
    const userValid=await userdb.findOne({email:email});
    if(userValid)
    {
        const isMatch= await  bcrypt.compare(password,userValid.password)

        if(!isMatch)
        {
            return resp.status(422).json({ error: "invalid data" });
        }
        else{
            //if match that is registered successfully then generate token
            // for token generation there is a secret key and a payload and add cookie
            const token = await userValid.generateAuthtoken();
          //  console.log(token)

          // cookiegeneration
          resp.cookie("usercookie",token,{
          expires:new Date(Date.now()+9000000),
          httpOnly:true
          })

         //send user and cookie to frontend
          const result={
            userValid,
            token
          }
          resp.status(201).json({status:201,result})
        }
    }

   } catch{

   }
})

router.get("/validUser",authenticate, async(req,resp)=>{
    try {
        const ValidUserOne = await userdb.findOne({_id:req.userId});
        resp.status(201).json({status:201,ValidUserOne});
    } catch (error) {
        resp.status(401).json({status:401,error});
    }

})


//user logout

router.get("/logout", authenticate,async(req,resp)=>{
    try{
        req.rootUser.tokens= req.rootUser.tokens.filter((currelem)=>{
            return currelem.token !== req.token
        })

        resp.clearCookie("usercookie",{path:"/"});
        req.rootUser.save();
        resp.status(201).json({status:201})
        
    }
    catch(error){
        resp.status(201).json({status:401 , error})
    }

})

router.get("/",async(req,resp)=>{
    resp.send("hello world")
})

module.exports = router;
