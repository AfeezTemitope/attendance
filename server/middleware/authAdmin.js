import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
    console.log('Raw headers:', req.headers);
    const authHeader = req.header('Authorization') || req.header('authorization');
    // console.log('Authorization header:', authHeader);
    if (!authHeader) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) {
        return res.status(401).json({ message: 'No token, authorization denied' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        // console.log('Decoded token:', decoded);
        req.admin = decoded;
        next();
    } catch (err) {
        // console.error('Token verification error:', err.message);
        res.status(401).json({ message: 'Invalid token' });
    }
};

export default authAdmin