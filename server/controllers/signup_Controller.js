const user_Data = require("../models/userModel")
const bcrypt = require("bcrypt")

exports.signup = async function (req, res, next) {
    try{
        const { username, email , password , confirmPassword } = req.body;

        //Avoid  Empty data from user
        if (!username || !password || !confirmPassword || !email) {
            return res.status(400).json({
                msg: "DAta is required "
             }) }

              //Aviod  same user  to signup
        const userExists = await user_Data.findOne({  $or: [{ email }, { username }]  })
        if (userExists) {
            return res.status(400).json({
                msg: "User Already exist"
             }) }

             //PAsswor & confirm Password must be same
        if(password !== confirmPassword){
            return res.status(400).json({
                msg : "Password doesnot match"
            })
        }

         //Create a new User
         const salt = await bcrypt.genSalt(10);
         const hashedPassword = await bcrypt.hash(password, salt);
         const user = new user_Data({ username, password:hashedPassword ,email});
         await user.save()
         console.log(username, password)
 
         return res.status(201).json({
             msg:"User created successfully"
         })

    }catch(err){
        console.error(err)
        return res.status(500).json({
            msg: "Internal server error."
        });
    }
}