const jwt = require("jsonwebtoken");


const ensureAuthenticated = (req, res, next) => {
    const auth = req.headers['authorization'];
    if (!auth) {
        return res.status(403).json({ msg: "unauthorized jwt is required" });
    }
    try {
        const token = auth.split(' ')[1]; // Extract the token part
        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decodedData;
        
        next();
    } catch (err) {
        return res.status(401).json({
            msg: "jwt token wrong or expired"
        });
    }

};

module.exports = ensureAuthenticated;