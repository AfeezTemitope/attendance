import {Route, Routes, Navigate} from "react-router-dom";
import AdminRegister from "./components/AdminRegister.jsx";
import UserList from "./components/UserList.jsx";
import AdminLogin from "./components/AdminLogin.jsx";
import AttendanceList from "./components/AttendanceList.jsx";
import MonthlyAttendance from "./components/MonthlyAttendance.jsx";
import MarkAttendance from "./components/MarkAttendance.jsx";


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
            <Route path="/attendance" element={
                 <ProtectedRoute>
                    <MarkAttendance />
                 </ProtectedRoute>
            } />
            <Route path="/" element={<Navigate to="/admin/login" />} />
        </Routes>
    );
};

export default App;