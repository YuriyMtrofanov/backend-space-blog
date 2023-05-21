const tokenService = require("../services/token.service");

module.exports = (req, res, next) => {
    if (req.method === "OPTIONS"){
        return next();
    }
    try {
        // const token = req.headers.authorization.split(' ')[1]
        const token = req.headers.authorization.split(" ")[1]
        if (!token){
            // return res.send(401).json({message: "Unauthorized"});
            return res.status(401).json({message: "token doesn`t exist"});
        }
        const data = tokenService.validateAccess(token);
        if (!data){
            // return res.status(401).json({message: 'Unauthorized'})
            return res.status(401).json({message: "access token doesn`t valid"});
        }
        req.user = data;
        next();
    } catch (error) {
        return res.status(401).json({message: 'blocked by auth middleware'});
    }
};