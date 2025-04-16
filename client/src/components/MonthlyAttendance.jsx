import React, { useState } from 'react';
import { Box, Heading, Button, Text, Switch, Input, FormControl, FormLabel, useToast } from '@chakra-ui/react';
import { Table } from '@chakra-ui/react';
import axios from 'axios';

const MonthlyAttendance = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);
    const [attendanceData, setAttendanceData] = useState({});
    const [showCodes, setShowCodes] = useState(true);
    const [sortOrders, setSortOrders] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5;
    const maxPageButtons = 5; // Limit number of page buttons displayed
    const toast = useToast();

    const fetchMonthlyAttendance = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await axios.get(`/api/attendance/month?year=${year}&month=${month}`, {
                headers: { 'x-auth-token': token },
            });
            setAttendanceData(res.data);
            setSortOrders({});
            setCurrentPage(1);
            toast({
                title: 'Attendance Fetched',
                description: 'Monthly attendance data loaded successfully.',
                status: 'success',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        } catch (err) {
            toast({
                title: 'Fetch Failed',
                description: err.response?.data.message || 'Failed to fetch monthly attendance.',
                status: 'error',
                duration: 5000,
                isClosable: true,
                position: 'top'
            });
        }
    };

    const handleSortByName = (date) => {
        const newSortOrder = sortOrders[date] === 'asc' ? 'desc' : 'asc';
        setSortOrders((prev) => ({ ...prev, [date]: newSortOrder }));

        const sortedRecords = [...attendanceData[date]].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (newSortOrder === 'asc') {
                return nameA < nameB ? -1 : 1;
            } else {
                return nameA > nameB ? -1 : 1;
            }
        });

        setAttendanceData((prev) => ({
            ...prev,
            [date]: sortedRecords,
        }));
    };

    const exportToCSV = () => {
        const headers = showCodes
            ? ['Date', 'Name', 'User Code', 'Check-In Time']
            : ['Date', 'Name', 'Check-In Time'];
        const rows = [];

        Object.keys(attendanceData).forEach((date) => {
            attendanceData[date].forEach((record) => {
                const row = showCodes
                    ? [
                        date,
                        record.name,
                        record.userCode || 'N/A',
                        new Date(record.checkin).toLocaleTimeString(),
                    ]
                    : [date, record.name, new Date(record.checkin).toLocaleTimeString()];
                rows.push(row);
            });
        });

        const csvContent = [
            headers.join(','),
            ...rows.map((row) => row.join(',')),
        ].join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.setAttribute('href', url);
        link.setAttribute('download', `attendance-${year}-${month}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast({
            title: 'CSV Exported',
            description: 'Attendance data exported to CSV successfully.',
            status: 'success',
            duration: 5000,
            isClosable: true,
            position: 'top'
        });
    };

    // Pagination logic
    const totalItems = Object.values(attendanceData).reduce(
        (sum, records) => sum + records.length,
        0
    );
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Calculate page buttons to display
    const halfMaxButtons = Math.floor(maxPageButtons / 2);
    let startPage = Math.max(1, currentPage - halfMaxButtons);
    let endPage = Math.min(totalPages, startPage + maxPageButtons - 1);
    if (endPage - startPage + 1 < maxPageButtons) {
        startPage = Math.max(1, endPage - maxPageButtons + 1);
    }
    const pages = Array.from(
        { length: endPage - startPage + 1 },
        (_, i) => startPage + i
    );

    // Paginate data
    const paginatedData = {};
    Object.keys(attendanceData).forEach((date) => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        paginatedData[date] = attendanceData[date].slice(startIndex, endIndex);
    });

    return (
        <Box maxW="md" mx="auto" mt={6} p={6} borderWidth={1} borderRadius="lg">
            <Heading size="md" mb={4}>Monthly Attendance</Heading>
            <Box mb={4}>
                <FormControl>
                    <FormLabel>Year</FormLabel>
                    <Input
                        type="number"
                        value={year}
                        onChange={(e) => setYear(e.target.value)}
                    />
                </FormControl>
                <FormControl mt={4}>
                    <FormLabel>Month</FormLabel>
                    <Input
                        type="number"
                        value={month}
                        onChange={(e) => setMonth(e.target.value)}
                        min="1"
                        max="12"
                    />
                </FormControl>
                <Button colorScheme="blue" width="full" mt={4} onClick={fetchMonthlyAttendance}>
                    Fetch Attendance
                </Button>
                {Object.keys(attendanceData).length > 0 && (
                    <Button colorScheme="gray" width="full" mt={2} onClick={exportToCSV}>
                        Export to CSV
                    </Button>
                )}
            </Box>
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
            {Object.keys(attendanceData).length > 0 ? (
                <>
                    {Object.keys(paginatedData).map((date) => (
                        <Box key={date} mb={6}>
                            <Heading size="sm" mb={2}>{date}</Heading>
                            <Box overflowX="auto">
                                <Table.Root variant="line" size="md" interactive striped>
                                    <Table.Header stickyHeader>
                                        <Table.Row>
                                            <Table.ColumnHeader>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => handleSortByName(date)}
                                                    rightIcon={<span>{sortOrders[date] === 'asc' ? '↑' : sortOrders[date] === 'desc' ? '↓' : '↕'}</span>}
                                                >
                                                    Name
                                                </Button>
                                            </Table.ColumnHeader>
                                            {showCodes && <Table.ColumnHeader>User Code</Table.ColumnHeader>}
                                            <Table.ColumnHeader>Check-In Time</Table.ColumnHeader>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Body>
                                        {paginatedData[date].map((record, index) => (
                                            <Table.Row key={index}>
                                                <Table.Cell>{record.name}</Table.Cell>
                                                {showCodes && <Table.Cell>{record.userCode || 'N/A'}</Table.Cell>}
                                                <Table.Cell>{new Date(record.checkin).toLocaleTimeString()}</Table.Cell>
                                            </Table.Row>
                                        ))}
                                    </Table.Body>
                                </Table.Root>
                            </Box>
                        </Box>
                    ))}
                    {totalPages > 1 && (
                        <Box display="flex" justifyContent="center" mt={4} gap={2}>
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                isDisabled={currentPage === 1}
                            >
                                Previous
                            </Button>
                            {pages.map((page) => (
                                <Button
                                    key={page}
                                    size="sm"
                                    variant={page === currentPage ? 'solid' : 'outline'}
                                    colorScheme="blue"
                                    onClick={() => setCurrentPage(page)}
                                >
                                    {page}
                                </Button>
                            ))}
                            <Button
                                size="sm"
                                variant="outline"
                                colorScheme="blue"
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                isDisabled={currentPage === totalPages}
                            >
                                Next
                            </Button>
                        </Box>
                    )}
                </>
            ) : (
                <Text>No attendance data available for this month.</Text>
            )}
        </Box>
    );
};

export default MonthlyAttendance;