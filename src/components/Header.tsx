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

import loginRupeeIconImg from '../images/logo_rupee_symbol.png'
import { useAppSelector } from '../app/hooks';
import { selectUsers } from '../features/admin/adminSlice';

const Header = (props: any) => {

  const token = localStorage.getItem('token')
  const [loggedIn, setLoggedIn] = React.useState<boolean>(token !== undefined && false);
  const usersState = useAppSelector(selectUsers)
  

  React.useEffect(() => {
    console.log(JSON.stringify(usersState.me))
    if (usersState.me.role) setLoggedIn(true);
    else setLoggedIn(false);
  }, [usersState.status.fetchStatus])

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    setLoggedIn(false);
    navigate('/login');
  }

  const navItems = ['FAQs', 'Help', 'vcfapplication@sidbi.in'];
  let count = 0;
  return (
    <Box sx={{ flexGrow: 1 }} className={props.className}>
      <Box component="section" sx={{ position: 'absolute', zIndex: 999999, width: '100%', transition: 'all 0.3s ease', background: 'rgb(0 0 0 / 20%)', top: 0, padding: '5px 0' }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {<Link to={`/Home`} style={{ cursor: 'pointer', color: '#FFFFFF', textDecoration: 'none', fontSize: '16px' }}>
                    <Box
                        component="img"
                        sx={{ width: '90px', aspectRatio: '16/9', objectFit: 'contain', position: 'relative', justifyContent: "left", display: { xs: 'block', padding: '2px' } }}
                        alt="success"
                        src={"https://npstrust.org.in/sites/default/files/logo.png"}
                    />
                </Link>}
            <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.8rem', sm: '1rem' }, color: 'rgba(255,255,255,0.9)' }}>
              Fund of Funds
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, sm: 2 } }}>
              <Typography>
                <Link to={`/Preliminary`} style={{ cursor: 'pointer', color: '#FFFFFF', textDecoration: 'none', fontSize: '16px' }}>
                  Preliminary
                </Link>
              </Typography>
              <Box component="span" sx={{ opacity: 0.4, color: '#ffffff' }}>|</Box>
              <Link to={`/Workflow`} style={{ cursor: 'pointer', color: '#FFFFFF', textDecoration: 'none', fontSize: '16px' }}>
                  Workflow
                </Link>
              {token && <><Box component="span" sx={{ opacity: 0.4, color: '#ffffff' }}>|</Box>
                <Typography variant="caption" sx={{ cursor: 'pointer', fontSize: { xs: '0.65rem', sm: '0.75rem' }, fontWeight: 500, color: '#ffffff' }}>
                <div onClick={handleLogout} style={{ cursor: 'pointer', color: '#FFFFFF', textDecoration: 'none', fontSize: '16px' }}>
                  Logout
                </div>
                </Typography></>}
            </Box>
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
  )
}

export default Header;
