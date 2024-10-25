const user_Data = require("../models/userModel")
const bcrypt = require("bcrypt")
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer.js');
const jwt = require("jsonwebtoken")
exports.forgotpass = async function (req, res, next) {
    try {
        const { email } = req.body;
        // Check if email is provided
        if (!email) {
            return res.status(400).json({
                msg: "email is required."
            });
        }

        //Check user existance
        const user = await user_Data.findOne({ email })
        if (!user) {
            return res.status(400).json({
                msg: "User not exist"
            })
        }


        //send an Otp to user email
        const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
        const hashedOtp = await bcrypt.hash(otp, 10);
        user.verifyCode = hashedOtp;
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '10m' })
        sendMail(user.email, 'Account  verification', `Hello ${user.username},Your OTP code is: ${otp}. It will expire in 5 minutes. `)
            .then(() => {
            })
            .catch((error) => {
                console.error('Error sending login email:', error);
            });
        await user.save()
        return res.status(200).json({
            msg: "verification code sent",
            token: jwtToken
        })

       
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}