import React, { useState } from 'react';
import { Box, Heading, Button, Text, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminRegister = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [companyName, setCompanyName] = useState('');
    const navigate = useNavigate();
    const toast = useToast();

    const handleRegister = async () => {
        const payload = { username, email, password, companyName };
        console.log('Sending payload:', payload); // Debug payload
        try {
            const res = await axios.post('/api/admin/register', payload);
            localStorage.setItem('adminToken', res.data.token);
            toast({
                title: 'Registration Successful',
                description: 'Admin account created successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            navigate('/admin');
        } catch (err) {
            toast({
                title: 'Registration Failed',
                description: err.response?.data.message || 'An error occurred during registration.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            minH="100vh"
            bg="gray.50"
            p={4}
        >
            <Box
                maxW="sm"
                w="full"
                p={6}
                borderWidth={1}
                borderRadius="lg"
                bg="white"
                boxShadow="md"
            >
                <Heading size="md" mb={4} textAlign="center">
                    Register Admin
                </Heading>
                <FormControl mb={4}>
                    <FormLabel>Username</FormLabel>
                    <Input
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter username"
                        isRequired
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Email</FormLabel>
                    <Input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter email"
                        isRequired
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Password</FormLabel>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter password"
                        isRequired
                    />
                </FormControl>
                <FormControl mb={4}>
                    <FormLabel>Company Name</FormLabel>
                    <Input
                        value={companyName}
                        onChange={(e) => setCompanyName(e.target.value)}
                        placeholder="Enter company name"
                        isRequired
                    />
                </FormControl>
                <Button
                    colorScheme="blue"
                    width="full"
                    onClick={handleRegister}
                    isDisabled={!username || !email || !password || !companyName}
                    mb={4}
                >
                    Register
                </Button>
                <Text textAlign="center">
                    Already have an account?{' '}
                    <Button variant="link" colorScheme="blue" onClick={() => navigate('/admin/login')}>
                        Login
                    </Button>
                </Text>
            </Box>
        </Box>
    );
};

export default AdminRegister;