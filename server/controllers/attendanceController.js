import User from '../models/User.js';
import Attendance from '../models/Attendance.js';
import mongoose from 'mongoose';

export const markAttendance = async (req, res) => {
    const { userCode } = req.body;
    if (!userCode) return res.status(400).json({ success: false, message: 'User code is required' });

    const now = new Date();
    const day = now.getDay();
    const start = new Date(now.setHours(7, 0, 0, 0));
    const end = new Date(now.setHours(8, 30, 0, 0));

    if (day === 0 || day === 6) {
        return res.status(400).json({ success: false, message: 'Weekends not allowed' });
    }

    if (now < start || now > end) {
        return res.status(400).json({ success: false, message: 'Check-in only allowed between 7:00 AM and 8:30 AM' });
    }

    try {
        const user = await User.findOne({ userCode });
        if (!user) return res.status(400).json({ success: false, message: 'Invalid user code' });

        const todayStart = new Date();
        todayStart.setHours(0, 0, 0, 0);
        const todayEnd = new Date();
        todayEnd.setHours(23, 59, 59, 999);

        const exists = await Attendance.findOne({
            name: user.name,
            admin: user.admin,
            date: { $gte: todayStart, $lte: todayEnd },
        });

        if (exists) {
            return res.status(400).json({ success: false, message: 'Already checked in today' });
        }

        await Attendance.create({ name: user.name, admin: user.admin });
        res.json({ success: true });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getUsersWithAttendance = async (req, res) => {
    const { id: adminId } = req.admin;
    const { date } = req.query;

    try {
        const start = date ? new Date(date) : new Date();
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setHours(23, 59, 59, 999);

        const users = await User.aggregate([
            { $match: { admin: new mongoose.Types.ObjectId(adminId) } },
            {
                $lookup: {
                    from: 'attendances',
                    let: { userName: '$name' },
                    pipeline: [
                        {
                            $match: {
                                $expr: {
                                    $and: [
                                        { $eq: ['$name', '$$userName'] },
                                        { $eq: ['$admin', new mongoose.Types.ObjectId(adminId)] },
                                        { $gte: ['$date', start] },
                                        { $lte: ['$date', end] },
                                    ],
                                },
                            },
                        },
                        { $sort: { date: -1 } },
                        { $limit: 1 },
                    ],
                    as: 'attendance',
                },
            },
            {
                $project: {
                    name: 1,
                    userCode: 1,
                    last_checkin: { $arrayElemAt: ['$attendance.date', 0] },
                },
            },
        ]);

        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getAttendanceByMonth = async (req, res) => {
    const { id: adminId } = req.admin;
    const { year, month } = req.query;

    if (!year || !month) {
        return res.status(400).json({ message: 'Year and month are required' });
    }

    try {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0, 23, 59, 59, 999);

        const records = await Attendance.find({
            admin: adminId,
            date: { $gte: startDate, $lte: endDate },
        }).sort({ date: 1 });

        const users = await User.find({ admin: adminId });
        const userMap = Object.fromEntries(users.map(u => [u.name, u.userCode]));

        const grouped = {};
        records.forEach(record => {
            const key = record.date.toISOString().split('T')[0];
            if (!grouped[key]) grouped[key] = [];
            grouped[key].push({
                name: record.name,
                userCode: userMap[record.name] || 'N/A',
                checkin: record.date,
            });
        });

        res.json(grouped);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
