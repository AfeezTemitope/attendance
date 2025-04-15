import {Route, Routes, Navigate} from "react-router-dom";
import AdminLogin from "../src/components/AdminLogin.jsx"
import UserList from "./components/UserList.jsx";

// const ProtectedRoute = ({ children }) => {
//     const token = localStorage.getItem('adminToken');
//     return token ? children : <Navigate to="/admin/login" />;
// };

const App = () => {
    return(
        <Routes>
            <Route path="/" element={<AdminLogin/>}/>
            <Route path="/admin"
                element={
                    // <ProtectedRoute>
                        <UserList />
                    // </ProtectedRoute>
                }
            />
        </Routes>
    )
}

export default App