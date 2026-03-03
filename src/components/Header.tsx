import * as React from 'react';
import AppBar from '@mui/material/AppBar';
import { Container, Toolbar } from '@mui/material';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import logo from '../images/logo.png'
import { Link, useNavigate } from 'react-router-dom'
import Divider from '@mui/material/Divider';
import MailIcon from '@mui/icons-material/Mail';
import headerBg from '../images/header_bg.png';
import logoNps from '../images/logo_nps.png';
// import AccountCircleIcon from '@mui/icons-material/AccountCircle';

import loginRupeeIconImg from '../images/logo_rupee_symbol.png'
import { useAppSelector } from '../app/hooks';
import { selectUsers } from '../features/admin/adminSlice';

const Header = (props: any) => {

  const auth = useAppSelector(state => state.auth);
  const token = auth.token || localStorage.getItem('token');
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const usersState = useAppSelector(selectUsers)


  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    // We should ideally dispatch a logout action here if it exists to clear Redux state
    // For now, since redirection happens in App.tsx based on the token which we manually cleared from localStorage,
    // we need to make sure the app re-renders or navigates.
    navigate('/login');
    window.location.reload(); // Hard reload to clear all state if no logout action is available
  }

  const navItems = ['FAQs', 'Help', 'aif.investment@npstrust.org.in'];
  let count = 0;
  return (
    <>
      <Box sx={{ flexGrow: 1 }} className={props.className}>
        <Box component="section" sx={{
          position: 'absolute',
          zIndex: 999,
          width: '100%',
          transition: 'all 0.3s ease',
          background: '#1942b6',
          top: 0,
          padding: '8px 0'
        }}>
          <Container maxWidth={"xl"}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography sx={{ fontWeight: 400, fontSize: '26px', color: '#ea6c3c' }}>
                    NPS
                  </Typography>
                  <Typography sx={{ fontWeight: 700, fontSize: '26px', color: '#ffffff' }}>
                    भारत
                  </Typography>
                  <Typography sx={{ fontWeight: 400, fontSize: '26px', color: '#ea6c3c' }}>
                    Fund of Funds
                  </Typography>
                </Box>
                <Typography variant="caption" sx={{ fontSize: '16px', color: '#e7fdff', fontStyle: 'italic', fontWeight: 400, lineHeight: 1 }}>
                  Investing for Bharat
                </Typography>
              </Box>

              {token && <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <>
                    {usersState.role === 'USERADMIN' && (
                      <>
                        <Link
                          to="/admin"
                          style={{
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500
                          }}
                        >
                          User Admin
                        </Link>
                        <Box sx={{ borderRight: '2px solid #82a0ff', height: 28, margin: '0 8px' }} />
                      </>
                    )}

                    {usersState.role === 'USER' && (
                      <>
                        <Link
                          to="/Workflow"
                          style={{
                            cursor: 'pointer',
                            color: '#FFFFFF',
                            textDecoration: 'none',
                            fontSize: '14px',
                            fontWeight: 500
                          }}
                        >
                          Workflow
                        </Link>
                        <Box sx={{ borderRight: '2px solid #82a0ff', height: 28, margin: '0 8px' }} />
                      </>
                    )}

                    {/* <Link
                      to="/setPassword"
                      style={{
                        cursor: 'pointer',
                        color: '#FFFFFF',
                        textDecoration: 'none',
                        fontSize: '14px',
                        fontWeight: 500
                      }}
                    >
                      Reset Password
                    </Link> */}

                    <Box sx={{ borderRight: '2px solid #82a0ff', height: 28, margin: '0 8px' }} />
                    {/* <Box component="span" sx={{ opacity: 0.6, color: '#ffffff', fontSize: '18px' }}>|</Box> */}
                    {/* user avatar menu */}
                    <IconButton
                      size="small"
                      sx={{
                        '&:hover': { bgcolor: '#2196f3' },
                        'img': {
                          width: 34,
                          height: 34
                        },
                        p: 0
                      }}
                      onClick={(e) => {
                        console.log('avatar clicked', e.currentTarget);
                        setAnchorEl(e.currentTarget as HTMLElement);
                      }}
                    >
                      <Box
                        component="img"
                        src={require('../images/user.svg').default}
                        alt="user"
                        sx={{ width: 28, height: 28 }}
                      />
                    </IconButton>
                    {console.log('anchorEl state', anchorEl)}
                    <Menu
                      id="user-menu"
                      anchorEl={anchorEl}
                      open={Boolean(anchorEl)}
                      onClose={() => setAnchorEl(null)}
                      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                      transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                      // PaperProps={{ sx: { zIndex: 2000 } }}
                      MenuListProps={{
                        'aria-labelledby': 'user-avatar-button',
                      }}
                        PaperProps={{
                          elevation: 0,
                          sx: {
                            zIndex: 2000,
                            overflow: 'visible',
                            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                            mt: 1.5,
                            '& .MuiAvatar-root': {
                              width: 32,
                              height: 32,
                              ml: -0.5,
                              mr: 1,
                            },
                            '&::before': {
                              content: '""',
                              display: 'block',
                              position: 'absolute',
                              top: 0,
                              right: 14,
                              width: 10,
                              height: 10,
                              bgcolor: 'background.paper',
                              transform: 'translateY(-50%) rotate(45deg)',
                              zIndex: 0,
                            },
                          },
                        }}
                    >
                      <MenuItem onClick={() => { setAnchorEl(null); handleLogout(); }}>Logout</MenuItem>
                    </Menu>
                  </>
                </Box>
              </>}
            </Box>
          </Container>
        </Box>
        {/* Top Utility Bar Section */}
        {/* <Box sx={{
        bgcolor: 'rgba(54, 48, 98, 0.4)', // Semi-transparent version of #363062
        backdropFilter: 'blur(10px)',
        color: 'white',
        py: 0.5,
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        position: 'sticky',
        top: 0,
        zIndex: 1100
      }}>
        <Container maxWidth="xl">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'rgba(255,255,255,0.9)' }}>
              Fund of Funds
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500 }}>
                Skip to Main Content
              </Typography>
              <Box component="span" sx={{ opacity: 0.4 }}>|</Box>
              <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500 }}>
                Screen Reader Access
              </Typography>
              <Box component="span" sx={{ opacity: 0.4 }}>|</Box>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500 }}>A-</Typography>
                <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500 }}>A</Typography>
                <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500 }}>A+</Typography>
              </Box>
              <Box sx={{ display: 'flex', gap: 0.8, alignItems: 'center', ml: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: 'white', border: '1px solid #ccc', cursor: 'pointer', display: { xs: 'none', sm: 'block' } }} />
                <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#00BCD4', cursor: 'pointer', display: { xs: 'none', sm: 'block' } }} />
              </Box>
              <Box component="span" sx={{ opacity: 0.4 }}>|</Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}>
                <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.7rem', sm: '0.8rem' } }}>
                  अ / A
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box> */}
      </Box>
    </>
  )
}

export default Header;
