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
import logo from '../images/logo.png';
import ffsLogo from '../images/ffs_final_logo.png';
import { Link, useNavigate } from 'react-router-dom'
import { fetchRoleAsync, selectUsers } from '../features/admin/adminSlice'
import { wrapArgument } from "../lib/api-status/actionWrapper";
import { useEffect, useState } from "react";
import uuid from "react-uuid";
import { useAppSelector, useAppDispatch } from '../app/hooks'
import { FetchStatus } from "../lib/api-status/IStatus";
import { Textarea } from '@mui/joy';




const NavigationBar = (props: any) => {

  const navigate = useNavigate();
  const [actionUid] = useState(uuid())
  const userPages = ['Home', 'Workflow', 'Preliminary'];
  const adminPages = ['Home', 'Workflow'];
  const userAdminPages = ['Admin', 'Workflow'];
  const settings = ['Change Password','Logout'];
  const dispatch = useAppDispatch()
  const usersState = useAppSelector(selectUsers)
  const [pages, setPages] = useState<string[] | undefined>(userPages);
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
  const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
  const role = usersState?.role;
  const userName = usersState?.me?.contactPerson;
  
  const pathname = (window.location.pathname).toLowerCase();
  
  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = (ev: any) => {
    setAnchorElUser(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  }

  const handleMeunActions = (action:string) => {
    if(action =='Logout'){
      handleLogout()
    }
    else{
      navigate('/changePassword');
    }
  }


  useEffect(() => {
      console.log('calling fetchRoleAsync');
      dispatch(fetchRoleAsync(
        wrapArgument(actionUid, props.prelimApplicationId)
      ))
  }, [])


  useEffect(() => {
    if (usersState.status.fetchStatus === FetchStatus.IDLE  && ['ADMIN'].includes(usersState.role!= undefined? usersState.role : '')) {
      setPages(adminPages)
    }
    if (usersState.status.fetchStatus === FetchStatus.IDLE  && ['USERADMIN'].includes(usersState.role!= undefined? usersState.role : '')) {
      setPages(userAdminPages)
    }
  }, [role])


  function stringToColor(string: string) {
    let hash = 0;
    let i;
  
    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }
  
    let color = '#';
  
    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.slice(-2);
    }
    /* eslint-enable no-bitwise */
  
    return color;
  }

  function getInitials(name:string){
    let nameArr = name.split(' ')
    if (nameArr.length > 1){
      return nameArr[0][0]+nameArr[1][0]
    }
    return nameArr[0][0]
  }
  
  function stringAvatar() {
    let name = userName || "";
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: getInitials(name),
    };
  }

  return (
    <AppBar position="static" component='nav' sx={{ backgroundColor: 'white' }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>

        <Box
            component="img"
            sx={{
              height: 55,
              mr : 2,
              display: { xs: 'none', md: 'block' },
            }}
            alt="ffsLogo"
            src={ffsLogo}
          />

          <Box
            component="img"
            sx={{
              height: 55,
              mr : 2,
              display: { xs: 'none', md: 'block' },
            }}
            alt="ffsLogo"
            src={ffsLogo}
          />

          <Box
            component="img"
            sx={{
              height: 55,
              display: { xs: 'none', md: 'block' },
            }}
            alt="sidbi_logo"
            src={logo}
          />


          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
              sx={{ flexWrap: 'nowrap', color: '#363062' }}
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              {pages != undefined ? pages.map((page) => (
                <MenuItem key={page} onClick={handleCloseNavMenu}>
                  <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700 }}>
                    <Link to={`/${page}`} style = {{cursor:'pointer', color: '#000000', textDecoration: 'none', fontSize: '16px'}}>
                      {page}
                    </Link>
                  </Typography>
                </MenuItem>
              )) : <></>}
            </Menu>
          </Box>
          <Typography
            variant="h5"
            noWrap
            component="a"
            href=""
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 100,
              fontFamily: 'monospace',
              fontWeight: 700,
              letterSpacing: '.3rem',
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            <Box
              component="img"
              sx={{
                height: 64,
                display: { xs: 'block', md: 'none' }, mr: 1,

              }}
              alt="ffsLogo"
              src={ffsLogo}
            />

            <Box
              component="img"
              sx={{
                height: 64,
                display: { xs: 'block', md: 'none' }, mr: 1,

              }}
              alt="sidbi_logo"
              src={logo}
            />
          </Typography>



          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {pages != undefined ? pages.map((page) => {
              let pageLowerCase = page.toLowerCase();
              return (
              <Button
                key={page}
                onClick={handleCloseNavMenu}
                sx={{ ml: '50px', my: 2, color: '#363062', display: 'block', fontSize: '15px', fontWeight: 'bold', textTransform: 'none' }}
                // className={"menuItemHeader"}
                className={"menuItemHeader " + (pathname.includes(pageLowerCase)? "activePage" : "")}
              >
                <div className='headerHoverHightlightTop'></div>
                <Link to={`/${page}`} style = {{cursor:'pointer', color: '#000000', textDecoration: 'none', fontSize: '16px' }}>
                  {page}
                </Link>
                <div className='headerHoverHightlight'></div>
              </Button>
            )}) : <></>}
          </Box>

          <Box sx={{ flexGrow: 0, display: { xs: 'block' } }}>
            <Tooltip title={userName}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
              <Avatar {...stringAvatar()} />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '45px' }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center" onClick={() => handleMeunActions(setting)}>{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  )
}

export default NavigationBar;