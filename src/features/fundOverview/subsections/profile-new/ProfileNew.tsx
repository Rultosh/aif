import React, * as Rect from 'react'
import { Card, CardContent, Typography, Box, Button, Grid, Divider } from "@mui/material"
import { TeamMemberList } from "./teamMember/TeamMemberList"
import { useNavigate, useParams } from 'react-router-dom';
import ArrowLeftIcon from '@mui/icons-material/ArrowLeft';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import SaveIcon from '@mui/icons-material/Save';
import { useState, useEffect } from "react"

export const ProfileNew = (props: any) => {
  const { id } = useParams();
  const navigate = useNavigate()

  const handleClick = (ev: any, navTo: string) => {
    if (navTo === 'previous') {
      navigate(`/preliminary/${id}/fund`)
    } else {
      navigate(`/preliminary/${id}/selfRating`)
    }
  }

  useEffect(() => {
    if (props.checkUnAuth) {
      navigate('/login')
    }
  })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  function handleClickSave() { }

  return (
    <div className="formAnimation">
      <Card sx={{
        display: 'flex',
        mb: 3,
        flexDirection: 'column',
        borderRadius: '16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        border: '1px solid rgba(0,0,0,0.05)'
      }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: '#363062', mb: 1 }}>
              Team Profile
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Experience of Investment Team Members (please furnish for each team member separately)
            </Typography>
          </Box>

          <Box sx={{
            p: 3,
            borderRadius: '12px',
            backgroundColor: 'rgba(54, 48, 98, 0.02)',
            border: '1px solid rgba(54, 48, 98, 0.1)',
            mb: 4
          }}>
            <TeamMemberList checkUnAuth={props.checkUnAuth} />
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              onClick={(e) => handleClick(e, "previous")}
              startIcon={<ArrowLeftIcon />}
              variant="outlined"
              sx={{
                textTransform: 'none',
                borderRadius: '8px',
                px: 3,
                fontWeight: 600,
                color: '#363062',
                borderColor: '#363062',
                '&:hover': {
                  borderColor: '#4d4585',
                  backgroundColor: 'rgba(54, 48, 98, 0.04)'
                }
              }} >
              Back to Fund Overview
            </Button>

            <Button
              onClick={handleClickSave}
              variant="contained"
              sx={{
                position: 'fixed',
                right: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 1100,
                borderRadius: '12px 0 0 12px',
                minWidth: 'auto',
                px: 2,
                py: 2,
                fontWeight: 700,
                backgroundColor: '#363062',
                boxShadow: '0 4px 20px rgba(54, 48, 98, 0.3)',
                textTransform: 'none',
                '&:hover': {
                  backgroundColor: '#4d4585',
                  boxShadow: '0 6px 24px rgba(54, 48, 98, 0.4)',
                  pr: 3,
                  transition: 'all 0.2s'
                },
                transition: 'all 0.2s'
              }} >
              <SaveIcon />
            </Button>

            <Box>
              <Button
                onClick={handleClickSave}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 2, // Reduced padding for icon-only
                  fontWeight: 600,
                  backgroundColor: '#363062',
                  boxShadow: '0 4px 12px rgba(54, 48, 98, 0.2)',
                  minWidth: 'auto', // Icon-only look
                  '&:hover': {
                    backgroundColor: '#4d4585',
                    boxShadow: '0 6px 16px rgba(54, 48, 98, 0.3)'
                  },
                  mr: 2
                }} >
                <SaveIcon />
              </Button>
              <Button
                onClick={(e) => handleClick(e, "next")}
                endIcon={<ArrowRightIcon />}
                variant="contained"
                sx={{
                  textTransform: 'none',
                  borderRadius: '8px',
                  px: 4,
                  fontWeight: 600,
                  backgroundColor: '#D586F7',
                  color: 'white',
                  boxShadow: '0 4px 12px rgba(213, 134, 247, 0.2)',
                  '&:hover': {
                    backgroundColor: '#c466e8',
                    boxShadow: '0 6px 16px rgba(213, 134, 247, 0.3)'
                  }
                }} >
                Self Rating
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </div>
  );
}