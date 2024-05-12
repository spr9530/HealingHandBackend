const jwt = require('jsonwebtoken');
const secretKey = process.env.JWT_SECRET;

const verifyUser = async(req,res,next) => {
    try{
        const token = req.headers['authorization']
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(403).json({ error: 'Unauthorized' });
        }
    
        const jwtToken = token.split(' ')[1];
    
        jwt.verify(jwtToken, secretKey, function(err, decoded) {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    return res.status(401).json({ error: 'Token expired' });
                } else if (err.name === 'JsonWebTokenError') {
                    return res.status(401).json({ error: 'Invalid token' });
                } else {
                    return res.status(500).json({ error: 'Internal server error' });
                }
            }
            
            next();
        });
    }catch (error) {
        console.error('Error in verifyUser middleware:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {verifyUser}