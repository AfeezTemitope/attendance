import React, { useState, useEffect } from 'react';
import { Box, Heading, Button, Input, FormControl, FormLabel, useToast, Flex, Text, Icon } from '@chakra-ui/react';
import { FaCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MarkAttendance = () => {
    const [userCode, setUserCode] = useState('');
    const [attendees, setAttendees] = useState([]);
    const [markedCodes, setMarkedCodes] = useState(new Set());
    const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(!!localStorage.getItem('adminToken'));
    const toast = useToast();

    // Fetch users for the authenticated admin
    useEffect(() => {
        const fetchAttendees = async () => {
            try {
                const token = localStorage.getItem('adminToken');
                // console.log(token)
                console.log('Fetching users with token:', token ? 'Token present' : 'No token');
                if (!token) {
                    throw new Error('No admin token found. Please log in.');
                }
                const res = await axios.get('/api/admin/users', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                // console.log('Users fetched:', res.data);
                setAttendees(res.data);
                if (res.data.length === 0) {
                    toast({
                        title: 'No Users Found',
                        description: 'No users are associated with this admin. Add users to proceed.',
                        status: 'info',
                        duration: 5000,
                        isClosable: true,
                        position: 'top'
                    });
                }
            } catch (err) {
                // console.error('Fetch attendees error:', err.response?.data || err.message);
                toast({
                    title: 'Fetch Failed',
                    description: err.response?.data.message || err.message || 'Failed to fetch attendees.',
                    status: 'error',
                    duration: 5000,
                    isClosable: true,
                    position: 'top'
                });
            }
        };
        if (isAdminAuthenticated) {
            fetchAttendees();
        }
    }, [toast, isAdminAuthenticated]);

    const handleMarkAttendance = async () => {
        if (!userCode.trim()) {
            toast({
                title: 'Invalid Input',
                description: 'User code is required.',
                status: 'warning',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            return;
        }

        try {
            const token = localStorage.getItem('adminToken');
            if (!token) {
                throw new Error('No admin token found. Please log in.');
            }
            const res = await axios.post(
                '/api/attendance',
                { userCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMarkedCodes((prev) => new Set([...prev, userCode]));
            toast({
                title: 'Attendance Marked',
                description: 'Attendance marked successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
            setUserCode('');
        } catch (err) {
            console.error('Mark attendance error:', err.response?.data || err.message);
            toast({
                title: 'Attendance Failed',
                description: err.response?.data.message || 'Failed to mark attendance.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    return (
        <Flex direction="column" minH="100vh">
            <Box flex="1" display="flex" alignItems="center" justifyContent="center" p={4}>
                <Box maxW="sm" w="full" p={6} borderWidth={1} borderRadius="lg" bg="white">
                    <Heading size="md" mb={4}>Mark Attendance</Heading>
                    <Box mb={6}>
                        <FormControl mb={4} isRequired>
                            <FormLabel>User Code</FormLabel>
                            <Input
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value.trim())}
                                placeholder="Enter user code"
                            />
                        </FormControl>
                        <Button
                            colorScheme="blue"
                            width="full"
                            onClick={handleMarkAttendance}
                            isDisabled={!userCode.trim()}
                        >
                            Mark Attendance
                        </Button>
                    </Box>
                    <Box>
                        <Heading size="sm" mb={3}>Attendees</Heading>
                        {attendees.length > 0 ? (
                            <Box maxH="300px" overflowY="auto" borderWidth={1} borderRadius="md" p={2}>
                                {attendees.map((attendee) => (
                                    <Flex
                                        key={attendee.userCode}
                                        align="center"
                                        py={2}
                                        px={3}
                                        borderBottomWidth={1}
                                        _last={{ borderBottomWidth: 0 }}
                                    >
                                        <Icon
                                            as={FaCircle}
                                            color={markedCodes.has(attendee.userCode) ? 'green.500' : 'red.500'}
                                            mr={3}
                                            boxSize={3}
                                        />
                                        <Text fontSize="sm">{attendee.name} ({attendee.userCode})</Text>
                                    </Flex>
                                ))}
                            </Box>
                        ) : (
                            <Text fontSize="sm" color="gray.500">No attendees found.</Text>
                        )}
                    </Box>
                </Box>
            </Box>
            {isAdminAuthenticated && (
                <Box as="footer" py={4} bg="gray.100" textAlign="center">
                    <Text as={Link} to="/admin" fontSize="sm" color="blue.500" _hover={{ textDecoration: 'underline' }}>
                        Attendance Sheet
                    </Text>
                </Box>
            )}
        </Flex>
    );
};

export default MarkAttendance;