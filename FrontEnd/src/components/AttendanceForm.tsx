import React, { useState, useEffect } from 'react';

interface User {
    name: string;
    last_checkin: string | null;
}

const AttendanceForm: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [selectedName, setSelectedName] = useState('');
    const [userCode, setUserCode] = useState('');

    useEffect(() => {
        fetch('http://localhost:5000/users')
            .then(response => response.json())
            .then(data => {
                const sortedData = data.sort((a: User, b: User) => {
                    if (a.last_checkin && b.last_checkin) {
                        return new Date(a.last_checkin) > new Date(b.last_checkin) ? 1 : -1;
                    }
                    return 0;
                });
                setUsers(sortedData);
            });
    }, []);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        fetch('http://localhost:5000/attendance', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name: selectedName, userCode })
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Attendance marked successfully');
                    setSelectedName('');
                    setUserCode('');
                    fetch('http://localhost:5000/users')
                        .then(response => response.json())
                        .then(data => {
                            const sortedData = data.sort((a: User, b: User) => {
                                if (a.last_checkin && b.last_checkin) {
                                    return new Date(a.last_checkin) > new Date(b.last_checkin) ? 1 : -1;
                                }
                                return 0;
                            });
                            setUsers(sortedData);
                        });
                } else {
                    alert(data.message);
                }
            });
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Attendance Sheet</h1>
            <form onSubmit={handleSubmit} className="mb-4">
                <div className="mb-2">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
                    <select
                        id="name"
                        value={selectedName}
                        onChange={(e) => setSelectedName(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    >
                        <option value="" disabled>Select your name</option>
                        {users.map((user, index) => (
                            <option key={index} value={user.name}>
                                {user.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="mb-2">
                    <label htmlFor="userCode" className="block text-sm font-medium text-gray-700">User Code</label>
                    <input
                        type="password"
                        id="userCode"
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    />
                </div>
                <div className="flex justify-end">
                    <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-sm hover:bg-blue-600">Submit</button>
                </div>
            </form>
            <table className="min-w-full bg-white">
                <thead>
                <tr>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Name</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Check-in Time</th>
                    <th className="px-6 py-3 border-b-2 border-gray-300 text-left leading-4 text-gray-600 tracking-wider">Status</th>
                </tr>
                </thead>
                <tbody>
                {users.map((user, index) => (
                    <tr key={index}>
                        <td className="px-6 py-3 border-b border-gray-300">{user.name}</td>
                        <td className="px-6 py-3 border-b border-gray-300">
                            {user.last_checkin ? new Date(user.last_checkin).toLocaleTimeString() : 'N/A'}
                        </td>
                        <td className="px-6 py-3 border-b border-gray-300">
                            {user.last_checkin ? (
                                <span className="text-green-500 font-semibold">✔</span>
                            ) : (
                                'Absent'
                            )}
                        </td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
};

export default AttendanceForm;
