import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AdminRegister from './components/AdminRegister';
import AdminLogin from './components/AdminLogin';
import UserList from './components/UserList';
import AttendanceList from './components/AttendanceList';
import MonthlyAttendance from './components/MonthlyAttendance';
import MarkAttendance from './components/MarkAttendance';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('adminToken');
    return token ? children : <Navigate to="/admin/login" />;
};

const App = () => {
    return (
        <Routes>
            <Route path="/admin/register" element={<AdminRegister />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <UserList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/daily"
                element={
                    <ProtectedRoute>
                        <AttendanceList />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/admin/monthly"
                element={
                    <ProtectedRoute>
                        <MonthlyAttendance />
                    </ProtectedRoute>
                }
            />
            <Route path="/attendance" element={<MarkAttendance />} />
            <Route path="/" element={<Navigate to="/admin/login" />} />
        </Routes>
    );
};

export default App;