import React from 'react';
import { Box } from '@mui/material';

const BackgroundPattern = () => {
    const token = localStorage.getItem('token');

    if (localStorage.getItem('token')) {
        // --- Authenticated State: Show SVG Pattern ---
        return (
            <Box
                sx={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100vh',
                    zIndex: -1,
                    // Deep blue gradient background
                    background: 'linear-gradient(135deg, #0a1033 0%, #1a237e 40%, #2d3882 100%)',
                    overflow: 'hidden',
                }}
            >
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 1200 900"
                    preserveAspectRatio="xMidYMid slice"
                    style={{ opacity: 0.6 }}
                >
                    <defs>
                        <pattern id="dots" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                            <circle cx="2" cy="2" r="1.5" fill="rgba(255,255,255,0.15)" />
                        </pattern>
                    </defs>

                    {/* Right side dots texture */}
                    <rect x="850" y="0" width="800" height="900" fill="url(#dots)" opacity="0.4" transform="rotate(-10 1200 450)" />

                    {/* --- Top "Half Circles" (Ripples) --- */}
                    {/* Center point at top edge (y=0) to be true half-circles, resized to 50% */}
                    <g>
                        <circle cx="500" cy="0" r="25" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="500" cy="0" r="75" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="500" cy="0" r="125" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="500" cy="0" r="175" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="500" cy="0" r="225" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />

                        {/* Intersecting Diagonal Line for Top Group */}
                        <line x1="375" y1="75" x2="575" y2="275" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
                    </g>

                    {/* --- Bottom Arcs (as seen in latest reference) --- */}
                    <g>
                        <circle cx="300" cy="900" r="100" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="300" cy="900" r="150" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="300" cy="900" r="200" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                        <circle cx="300" cy="900" r="250" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    </g>
                    {/* Floating Decorative Elements */}
                    {/* Small hollow circle top-rightish */}
                    <circle cx="900" cy="200" r="15" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" />

                    {/* Small filled dot near bottom right */}
                    <circle cx="1000" cy="700" r="4" fill="rgba(255,255,255,0.3)" />

                </svg>
            </Box>
        );
    }

    // --- Unauthenticated State: Show Video ---
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
                <source src="https://npstrust.org.in/sites/default/files/banner_video/sample.mp4" type="video/mp4" />
                Your browser does not support the video tag.
            </video>
        </Box>
    );
};

export default BackgroundPattern;
