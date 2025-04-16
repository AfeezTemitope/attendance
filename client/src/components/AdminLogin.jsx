import React, { useState } from 'react';
import {
    Box,
    Heading,
    Button,
    Text,
    Input,
    FormControl,
    FormLabel,
    useToast,
    Stack,
    Flex,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const toast = useToast();
    const navigate = useNavigate();

    const handleLogin = async () => {
        if (!username || !password) {
            setError("Username and password cannot be empty");
            toast({
                title: "Error",
                description: "Username and password cannot be empty.",
                status: "error",
                duration: 3000,
                isClosable: true,
            });
            return;
        }

        try {
            const res = await axios.post('/api/admin/login', { username, password });
            if (res.data.token) {
                localStorage.setItem('adminToken', res.data.token);
                console.log(localStorage.getItem('adminToken'));
                toast({
                    title: "Login Successful",
                    description: "You have successfully logged in.",
                    status: "success",
                    duration: 3000,
                    isClosable: true,
                });
                navigate('/attendance');
            } else {
                setError('Login failed: Invalid response from server');
                toast({
                    title: "Error",
                    description: "Invalid response from the server.",
                    status: "error",
                    duration: 3000,
                    isClosable: true,
                });
            }
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login failed';
            setError(errorMessage);
            toast({
                title: "Error",
                description: errorMessage,
                status: "error",
                duration: 3000,
                isClosable: true,
            });
        }
    };

    return (
        <Flex align="center" justify="center" height="100vh">
            <Box maxW="sm" width="full" p={6} borderWidth={1} borderRadius="lg" boxShadow="md">
                <Heading size="md" mb={4}>Admin Login</Heading>
                <Stack spacing={4}>
                    <FormControl isInvalid={!!error}>
                        <FormLabel>Username</FormLabel>
                        <Input
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
                        />
                    </FormControl>

                    <FormControl isInvalid={!!error}>
                        <FormLabel>Password</FormLabel>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="Enter password"
                        />
                    </FormControl>

                    <Button colorScheme="blue" width="full" onClick={handleLogin} aria-label="Login">
                        Login
                    </Button>
                    {/*{error && <Text color="red.500">{error}</Text>}*/}
                    <Text>
                        Don't have an account?{' '}
                        <Button variant="link" colorScheme="blue" onClick={() => navigate('/admin/register')} aria-label="Register">
                            Register
                        </Button>
                    </Text>
                </Stack>
            </Box>
        </Flex>
    );
};

export default AdminLogin;