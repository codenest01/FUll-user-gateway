const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');

exports.dashboard = async function (req, res) {
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
         });}

         return res.status(200).json({
            msg: "User found",
            username: user.username,
            email: user.email
        });
}