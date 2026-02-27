import { Box, Paper, Typography, Container, Breadcrumbs, Link, Button } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import workflowImage from '../images/Workflow.jpeg';
import DocumentScannerIcon from '@mui/icons-material/DocumentScanner';
import HomeIcon from '@mui/icons-material/Home';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DomainVerificationIcon from '@mui/icons-material/DomainVerification';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import GroupsIcon from '@mui/icons-material/Groups';

const steps = [
  {
    title: 'Registration',
    icon: <AppRegistrationIcon sx={{ fontSize: 20, color: 'rgb(6 203 213)' }} />,
    description: 'Using SEBI registration',
    titlebgcolor: '#a6e9e1',
    titlecolor: '#333',
    number: 1
  },
  {
    title: 'Initial-Assessment',
    icon: <AssignmentIcon sx={{ fontSize: 20, color: 'rgb(223 223 8)' }} />,
    description: 'Go/No-Go Decision/Feedback',
    titlebgcolor: '#f7f771',
    titlecolor: '#333',
    number: 2
  },
  {
    title: 'Submission of Application',
    icon: <DomainVerificationIcon sx={{ fontSize: 20, color: '#30ab48' }} />,
    description: 'Interaction with GP & AIF Appraisal',
    titlebgcolor: '#82f398',
    titlecolor: '#333',
    number: 3
  },
  {
    title: 'AIF Screening Committee',
    icon: <FitScreenIcon sx={{ fontSize: 20, color: '#6d18dd' }} />,
    description: 'Appraisal Submission & Shortlisting/Feedback',
    titlebgcolor: '#aca9f5',
    titlecolor: '#333',
    number: 4
  },
  {
    title: 'Pension Funds Investment Committee',
    icon: <InsertChartIcon sx={{ fontSize: 20, color: '#f7b900' }} />,
    description: 'EOI by Pension Funds',
    titlebgcolor: '#f5d576',
    titlecolor: '#333',
    number: 5
  },
  {
    title: 'Documentation',
    icon: <DocumentScannerIcon sx={{ fontSize: 20, color: '#1e7d6f' }} />,
    description: 'Finalization of Legal Documents, Commercials & Execution of Documents',
    titlebgcolor: '#1cebcc',
    titlecolor: '#333',
    number: 6
  },
  {
    title: 'Onboarding of AIFs',
    icon: <GroupsIcon sx={{ fontSize: 20, color: '#00bd31' }} />,
    description: 'Capital Drawdown Monitoring',
    titlebgcolor: '#1ceb52e3',
    titlecolor: '#333',
    number: 7
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
  const horizontalGap = 180 // Increased to prevent overlapping
  const n = steps.length
  const totalWidth = (n - 1) * horizontalGap + cardWidth + 60
  const svgWidth = totalWidth
  const svgHeight = 350

  // Marker positions
  const markers = steps.map((_, i) => ({
    x: 100 + i * horizontalGap,
    y: i % 2 === 0 ? 70 : 220, // Even at top, Odd at bottom
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
    <Container maxWidth="xl" sx={{ pt: '90px', pb: '50px' }}>
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
          {/* <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: '20px' }}>
              <Button variant="contained" sx={{ backgroundColor: '#34344b', color: 'white', fontWeight: 600, textTransform: 'capitalize' }} startIcon={<KeyboardDoubleArrowLeftIcon />} className='btn-dark' href="#/home">Back To Application List</Button>
          </Box> */}
      </Box>
      <Box sx={{ p: 0, bgcolor: '#fdfdfd' }}>
        <Box sx={{ width: '100%', overflowX: 'auto', display: 'flex', justifyContent: 'center' }}>
          <Box
            component="img"
            src={workflowImage}
            alt="Workflow diagram"
            sx={{ width: '100%', height: '580px' }}
          />
        </Box>
      </Box>
    </Container>
  )
}

export default Workflow
