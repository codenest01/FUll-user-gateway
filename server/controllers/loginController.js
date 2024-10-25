const bcrypt = require("bcrypt")
const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { sendMail } = require('../utils/mailer.js');

exports.login = async function (req, res) {
    try {
        const { email, password } = req.body;

        // Check if username and password are provided
        if (!email || !password) {
            return res.status(400).json({
                msg: "Username and password are required."
            });
        }

        //Check user existance
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(400).json({
                msg: "User not exist"
            })
        }

        //Check user password
        const matchPAssword = await bcrypt.compare(password, user.password)
        if (!matchPAssword) {
            return res.status(400).json({
                msg: "password is incorrect"
            })
        }

        //check user if not verified
        if (user.isVerified == false) {
            const currentTime = new Date();

            // Check if lastOtpRequestAt exists and if the difference is less than 10 seconds
            if (user.lastOtpRequestAt && (currentTime - user.lastOtpRequestAt) < 10000) {
                // If the difference is less than 10 seconds, reject the request
                return res.status(429).json({
                    msg: "Too many requests. Please wait before requesting another OTP."
                });
            }

            //send an otp to user

             // Generate a unique session token (nonce)
            const sessionToken = crypto.randomBytes(16).toString('hex');
            const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
            const hashedOtp = await bcrypt.hash(otp, 10);
            user.verifyCode = hashedOtp;
            user.sessionToken = sessionToken;
            user.verifyCodeCreatedAt = currentTime;
            user.lastOtpRequestAt = currentTime;


            sendMail(user.email, 'Account  verification', `Hello ${user.username},Your OTP code is: ${otp}. It will expire in 5 minutes. `)
                .then(() => {
                })
                .catch((error) => {
                    console.error('Error sending login email:', error);
                });


            await user.save()
             // Sign a JWT that includes the session token
             const jwtToken = jwt.sign(
                { sessionToken: sessionToken }, // Include session token in the payload
                process.env.JWT_SECRET,
                { expiresIn: '12h' }
            );

            return res.status(200).json({
                msg: "Verification code sent.",
                token: jwtToken // Send the JWT back to the client
            });
            
        }


        //login success
        const jwtToken = jwt.sign(
            { email: user.email, _id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '12h' })
        return res.status(200).json({
            msg: "Logged in success",
            token: jwtToken
        })


    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}