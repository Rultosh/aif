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
import { Link } from 'react-router-dom'
import Divider from '@mui/material/Divider';





const Header = (props: any) => {

  const navItems = ['FAQs', 'Help', 'Toll Free: 1800 XXX 1234'];
  return (
    <AppBar position="static" component='nav' sx={{ backgroundColor: '#363062' }}>
      <Container maxWidth="xl">
      <Toolbar disableGutters>
        
        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' ,fontWeight:'bold'} }}
        >
         Alternate Investment Fund
        </Typography>
        <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
          {navItems.map((item) => (
            
            <Button key={item} sx={{ color: '#fff' }}>
              {item}
            </Button>
          ))}
        </Box>
        </Toolbar >
      </Container>
    </AppBar>
  )
}

export default Header;