import express from 'express';
import mysql from 'mysql2';
import cors from 'cors';
import bodyParser from 'body-parser';

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'attendance_db'
});

db.connect(err => {
    if (err) throw err;
    console.log('Connected to MySQL database');

    const initialUsers = [
        { name: 'Alice', userCode: '1234' },
        { name: 'Bob', userCode: '5678' },
        { name: 'Charlie', userCode: '9012' },
        // Add the rest of the 36 users here...
    ];

    initialUsers.forEach(user => {
        const checkQuery = 'SELECT * FROM users WHERE name = ? AND userCode = ?';
        db.query(checkQuery, [user.name, user.userCode], (err, results) => {
            if (err) throw err;
            if (results.length === 0) {
                const insertQuery = 'INSERT INTO users (name, userCode) VALUES (?, ?)';
                db.query(insertQuery, [user.name, user.userCode], (err) => {
                    if (err) throw err;
                    console.log(`User ${user.name} added to the database.`);
                });
            }
        });
    });
});

app.post('/attendance', (req, res) => {
    const { name, userCode } = req.body;
    const now = new Date();
    const startTime = new Date();
    const endTime = new Date();

    startTime.setHours(7, 0, 0, 0)
    endTime.setHours(8, 30, 0, 0);

    if (now < startTime || now > endTime) {
        return res.status(400).json({ success: false, message: 'Attendance can only be marked between 7:00 AM and 8:30 AM' });
    }

    const query = 'SELECT * FROM users WHERE name = ? AND userCode = ?';

    db.query(query, [name, userCode], (err, results) => {
        if (err) throw err;
        if (results.length > 0) {
            const today = new Date().toISOString().split('T')[0];
            const attendanceQuery = 'SELECT * FROM attendance WHERE name = ? AND DATE(date) = ?';
            db.query(attendanceQuery, [name, today], (err, results) => {
                if (err) throw err;
                if (results.length === 0) {
                    const insertQuery = 'INSERT INTO attendance (name, date) VALUES (?, NOW())';
                    db.query(insertQuery, [name], (err) => {
                        if (err) throw err;
                        res.json({ success: true });
                    });
                } else {
                    res.status(400).json({ success: false, message: 'Attendance already marked for today' });
                }
            });
        } else {
            res.status(400).json({ success: false, message: 'Invalid user code' });
        }
    });
});

app.get('/users', (req, res) => {
    const query = `
    SELECT users.name, 
           IFNULL(MAX(attendance.date), NULL) AS last_checkin
    FROM users 
    LEFT JOIN attendance ON users.name = attendance.name AND DATE(attendance.date) = CURDATE()
    GROUP BY users.name;
  `;
    db.query(query, (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});

