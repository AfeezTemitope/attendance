import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
    const token = req.header('x-auth-token');
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
        req.admin = decoded;
        next();
    } catch {
        res.status(401).json({ message: 'Token is not valid' });
    }
};

export default authAdmin;
