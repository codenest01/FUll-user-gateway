const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");
const jwt = require('jsonwebtoken');

exports.verify = async function (req, res) {
    try {
        const { otp } = req.body;

        // Get the JWT token from the Authorization header
        const token = req.headers.authorization?.split(" ")[1]; // Extract the token after "Bearer "

        // Validate input
        if (!otp ) {
            return res.status(400).json({ msg: "OTP and session token are required." });
        }

        // Verify the JWT to extract the session token
        let sessionToken;
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            sessionToken = decoded.sessionToken; // Get the session token from the decoded JWT
        } catch (error) {
            return res.status(401).json({ msg: "Invalid token." });
        }

        // Find the user by session token
        const user = await userModel.findOne({ sessionToken });
        if (!user) {
            return res.status(404).json({ msg: "Invalid session token." });
        }

        // Check if the OTP is expired (e.g., more than 5 minutes)
        const currentTime = new Date();
        if (currentTime - user.verifyCodeCreatedAt > 300000) { // 5 minutes in milliseconds
            return res.status(400).json({ msg: "OTP has expired. Please request a new OTP." });
        }

        // Compare the provided OTP with the stored hashed OTP
        const otpMatch = await bcrypt.compare(otp, user.verifyCode);
        if (!otpMatch) {
            return res.status(400).json({ msg: "Invalid OTP." });
        }

        // If OTP is valid, update user verification status
        user.isVerified = true;
        user.verifyCode = null; // Clear the OTP
        user.sessionToken = null; // Clear the session token
        await user.save();

        return res.status(200).json({ msg: "Account verified successfully." });

    } catch (err) {
        console.log(err);
        return res.status(500).json({ msg: "Internal server error." });
    }
};
