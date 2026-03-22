import React from 'react';
import { Box, Typography, Container, Button } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router-dom';

const RestrictedPage = () => {
    const navigate = useNavigate();

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '50vh',
                    textAlign: 'center',
                    mt: 4
                }}
            >
                <LockOutlinedIcon sx={{ fontSize: 60, color: '#d32f2f', mb: 2 }} />
                <Typography variant="h4" gutterBottom>
                    Access Restricted
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                    You do not have permission to view this page. This section is restricted based on your role.
                </Typography>
                <Button variant="contained" color="primary" onClick={() => navigate('/home')} sx={{ mt: 2, backgroundColor: '#FF671F !important' }}>
                    Home
                </Button>
            </Box>
        </Container>
    );
};

export default RestrictedPage;
