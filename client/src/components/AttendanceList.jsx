import React, { useState, useEffect } from 'react';
import { Box, Heading, Switch, Button, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { Table } from '@chakra-ui/react';
import axios from 'axios';

const AttendanceList = () => {
    const [users, setUsers] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [showCodes, setShowCodes] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const toast = useToast();

    const fetchUsersWithAttendance = async (date) => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`/api/users?date=${date}`, {
                headers: { 'x-auth-token': token },
            });
            setUsers(res.data);
            toast({
                title: 'Attendance Fetched',
                description: 'Attendance data loaded successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        } catch (err) {
            toast({
                title: 'Fetch Failed',
                description: err.response?.data.message || 'Failed to fetch attendance data.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    useEffect(() => {
        fetchUsersWithAttendance(selectedDate);
    }, [selectedDate]);

    const handleSortByName = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sortedUsers = [...users].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (newSortOrder === 'asc') {
                return nameA < nameB ? -1 : 1;
            } else {
                return nameA > nameB ? -1 : 1;
            }
        });
        setUsers(sortedUsers);
    };

    return (
        <Box maxW="md" mx="auto" mt={6} p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Daily Attendance</Heading>
            <FormControl mb={4}>
                <FormLabel>Select Date</FormLabel>
                <Input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                />
            </FormControl>
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="show-codes" mb="0">
                    Show User Codes
                </FormLabel>
                <Switch
                    id="show-codes"
                    isChecked={showCodes}
                    onChange={(e) => setShowCodes(e.target.checked)}
                />
            </FormControl>
            <Box overflowX="auto">
                <Table.Root variant="line" size="md" interactive showColumnBorder>
                    <Table.Header stickyHeader>
                        <Table.Row>
                            <Table.ColumnHeader>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSortByName}
                                    rightIcon={<span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                >
                                    Name
                                </Button>
                            </Table.ColumnHeader>
                            {showCodes && <Table.ColumnHeader>User Code</Table.ColumnHeader>}
                            <Table.ColumnHeader>Last Check-In</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map((user) => (
                            <Table.Row key={user._id}>
                                <Table.Cell>{user.name}</Table.Cell>
                                {showCodes && <Table.Cell>{user.userCode}</Table.Cell>}
                                <Table.Cell>
                                    {user.last_checkin
                                        ? new Date(user.last_checkin).toLocaleTimeString()
                                        : 'Not checked in'}
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
};

export default AttendanceList;