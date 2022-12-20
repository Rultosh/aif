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

const QontoConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: 'calc(-50% + 16px)',
        right: 'calc(50% + 16px)',
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            borderColor: '#784af4',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        borderColor: theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderTopWidth: 3,
        borderRadius: 1,
    },
}));
const QontoStepIconRoot = styled('div')<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
        color: theme.palette.mode === 'dark' ? theme.palette.grey[700] : '#eaeaf0',
        display: 'flex',
        height: 22,
        alignItems: 'center',
        ...(ownerState.active && {
            color: '#784af4',
        }),
        '& .QontoStepIcon-completedIcon': {
            color: '#784af4',
            zIndex: 1,
            fontSize: 18,
        },
        '& .QontoStepIcon-circle': {
            width: 8,
            height: 8,
            borderRadius: '50%',
            backgroundColor: 'currentColor',
        },
    }),
);

function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
        <QontoStepIconRoot ownerState={{ active }} className={className}>
            {completed ? (
                <Check className="QontoStepIcon-completedIcon" />
            ) : (
                <div className="QontoStepIcon-circle" />
            )}
        </QontoStepIconRoot>
    );
}

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
    [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 22,
    },
    [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,#2d0c3b 0%,#2d0c3b 50%,#2d0c3b 100%)',
        },
    },
    [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
            backgroundImage:
                'linear-gradient( 95deg,#2d0c3b 0%,#2d0c3b 50%,#2d0c3b 100%)',
        },
    },
    [`& .${stepConnectorClasses.line}`]: {
        height: 3,
        border: 0,
        backgroundColor:
            theme.palette.mode === 'dark' ? theme.palette.grey[800] : '#eaeaf0',
        borderRadius: 1,
    },
}));

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
        boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
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
const steps = ['Preliminary Application', 'Detailed Application', 'Investment Theme of Fund', 'Detailed Engagement And Role of IM with Portfolio Companies', 'Illustration of carry distribution of Fund'];


interface TabPanelProps { 
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}

function a11yProps(index: number) {
    return {
        id: `vertical-tab-${index}`,
        'aria-controls': `vertical-tabpanel-${index}`,
    };
}

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



let liItems = ["prelimApp", "detailed2A", "InvestmentThemeOfFund","EngagementAndRole", "carryDistribution"]
let navLiItems = ["detailed2A", "detailed2B", "detailed2C", "detailed2D","detailed2E", "detailed2F","detailed2G", "detailed2H", "detailed2I", "detailed2J", "detailed2K"]

interface DetailedApplicationComponentProps { }
const DetailedApplicationComponent: FC<DetailedApplicationComponentProps> = () => {
    
    const { id } = useParams()
    const [parentId] = useState(Number(id))
    const [value, setValue] = React.useState(0);
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
        navigate(`/Detailed/${id}/${val}`);
    }
    useEffect(() => {
        console.log("check id number",id)
        if (!id) {
            
           //ss navigate(`/Detailed/${id}/2A`)
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
                                                    <Stepper alternativeLabel activeStep={4} connector={null} sx={{ mt: '3%', mb: '3%' }}>
                                                        {steps.map((label) => (
                                                            <Step key={label}>
                                                                <StepLabel StepIconComponent={ColorlibStepIcon} onClick={() => handleClick(label)}>{label}</StepLabel>
                                                            </Step>
                                                        ))}
                                                    </Stepper>
                                                </Stack>

                                            </Grid>
                                            <Outlet />
                                            {/*}
                                            <Grid item xs={3}>
                                                <Card sx={{ display: 'flex', color: '#363062' }}>
                                                    <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                                        <StyledList>
                                                            <List>
                                                                {liItems.map((item) => (
                                                                    <Box >
                                                                        <ListItem disablePadding>
                                                                            <ListItemButton selected={selectedIndex === liItems.indexOf(item)}
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
                                            
                                            <Grid item xs={9}>
                                                <Outlet />
                                            </Grid>
                                            */}
                                            
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