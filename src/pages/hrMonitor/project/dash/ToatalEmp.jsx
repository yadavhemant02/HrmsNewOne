import React, { useEffect, useState } from 'react';
import {
    Box,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Button
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import axios from 'axios';
import { base_identity, base_Ip } from '../../../../http/services';
import { useNavigate } from 'react-router-dom';

const TotalEmp = () => {
    const [data, setData] = useState([]);
    const navigate = useNavigate();

    const tableHeaders = [
        'Sr. No.',
        'Name',
        'Email',
        'Disignation',
        'Emp Code',
        'Emp Number',
        'Status',
        'Action'
    ];

    const fetchTotalEmp = async () => {
        try {
            const response = await axios.get(`${base_identity}/identity-handler/details/get-all-all-emp/by-type?type=all`);
            setData(response.data);
        } catch (error) {
            console.log("Error during api fetching", error);
        }
    };

    useEffect(() => {
        fetchTotalEmp();
    }, []);

    const handleView = (empCode) => {
       // navigate(`/dashboard-hr/details/${empCode}`);
       //dashboard-hr/emp-all-track
       navigate(`/dashboard-hr/emp-all-track/${empCode}`);
    };

    return (
        <Box sx={{ 
            p: 3,
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)'
        }}>
            <Typography
                variant="h5"
                sx={{
                    mb: 3,
                    fontWeight: 600,
                    color: '#1a237e',
                    borderBottom: '2px solid #1a237e',
                    paddingBottom: '8px',
                    display: 'inline-block'
                }}
            >
                Total Employee Details
            </Typography>

            <TableContainer 
                component={Paper} 
                sx={{
                    boxShadow: '0 2px 4px rgba(0,0,0,0.08)',
                    borderRadius: '8px',
                    // overflow: 'hidden',
                    width: '100%',
                    '& .MuiTable-root': {
                        minWidth: 650,
                        width: '100%'
                    }
                }}
            >
                <Table>
                    <TableHead>
                        <TableRow sx={{
                            backgroundColor: '#1a237e',
                            '& th': {
                                color: 'white',
                                fontWeight: 600,
                                fontSize: '0.875rem',
                                padding: '16px',
                                whiteSpace: 'nowrap'
                            }
                        }}>
                            {tableHeaders.map((header, index) => (
                                <TableCell key={index} sx={{ color: 'inherit' , textAlign:'center'}}>
                                    {header}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {data.map((row, index) => (
                            <TableRow
                            // sx={{textAlign:'center'}}
                                key={index}
                                sx={{
                                    textAlign:'center',
                                    '&:nth-of-type(odd)': {
                                        backgroundColor: '#ffffff',
                                    },
                                    '&:nth-of-type(even)': {
                                        backgroundColor: '#f5f5f5',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#eeeeee',
                                    },
                                    '& td': {
                                        padding: '16px',
                                        fontSize: '0.875rem',
                                        whiteSpace: 'nowrap'
                                    }
                                }}
                            >
                                <TableCell sx={{textAlign:'center'}}>{index + 1}</TableCell>
                                <TableCell sx={{textAlign:'center'}}>{row.name}</TableCell>
                                <TableCell sx={{textAlign:'center'}}>{row.officialEmail}</TableCell>
                                <TableCell sx={{textAlign:'center'}}>{row.disignation}</TableCell>
                                <TableCell sx={{textAlign:'center'}}>{row.empCode}</TableCell>
                                <TableCell sx={{textAlign:'center'}}>{row.empNumber}</TableCell>
                                <TableCell>
                                    <Box
                                        sx={{
                                            backgroundColor: row.status === 'active' ? '#e8f5e9' : '#ffebee',
                                            color: row.status === 'active' ? '#2e7d32' : '#c62828',
                                            padding: '4px 12px',
                                            borderRadius: '12px',
                                            display: 'inline-block',
                                            fontSize: '0.75rem',
                                            fontWeight: 600
                                        }}
                                    >
                                        {row.status == null ? "ON": row.status}
                                    </Box>
                                </TableCell>
                                <TableCell>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        startIcon={<VisibilityIcon />}
                                        onClick={() => handleView(row.empCode)}
                                        sx={{
                                            backgroundColor: '#1a237e',
                                            '&:hover': {
                                                backgroundColor: '#000051'
                                            },
                                            textTransform: 'none',
                                            borderRadius: '8px',
                                            minWidth: '90px',
                                            padding: '6px 16px'
                                        }}
                                    >
                                        View
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </Box>
    );
};

export default TotalEmp;