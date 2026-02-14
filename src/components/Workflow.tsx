import { Box, Paper, Typography, Container, Breadcrumbs, Link, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import LightbulbIcon from '@mui/icons-material/Lightbulb'
import HomeIcon from '@mui/icons-material/Home';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import PanoramaHorizontalSelectIcon from '@mui/icons-material/PanoramaHorizontalSelect';
import DnsIcon from '@mui/icons-material/Dns';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';

const steps = [
  {
    title: 'Registration',
    icon: <AppRegistrationIcon sx={{ fontSize: 20, color: 'rgb(6 203 213)' }} />,
    description: '',
    titlebgcolor: '#a6e9e1',
    titlecolor: '#333',
    number: 1
  },
  {
    title: 'Stage-I Evaluation',
    icon: <PanoramaHorizontalSelectIcon sx={{ fontSize: 20, color: 'rgb(223 223 8)' }} />,
    description: 'Preliminary Information Submission',
    titlebgcolor: '#f7f771',
    titlecolor: '#333',
    number: 2
  },
  {
    title: 'Stage-II Detailed Evaluation',
    icon: <DnsIcon sx={{ fontSize: 20, color: '#f7b900' }} />,
    description: 'Comprehensive Assessment and Rating of AIF',
    titlebgcolor: '#f5d576',
    titlecolor: '#333',
    number: 3
  },
  {
    title: 'Screening Committee',
    icon: <FitScreenIcon sx={{ fontSize: 20, color: '#6d18dd' }} />,
    description: 'Shortlisting of AIFs',
    titlebgcolor: '#aca9f5',
    titlecolor: '#333',
    number: 4
  },
  {
    title: 'Pension Funds Investment Committee',
    icon: <InsertChartIcon sx={{ fontSize: 20, color: '#30ab48' }} />,
    description: 'Expression of Interest by PFs',
    titlebgcolor: '#82f398',
    titlecolor: '#333',
    number: 5
  },
  {
    title: 'Onboarding of AIF',
    icon: <LightbulbIcon sx={{ fontSize: 20, color: '#1e7d6f' }} />,
    description: 'Agreement Finalization',
    titlebgcolor: '#1cebcc',
    titlecolor: '#333',
    number: 6
  }
]

const Workflow = (props:any) => {

  const navigate = useNavigate();

  useEffect(() => {
      if(props.checkUnAuth){
          navigate('/login')
      }
  })
  
  const cardWidth = 150
  const horizontalGap = 200 // Increased to prevent overlapping
  const n = steps.length
  const totalWidth = (n - 1) * horizontalGap + cardWidth + 60
  const svgWidth = totalWidth
  const svgHeight = 350

  // Marker positions
  const markers = steps.map((_, i) => ({
    x: 100 + i * horizontalGap,
    y: i % 2 === 0 ? 70 : 260, // Even at top, Odd at bottom
    num: i + 1
  }))

  // Path generation
  let pathD = `M ${markers[0].x} ${markers[0].y}`
  for (let i = 0; i < markers.length - 1; i++) {
    const m1 = markers[i]
    const m2 = markers[i + 1]
    const cp1x = m1.x + horizontalGap / 2
    const cp1y = m1.y
    const cp2x = m1.x + horizontalGap / 2
    const cp2y = m2.y
    pathD += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${m2.x} ${m2.y}`
  }

  return (
    <Container maxWidth="xl" sx={{ pt: '80px', pb: '50px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ mb: '30px' }}>
              <Typography variant="h5" sx={{ fontWeight: 600, color: '#013d7b' }}>Workflow</Typography>
              <Breadcrumbs aria-label="breadcrumb">
                <Link
                  underline="hover"
                  sx={{ display: 'flex', alignItems: 'center' }}
                  color="inherit"
                  href="#/home"
                >
                  <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                  Home
                </Link>
                <Typography variant="body2"
                 sx={{ color: '#476bbc', display: 'flex', alignItems: 'center' }}
                >
                <AccountTreeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
                Workflow
                </Typography>
              </Breadcrumbs>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '20px' }}>
              <Button variant="contained" sx={{ backgroundColor: '#34344b', color: 'white', fontWeight: 600, textTransform: 'capitalize' }} startIcon={<KeyboardDoubleArrowLeftIcon />} className='btn-dark' href="#/home">Back To Application List</Button>
          </Box>
      </Box>
      <Box sx={{ p: 0, bgcolor: '#fdfdfd' }}>
        <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Box sx={{ position: 'relative', width: svgWidth, height: svgHeight }}>
            {/* Wave Path */}
            <svg width={svgWidth} height={svgHeight} viewBox={`0 0 ${svgWidth} ${svgHeight}`} style={{ position: 'absolute', top: 0, left: 0 }}>
              <path
                d={pathD}
                stroke="#e0e0e0"
                strokeWidth="6"
                fill="none"
                strokeLinecap="round"
              />

              {/* Arrows */}
              {/* {markers.slice(0, -1).map((m1, i) => {
                const m2 = markers[i + 1]
                const isUp = i % 2 === 0
                const arrowX = (m1.x + m2.x) / 2
                const arrowY = (m1.y + m2.y) / 2

                return (
                  <g key={`arrow-group-${i}`} transform={`translate(${arrowX}, ${arrowY}) rotate(${isUp ? -45 : 45})`}>
                    <path
                      d="M -12 8 L 0 -12 L 12 8 Z"
                      fill="#dcdcdc"
                      style={{ filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.15))' }}
                    />
                  </g>
                )
              })} */}
              {markers.map((m) => (
                <g key={`marker-${m.num}`}>
                  <circle cx={m.x} cy={m.y} r={18} fill="#eee" />
                  <text x={m.x} y={m.y + 7} textAnchor="middle" fill="#999" fontSize="17" fontWeight="bold">
                    {m.num}
                  </text>
                </g>
              ))}
            </svg>

            {/* Cards */}
            {steps.map((s, i) => {
              const m = markers[i]
              const isBottomMarker = i % 2 !== 0
              const cardX = m.x - cardWidth / 2
              // Adjusted offsets to ensure no overlap with the wave
              const cardY = isBottomMarker ? m.y - 190 : m.y + 60

              return (
                <Paper
                  key={i}
                  elevation={4}
                  sx={{
                    position: 'absolute',
                    left: cardX,
                    top: cardY,
                    width: cardWidth,
                    borderRadius: '16px',
                    // overflow: 'hidden', // Changed to visible for the half-outside icon
                    overflow: 'visible',
                    zIndex: 2,
                    border: '1px solid #f0f0f0',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                  }}
                >
                  <Box sx={{ bgcolor: s.titlebgcolor, position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', pt: 2.8, pb: 1.5, borderTopLeftRadius: '16px', borderTopRightRadius: '16px', borderBottomLeftRadius: (s.description === '') ? '16px' : undefined, borderBottomRightRadius: (s.description === '') ? '16px' : undefined }}>
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 0,
                        left: '50%',
                        transform: 'translate(-50%, -50%)', // Centered on the top edge
                        width: 36,
                        height: 36,
                        bgcolor: '#fff',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                        zIndex: 3
                      }}
                    >
                      {s.icon}
                    </Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 800, textAlign: 'center', px: 1, lineHeight: 1.1, color: s.titlecolor, fontSize: '0.9rem' }}>
                      {s.title}
                    </Typography>
                  </Box>
                  {s.description && <Box sx={{ py: 2, px: 1, textAlign: 'center', bgcolor: '#fff', maxHeight: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'center', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
                    <Typography variant="caption" sx={{ color: '#888', fontSize: '0.7rem', display: 'block', lineHeight: 1.2 }}>
                      {s.description}
                    </Typography>
                  </Box>}
                </Paper>
              )
            })}
          </Box>
        </Box>
      </Box>
    </Container>
  )
}

export default Workflow
