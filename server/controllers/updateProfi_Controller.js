const userModel = require("../models/userModel")
const jwt = require('jsonwebtoken');

exports.update_profile = async function (req, res) {
    try {
        const { updated_username } = req.body;

        //if user not send otp
        if (!updated_username) {
            return res.status(400).json({
                msg: "userName is required."
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
            });}


        user.username = updated_username
        await user.save();
        return res.status(200).json({
            msg: "username updated successfully!"
        });

    } catch (err) {
        console.log(err)
        return res.status(500).json({
            msg: "internal server error"
        })
    }
}