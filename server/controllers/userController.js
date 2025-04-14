import User from '../models/User.js';

export const validateUserCode = async (req, res) => {
    const { userCode } = req.body;
    if (!userCode) return res.status(400).json({ message: 'User code is required' });

    try {
        const user = await User.findOne({ userCode });
        if (!user) return res.status(400).json({ message: 'Invalid user code' });

        res.json({ name: user.name, admin: user.admin });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
}
