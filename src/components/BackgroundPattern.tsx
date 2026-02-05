import React from 'react';
import { Box } from '@mui/material';

const BackgroundPattern = () => {
    return (
        <Box
            sx={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100vh',
                zIndex: -1,
                overflow: 'hidden',
                bgcolor: 'black' // Fallback color
            }}
        >
            <video
                autoPlay
                loop
                muted
                playsInline
                style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    top: 0,
                    left: 0,
                    zIndex: -1
                }}
            >
                <source src="/videos/login_bg.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </Box>
    );
};

export default BackgroundPattern;
