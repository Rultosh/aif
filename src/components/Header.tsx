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

import loginRupeeIconImg from '../images/logo_rupee_symbol.png'





const Header = (props: any) => {

  const navItems = ['FAQs', 'Help', 'Toll Free: 1800 XXX 1234'];
  let count = 0;
  return (
    <AppBar position="static" component='nav' sx={{ backgroundColor: '#363062' }}>
      <Container maxWidth="xl">
      <Toolbar disableGutters>
        <Box
          className='logoIconRupee'
          component="img"
          sx={{ position: 'relative', justifyContent: "center", display: { xs: 'block' } }}
          alt="success"
          src={loginRupeeIconImg}
        />

        <Typography
          variant="h6"
          component="div"
          sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' ,fontWeight:'normal'} }}
        >
         {/* Alternative Investment Fund */}
          <div id="Component_15__2" className="Component_15___2">
            <div id="ALTERNATE_INVESTMENT_FUND__" style={{ fontSize: '40px', color: 'rgba(255,255,255,1)' }}>
              <span>A</span>
              <span style={{fontSize:'25px'}}>LTERNATIVE </span>
              <span>I</span>
              <span style={{fontSize:'25px'}}>NVESTMENT</span>
              <span> F</span>
              <span style={{fontSize:'25px'}}>UND</span>
              <span>  </span>
            </div>
          </div>
        </Typography>
       
        <div className='logoLineAnimation'></div>
          {navItems.map((item) => {
            count++;
            return (
             <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
               {item == 'FAQs' ? <Button
                                href="/templates/FAQs.zip"
                                disableElevation
                                sx={{ color: '#FFFFFF', textTransform: 'none', mt: 3, mb: 3, ml: 2, height: '30px', borderRight: '1px solid white', borderRadius: '0' }} >
                                {item}
                            </Button>
            :<Button key={item} sx={{ color: '#fff', pt: 0.5, pb: 0.5, borderRight: navItems.length == count? '0px solid white' : '1px solid white', borderRadius: '0' }}>
              {item}
            </Button>}
            </Box>
          )})}
        
        </Toolbar >
      </Container>
    </AppBar>
  )
}

export default Header;