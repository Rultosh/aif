import React, { FC } from 'react';
import {Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import {  useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import { styled } from '@mui/material/styles';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import { useAppSelector } from "../../../app/hooks";




const StyledList = styled(List)({
    // selected and (selected + hover) states
    '&& .Mui-selected, && .Mui-selected:hover': {
        backgroundColor: '#363062',
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
        borderRadius: '8px',
        textDecoration: 'none',
    },
    // hover states
    '& .MuiListItemButton-root:hover': {
        backgroundColor: '#363062',
        opacity: 0.5,
        '&, & .MuiListItemIcon-root': {
            color: 'white',
        },
    },
});


let liItems = ["2A. Key Features of the Fund", "2B. Details of Fund Raising", "2C. Investment, divestment &other matters", "2D. Deal Flow", "2E. Due Deligance, Documentation and Monitoring", "2F. MIS and Communication to Contriutors", "2G. Investment Manager", "2H. Past Fund(s) managed by the Investment Manager", "2I. Fund Related Documnets", "2J. KYC Details and Undertakings", "2K. Declaration"]
let navLiItems = ["detailed2A", "detailed2B", "detailed2C", "detailed2D", "detailed2E", "detailed2F", "detailed2G", "detailed2H", "detailed2I", "detailed2J", "detailed2K"]


export const SideNavBar = () => {

    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [value, setValue] = React.useState(0);
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const activeNavIndex = useAppSelector(state => state.sideNavBarStore.activeBar)
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }
    const navigate = useNavigate()

    
    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
        navigate(`/Detailed/${id}/${navLiItems[index]}`);
    };

    useEffect(() => {
        console.log("check id number", id)
        if (!id) {

            //ss navigate(`/Detailed/${id}/2A`)
        }
    });
    return (

        <Grid item xs={3}>
            <Card sx={{ display: 'flex', color: '#363062' }}>
                <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                    <StyledList>
                        <List>
                            {liItems.map((item) => (
                                <Box >
                                    <ListItem disablePadding>
                                        <ListItemButton selected={activeNavIndex === liItems.indexOf(item)}
                                            onClick={() => handleListItemClick(liItems.indexOf(item))}>

                                            <Typography variant="subtitle2" sx={{ flex: 1, mt: 1 }}>
                                                {liItems[liItems.indexOf(item)]}
                                            </Typography>
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                </Box>))}

                        </List>
                    </StyledList>
                </CardContent>
            </Card>
        </Grid>


    );
}
export default SideNavBar;