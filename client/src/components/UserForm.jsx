import React, { useState } from 'react';
import { Box, Heading, Button, Text, VStack, Fieldset, Input } from '@chakra-ui/react';
import axios from 'axios';

const UserForm = ({ onUserAdded }) => {
    const [name, setName] = useState('');
    const [userCode, setUserCode] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('adminToken');
            await axios.post(
                '/api/admin/users',
                { name, userCode },
                { headers: { 'x-auth-token': token } }
            );
            setName('');
            setUserCode('');
            setError('');
            onUserAdded();
        } catch (err) {
            setError(err.response?.data.message || 'Failed to add user');
        }
    };

    return (
        <Box maxW="md" mx="auto" mt={6} p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Add Staff</Heading>
            {error && <Text color="red.500" mb={4}>{error}</Text>}
            <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                    <Fieldset>
                        <Fieldset.Legend>User Details</Fieldset.Legend>
                        <Fieldset.Content>
                            <Input
                                placeholder="Name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                isRequired
                                mb={4}
                            />
                            <Input
                                placeholder="User Code"
                                value={userCode}
                                onChange={(e) => setUserCode(e.target.value)}
                                isRequired
                            />
                        </Fieldset.Content>
                    </Fieldset>
                    <Button type="submit" colorScheme="brand" width="full">
                        Add Staff
                    </Button>
                </VStack>
            </form>
        </Box>
    );
};

export default UserForm;