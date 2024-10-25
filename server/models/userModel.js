const mongoose = require('mongoose');


const registerSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  sessionToken:String,
  verifyCode: String,
  verifyCodeCreatedAt: Date,   // Tracks when the verifyCode was created
  lastOtpRequestAt: Date,      // Tracks the last time an OTP was requested
  isVerified: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });



const Register = mongoose.model('user_data', registerSchema);

module.exports = Register;