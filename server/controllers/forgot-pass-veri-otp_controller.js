const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');

exports.forgot_pass_veri_otp = async function (req, res) {

    try {
        const { otp, password } = req.body;
        //if user not send otp
        if (!otp || !password) {
            return res.status(400).json({
                msg: "OTP code and new password are required."
            });
        }

        // Get token from the request headers
        const token = req.headers.authorization?.split(" ")[1];
        // Decode the token to get user information
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const userId = decoded._id; // Extract user ID from token

        // Find the user by ID
        const user = await userModel.findById(userId);

        // Check if user exists
        if (!user) {
            return res.status(404).json({
                msg: "User not found."
            });
        }


        // Compare the provided OTP with the hashed OTP stored in the database
        const otpMatch = await bcrypt.compare(otp, user.verifyCode);

        if (!otpMatch) {
            return res.status(400).json({
                msg: "Wrong OTP found."
            });
        }



        //update user password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        user.password = hashedPassword
        user.verifyCode = null;
        await user.save();

        return res.status(200).json({
            msg: "password updated successfully!"
        });


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "internal server error"
        })
    }

}