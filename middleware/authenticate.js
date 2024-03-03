const jwt=require("jsonwebtoken");
const userdb=require("../models/userSchema");
const keySecret='vyomgangwarakarshgangwarakagargangwar';

const authenticate=async(req,resp,next)=>{
try{
    const token = req.headers.authorization;
    // console.log(token)
    const verification = jwt.verify(token,keySecret);
    // console.log(verification)
    const rootUser = await userdb.findOne({_id:verification._id})
    // console.log(rootUser)

    if(!rootUser)
    {
      throw new Error("user not found")
    }
    req.token = token
        req.rootUser = rootUser
        req.userId = rootUser._id
        next();
}
catch(error){
    resp.status(401).json({status:401,message:"Unauthorized no token provide"})
}

}
module.exports = authenticate