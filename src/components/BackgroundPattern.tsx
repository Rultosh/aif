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
                // Deep blue gradient background
                background: 'linear-gradient(135deg, #0a1033 0%, #1a237e 40%, #2d3882 100%)',
                overflow: 'hidden',
            }}
        >
            <svg
                width="100%"
                height="100%"
                viewBox="0 0 1440 900"
                preserveAspectRatio="xMidYMid slice"
                style={{ position: 'absolute', top: 0, left: 0 }}
            >
                <defs>
                    <pattern
                        id="dots"
                        x="0"
                        y="0"
                        width="24"
                        height="24"
                        patternUnits="userSpaceOnUse"
                    >
                        <circle cx="2" cy="2" r="1.5" fill="rgba(255, 255, 255, 0.15)" />
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
                    <line x1="250" y1="50" x2="650" y2="450" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
                </g>

                {/* --- Geometric Lines --- */}
                {/* Sharp diagonal lines cutting across */}
                <line x1="850" y1="650" x2="1050" y2="450" stroke="rgba(255, 255, 255, 0.15)" strokeWidth="1.5" />
                <line x1="950" y1="650" x2="1250" y2="350" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

                {/* --- Bottom Arcs (resized 50%) --- */}
                <g>
                    <circle cx="300" cy="900" r="100" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <circle cx="300" cy="900" r="150" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <circle cx="300" cy="900" r="200" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                    <circle cx="300" cy="900" r="250" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="1" />
                </g>
                {/* Thin connector line */}
                <line x1="450" y1="200" x2="650" y2="400" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

                {/* Dashed technical lines */}
                <path d="M 1100 150 L 1350 150" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                <path d="M 1150 170 L 1350 170" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />
                <path d="M 1200 190 L 1350 190" stroke="rgba(255, 255, 255, 0.1)" strokeWidth="1" />

                {/* --- Small Circles --- */}
                {/* Solid small decorative circles */}
                <circle cx="650" cy="400" r="8" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />
                <circle cx="1070" cy="430" r="12" fill="none" stroke="rgba(255, 255, 255, 0.3)" strokeWidth="2" />

                {/* Small filled circle */}
                <circle cx="1250" cy="250" r="4" fill="rgba(255, 255, 255, 0.3)" />

                {/* --- Large Background Elements --- */}
                {/* Large semi-transparent circle Top-Right */}
                <circle cx="1200" cy="100" r="140" fill="rgba(255, 255, 255, 0.05)" />

                {/* Glow Spot for depth */}
                <circle cx="300" cy="800" r="300" fill="rgba(40, 53, 147, 0.4)" filter="blur(100px)" />
            </svg>
        </Box>
    );
};

export default BackgroundPattern;
