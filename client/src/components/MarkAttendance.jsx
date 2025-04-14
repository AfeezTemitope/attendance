import React, { useState } from 'react';
import { Box, Heading, Button, Text, Input } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
import axios from 'axios';

const MarkAttendance = () => {
    const [userCode, setUserCode] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleMarkAttendance = async () => {
        try {
            const res = await axios.post('/api/attendance', { userCode });
            setMessage(res.data.success ? 'Attendance marked successfully' : '');
            setError(res.data.message || '');
        } catch (err) {
            setError(err.response?.data.message || 'Failed to mark attendance');
            setMessage('');
        }
    };

    return (
        <Box maxW="sm" mx="auto" mt={6} p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Mark Attendance</Heading>
            <Box>
                <FormControl mb={4}>
                    <FormLabel>User Code</FormLabel>
                    <Input
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Enter user code"
                    />
                </FormControl>
                <Button colorScheme="blue" width="full" onClick={handleMarkAttendance}>
                    Mark Attendance
                </Button>
                {message && <Text color="green.500" mt={4}>{message}</Text>}
                {error && <Text color="red.500" mt={4}>{error}</Text>}
            </Box>
        </Box>
    );
};

export default MarkAttendance;