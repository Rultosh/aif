import React, { FC } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, IconButton, Toolbar, Typography } from '@mui/material';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar';
import { useParams } from "react-router-dom";
import { useState, useEffect } from "react"
import NextWeekOutlinedIcon from '@mui/icons-material/NextWeekOutlined';
import { styled } from '@mui/material/styles';
import MoneyIcon from '@mui/icons-material/Money';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import ContentCopyRoundedIcon from '@mui/icons-material/ContentCopyRounded';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import EventNoteIcon from '@mui/icons-material/EventNote';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import fundImg from '../../images/fund.png'
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { updateStepperIndex } from './subsections/sideNavBarSlice'
import { selectedDetailedApplications } from "../detailedApplication/sidbiReference/detailedApplicationSlice";
import { selectUsers } from "../admin/adminSlice"

const ColorlibStepIconRoot = styled('div')<{
    ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#ccc',
    zIndex: 1,
    color: '#fff',
    width: 50,
    height: 50,
    display: 'flex',
    borderRadius: '50%',
    justifyContent: 'center',
    alignItems: 'center',
    ...(ownerState.active && {
        backgroundImage:
            'linear-gradient( 136deg, #363062 0%, #363062 50%, #363062 100%)',
        //boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
        boxShadow: '0 4px 10px 4px #363062',
    }),
    ...(ownerState.completed && {
        backgroundImage:
            'linear-gradient( 136deg,#363062 0%, #363062 50%, #363062 100%)',
    }),
}));
function ColorlibStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    const icons: { [index: string]: React.ReactElement } = {
        1: <ContentCopyRoundedIcon />,
        2: <EventNoteIcon />,
        3: <MoneyIcon />,
        4: <CorporateFareIcon />,
        5: <NextWeekOutlinedIcon />
    };

    return (
        <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
            {icons[String(props.icon)]}
        </ColorlibStepIconRoot>
    );
}
let steps = ['Preliminary Application', 'Detailed Application', 'Investment Theme of Fund', 'Detailed Engagement And Role of IM with Portfolio Companies', 'Illustration of carry distribution of the Fund'];





let liItems = ["SidbiReference", "detailed2A", "InvestmentThemeOfFund","EngagementAndRole", "carryDistribution"]
let navLiItems = ["detailed2A", "detailed2B", "detailed2C", "detailed2D","detailed2E", "detailed2F","detailed2G", "detailed2H", "detailed2I", "detailed2J", "detailed2K"]

interface DetailedApplicationComponentProps { }
const DetailedApplicationComponent: FC<DetailedApplicationComponentProps> = () => {
    
    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [value, setValue] = React.useState(0);
    const [activeStepper, setActiveStepper] = React.useState(0);
    const detailedApplicationState = useAppSelector(selectedDetailedApplications);
    const usersState = useAppSelector(selectUsers)
    const userRole = usersState.role;
    const appliationStatus = detailedApplicationState[0]?.data[parentId]?.status
    const activeStepperIndex = useAppSelector(state => state.sideNavBarStore.activeStepper)
    const dispatch = useAppDispatch();
    const handleChange = (event: React.SyntheticEvent, newValue: number) => {
        setValue(newValue);
    }
    const navigate = useNavigate()

    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const handleListItemClick = (index: number) => {
        setSelectedIndex(index);
        navigate(navLiItems[index]);
    };

    function handleClick(label:string) {
        let val = liItems[steps.indexOf(label)]
        setActiveStepper(steps.indexOf(label))
        navigate(`/Detailed/${id}/${val}`);
    }
    useEffect(() => {
        console.log("check id number",id)
        if (!id) {
            
           navigate(`/Detailed/NEW/SidbiReference`)
        }
    });

    useEffect(() => {
        if(userRole == 'ADMIN' && appliationStatus == 'SUBMITTED'){
            steps = ['Admin Approval']
            liItems = ["carryDistribution"]
            navigate(`/Detailed/${id}/carryDistribution`);
        }
    });
    return (
        <div className="homeComp">
            <NavigationBar></NavigationBar>
            <div >
                <Container maxWidth={false} sx={{ mt: '90px' }} >
                    <Card sx={{ display: 'flex' }}>
                        <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                            <Card sx={{ display: 'flex', background: '#f2f2f2' }}>
                                <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                    <Toolbar disableGutters sx={{ ml: -2, mr: -2, mt: -2, color: 'white', backgroundColor: '#363062', textAlign: "center", justifyContent: "space-around", borderTopRightRadius: '8px', borderTopLeftRadius: '8px' }}>
                                        <Grid container xs={12}>
                                            <Box display="flex"
                                                justifyContent="center"
                                                alignItems="center">
                                                <Typography sx={{ flex: 1, ml: '10px', textAlign: "center", fontWeight: 'bold' }}>Application</Typography>
                                            </Box>
                                        </Grid>
                                    </Toolbar>
                                    <Box sx={{ flexGrow: 1,cursor: 'pointer'}}>
                                        <Grid container spacing={2}>
                                            <Grid container xs={12}>
                                                <Stack sx={{ ml: '16px', width: '100%', background: "white" }} spacing={0.5}>
                                                    <Stepper alternativeLabel activeStep={activeStepperIndex} connector={null} sx={{ mt: '3%', mb: '3%' }}>
                                                        {steps.map((label) => (
                                                            <Step key={label}>
                                                                <StepLabel StepIconComponent={ColorlibStepIcon} onClick={() => handleClick(label)}><Typography variant='body2' sx={{ flex: 1, mt: 3, mb: 3, justifyContent: 'center',fontWeight:'bold' }}>{label}</Typography></StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>
                                                </Stack>

                                            </Grid>
                                            <Outlet />
                                        </Grid>
                                    </Box>
                                </CardContent>
                            </Card>
                        </CardContent>
                    </Card>
                </Container>
            </div>
        </div>

    );
}
export default DetailedApplicationComponent;