import React, { useState } from 'react';
import { Box, Heading, Button, Text, Input } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const res = await axios.post('/api/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data.message || 'Login failed');
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt={6} p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Admin Login</Heading>
            <Box>
                <FormControl mb={4}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                    />
                </FormControl>
                <Button colorScheme="brand" width="full" onClick={handleLogin}>
                    Login
                </Button>
                {error && <Text color="red.500" mt={4}>{error}</Text>}
                <Text mt={4}>
                    Don't have an account?{' '}
                    <Button variant="link" colorScheme="blue" onClick={() => navigate('/admin/register')}>
                        Register
                    </Button>
                </Text>
            </Box>
        </Box>
    );
};

export default AdminLogin;