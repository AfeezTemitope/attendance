import Admin from '../models/Admin.js';
import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    const { username, email, password, companyName } = req.body;
    if (!username || !email || !password || !companyName) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const exists = await Admin.findOne({ username });
        if (exists) return res.status(400).json({ message: 'Username already exists' });

        const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt(10));
        const admin = new Admin({ username, email, password: hashedPassword, companyName });
        await admin.save();

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '1h' });
        res.status(201).json({ token, message: `Company ${companyName} registered successfully` });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const login = async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'All fields are required' });

    try {
        const admin = await Admin.findOne({ username });
        if (!admin || !(await bcrypt.compare(password, admin.password))) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET_ADMIN, { expiresIn: '1h' });
        res.json({ token, companyName: admin.companyName });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req, res) => {
    const { name, userCode } = req.body;
    const adminId = req.admin.id;

    if (!name || !userCode) {
        return res.status(400).json({ message: 'Name and user code are required' });
    }

    try {
        const exists = await User.findOne({ admin: adminId, name });
        if (exists) return res.status(400).json({ message: 'User already exists' });

        const user = new User({ name, userCode, admin: adminId });
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getUsers = async (req, res) => {
    try {
        const users = await User.find({ admin: req.admin.id });
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, userCode } = req.body;

    try {
        const user = await User.findOne({ _id: id, admin: req.admin.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        if (userCode) user.userCode = userCode;

        await user.save();
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await User.findOneAndDelete({ _id: id, admin: req.admin.id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        await Attendance.deleteMany({ name: user.name, admin: req.admin.id });
        res.json({ message: 'User and attendance records deleted' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
};
