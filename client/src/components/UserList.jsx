import React, { useState, useEffect } from 'react';
import {
    Box,
    Heading,
    Switch,
    Button,
    Input,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    FormControl,
    FormLabel,
    useToast,
} from '@chakra-ui/react';
import axios from 'axios';

const UserList = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [userCode, setUserCode] = useState('');
    const [editId, setEditId] = useState(null);
    const [showCodes, setShowCodes] = useState(true);
    const [sortOrder, setSortOrder] = useState('asc');
    const toast = useToast();

    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get('/api/admin/users', {
                headers: { 'x-auth-token': token },
            });
            setUsers(res.data);
        } catch (err) {
            toast({
                title: 'Error fetching users.',
                description: err.response?.data.message || 'Failed to fetch users.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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
                toast({
                    title: 'User updated.',
                    description: 'User information has been updated successfully.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
                setEditId(null);
            } else {
                const res = await axios.post('/api/admin/users', { name, userCode }, config);
                setUsers([...users, res.data]);
                toast({
                    title: 'User added.',
                    description: 'New user has been added successfully.',
                    status: 'success',
                    duration: 5000,
                    isClosable: true,
                });
            }
            setName('');
            setUserCode('');
        } catch (err) {
            toast({
                title: 'Error adding/updating user.',
                description: err.response?.data.message || 'Failed to add/update user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
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
            toast({
                title: 'User deleted.',
                description: 'User has been removed successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
            });
        } catch (err) {
            toast({
                title: 'Error deleting user.',
                description: err.response?.data.message || 'Failed to delete user.',
                status: 'error',
                duration: 5000,
                isClosable: true,
            });
        }
    };

    const handleSortByName = () => {
        const newSortOrder = sortOrder === 'asc' ? 'desc' : 'asc';
        setSortOrder(newSortOrder);
        const sortedUsers = [...users].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            return newSortOrder === 'asc' ? (nameA < nameB ? -1 : 1) : (nameA > nameB ? -1 : 1);
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
                    colorScheme="blue"
                    width="full"
                    mt={4}
                    onClick={handleAddOrUpdateUser}
                >
                    {editId ? 'Update User' : 'Add User'}
                </Button>
            </Box>
            <FormControl display="flex" alignItems="center" mb={4}>
                <FormLabel htmlFor="show-codes" mb="0">Show User Codes</FormLabel>
                <Switch
                    id="show-codes"
                    isChecked={showCodes}
                    onChange={(e) => setShowCodes(e.target.checked)}
                />
            </FormControl>
            <Box overflowX="auto">
                <Table variant="striped" colorScheme="gray">
                    <Thead>
                        <Tr>
                            <Th>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={handleSortByName}
                                    rightIcon={<span>{sortOrder === 'asc' ? '↑' : '↓'}</span>}
                                >
                                    Name
                                </Button>
                            </Th>
                            {showCodes && <Th>User Code</Th>}
                            <Th>Actions</Th>
                        </Tr>
                    </Thead>
                    <Tbody>
                        {users.map((user) => (
                            <Tr key={user._id}>
                                <Td>{user.name}</Td>
                                {showCodes && <Td>{user.userCode}</Td>}
                                <Td>
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
                                </Td>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Box>
    );
};

export default UserList;