import React, { useState, useEffect } from 'react';
import { Box, Heading, Text, Switch, Button, Input, Table } from '@chakra-ui/react';
import { FormControl, FormLabel } from '@chakra-ui/form-control';
// import { Table } from '@chakra-ui/react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [userCode, setUserCode] = useState('');
    const [editId, setEditId] = useState(null);
    const [error, setError] = useState('');
    const [showCodes, setShowCodes] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/admin/users', {
                headers: { 'x-auth-token': token },
            });
            setUsers(res.data);
            setError('');
        } catch (err) {
            setError(err.response?.data.message || 'Failed to fetch users');
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleAddOrUpdateUser = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const config = {
                headers: { 'x-auth-token': token },
            };
            if (editId) {
                const res = await axios.put(
                    `/api/admin/users/${editId}`,
                    { name, userCode },
                    config
                );
                setUsers(users.map((user) => (user._id === editId ? res.data : user)));
                setEditId(null);
            } else {
                const res = await axios.post('/api/admin/users', { name, userCode }, config);
                setUsers([...users, res.data]);
            }
            setName('');
            setUserCode('');
            setError('');
        } catch (err) {
            setError(err.response?.data.message || 'Failed to add/update user');
        }
    };

    const handleEdit = (user) => {
        setEditId(user._id);
        setName(user.name);
        setUserCode(user.userCode);
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('adminToken');
            await axios.delete(`/api/admin/users/${id}`, {
                headers: { 'x-auth-token': token },
            });
            setUsers(users.filter((user) => user._id !== id));
            setError('');
        } catch (err) {
            setError(err.response?.data.message || 'Failed to delete user');
        }
    };

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
            <Heading size="md" mb={4}>User List</Heading>
            <Box mb={4}>
                <FormControl>
                    <FormLabel>Name</FormLabel>
                    <Input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter user name"
                    />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>User Code</FormLabel>
                    <Input
                        value={userCode}
                        onChange={(e) => setUserCode(e.target.value)}
                        placeholder="Enter user code"
                    />
                </FormControl>
                <Button
                    colorScheme="brand"
                    width="full"
                    mt={4}
                    onClick={handleAddOrUpdateUser}
                >
                    {editId ? 'Update User' : 'Add User'}
                </Button>
            </Box>
            {error && <Text color="red.500" mb={4}>{error}</Text>}
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
                <Table.Root variant="line" size="md" interactive striped>
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
                            <Table.ColumnHeader>Actions</Table.ColumnHeader>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {users.map((user) => (
                            <Table.Row key={user._id}>
                                <Table.Cell>{user.name}</Table.Cell>
                                {showCodes && <Table.Cell>{user.userCode}</Table.Cell>}
                                <Table.Cell>
                                    <Button
                                        size="sm"
                                        colorScheme="blue"
                                        mr={2}
                                        onClick={() => handleEdit(user)}
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        size="sm"
                                        colorScheme="red"
                                        onClick={() => handleDelete(user._id)}
                                    >
                                        Delete
                                    </Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table.Root>
            </Box>
        </Box>
    );
};

export default UserList;