import React from 'react'
import { Box, Button, Stack, Paper, Typography, Grid } from '@mui/material'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import DownloadIcon from '@mui/icons-material/Download'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import PersonIcon from '@mui/icons-material/Person'
import LockIcon from '@mui/icons-material/Lock'

const StyledButtonsPage: React.FC = () => {
  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: 600 }}>
        Button UI Samples
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<PersonIcon />}
                sx={{
                  background: 'linear-gradient(90deg,#2fb3ff,#1a7bff)',
                  color: 'white',
                  borderRadius: '28px',
                  px: 3,
                  py: 1.2,
                  boxShadow: '0 8px 20px rgba(45, 100, 255, 0.25)'
                }}
              >
                Main Page
              </Button>

              <Button
                variant="outlined"
                endIcon={<ArrowForwardIosIcon />}
                sx={{
                  borderRadius: '28px',
                  borderColor: '#ff7b5c',
                  color: '#ff6b4a',
                  px: 3,
                  py: 1.2
                }}
              >
                Buy Now
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg,#ff7a4a,#ffb86b)',
                  color: '#fff',
                  borderRadius: '12px',
                  px: 3,
                  py: 1
                }}
                endIcon={<ShoppingCartIcon />}
              >
                Apply Now
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: 'linear-gradient(90deg,#2e9bff,#0056ff)',
                  borderRadius: '28px',
                  color: 'white',
                  px: 3,
                  py: 1.2
                }}
              >
                Watch Now
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: '24px',
                  px: 3,
                  py: 1,
                  borderColor: '#bfe8ff',
                  color: '#1877f2'
                }}
                endIcon={<DownloadIcon />}
              >
                Download
              </Button>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }} elevation={2}>
            <Stack spacing={2}>
              <Button
                variant="contained"
                startIcon={<LockIcon />}
                sx={{
                  background: 'linear-gradient(90deg,#fff7ea,#ffd7a6)',
                  color: '#8a4b12',
                  borderRadius: '24px',
                  px: 3,
                  py: 1
                }}
              >
                Login
              </Button>

              <Button
                variant="outlined"
                sx={{
                  borderRadius: '28px',
                  px: 3,
                  py: 1.2,
                  borderColor: '#ff6b4a',
                  color: '#ff6b4a'
                }}
                endIcon={<ArrowForwardIosIcon />}
              >
                Share It
              </Button>

              <Button
                variant="contained"
                sx={{
                  background: '#ffffff',
                  color: '#ff6b4a',
                  borderRadius: '28px',
                  px: 3,
                  py: 1.2,
                  border: '2px solid rgba(255,107,74,0.12)'
                }}
              >
                Sign Up
              </Button>

              <Button
                variant="contained"
                startIcon={<FavoriteBorderIcon />}
                sx={{
                  background: 'linear-gradient(90deg,#ffd7a6,#fff1e6)',
                  color: '#cc5a2b',
                  borderRadius: '20px',
                  px: 3,
                  py: 1
                }}
              >
                Follow
              </Button>

              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  background: 'linear-gradient(90deg,#ffffff,#f2f6ff)',
                  color: '#0b57d0',
                  borderRadius: '28px',
                  px: 3,
                  py: 1.2,
                  boxShadow: '0 6px 18px rgba(13,86,209,0.18)'
                }}
              >
                Download
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default StyledButtonsPage
