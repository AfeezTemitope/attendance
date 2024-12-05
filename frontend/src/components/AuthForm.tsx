import React, { useState } from 'react';
import axios from 'axios';
import {useNavigate} from "react-router-dom";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(false);
    const [departmentName, setDepartmentName] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const url = isRegister ? 'http://localhost:8080/api/v1/createDepartment/' : 'http://localhost:8080/api/v1/loginDepartment/';
        const payload = { department:departmentName, password };

        try {
            const response = await axios.post(url, payload, {
                headers: { 'Content-Type': 'application/json' },
            });
            // @ts-expect-error
            alert(`Success: ${response.data.message}`);
            setDepartmentName('');
            setPassword('');
            navigate('/attendanceSheet')
        } catch (err: any) {
            setError(err.response?.data?.error || 'An error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="bg-white shadow-md rounded px-8 py-6 w-full max-w-xs">
            <h1 className="text-2xl font-bold mb-4">{isRegister ? 'Register' : 'Login'}</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                    <input
                        type="text"
                        value={departmentName}
                        onChange={(e) => setDepartmentName(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        required
                    />
                </div>
                {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
                <button
                    type="submit"
                    className="bg-orange-500 hover:bg-orange-400 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                    disabled={isLoading}
                >
                    {isLoading ? 'Please wait...' : isRegister ? 'Register' : 'Login'}
                </button>
            </form>
            {isLoading && (
                <div className="flex justify-center mt-4">
                    <div className="loader"></div>
                </div>
            )}
            <div className="mt-4">
                <button
                    className="text-blue-500 underline"
                    onClick={() => setIsRegister(!isRegister)}
                >
                    {isRegister ? 'Already have an account? Login' : 'Need an account? Register'}
                </button>
            </div>
        </div>
    );
};

export default Auth;
