import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, Typography } from '@mui/material';
import { Link, useNavigate, Outlet, useParams } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect, useContext } from "react"
import fundImg from '../../images/fund.png'
import decImg from '../../images/declaration.png'
import selfRatingImg from '../../images/rating.png'
import profileImg from '../../images/profile.png'
import IconButton from '@mui/material/IconButton';
import { selectUsers } from '../admin/adminSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectPrelimApplication } from "../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice"
// import { UserContext } from '../../App';
// import useCookie, { getCookie } from 'react-use-cookie';
// import WarningIcon from '@mui/icons-material/Warning';

export const FundOverview = (props:any) => {
    // let { shoppingList } = useContext(UserContext);
    // const [user, setUser] = useState(shoppingList);

    const { id } = useParams();
    const [localId, setLocalId] = useState<string>();
    const usersState = useAppSelector(selectUsers)
    const prelimApplicationState = useAppSelector(selectPrelimApplication);
    const statusPrelims = prelimApplicationState.prelimApplication.status || '';
    const navigate = useNavigate();
  
    const pathname = (window.location.pathname).toLowerCase();  
    // const selfRatingCookie = getCookie('selfRating') || '0';
    // const [selfRating, setSelfRating] = useCookie('selfRating', selfRatingCookie);
    // const [selfRatingLink, setSelfRatingLink] = useCookie('selfRatingLink', '0');

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
        // if(selfRatingLink == '0'){
        // setSelfRating('0');
        // }
    })

    useEffect(() => {
        if (!id) {
            navigate("/preliminary/NEW/fund")
        }
    });

    type dropDownValues = {
        data: any,
        arrowUp: boolean,

    }

    type InitialState = {
        id: string,
        value: any
    }


    const initialState: InitialState = {
        id: "1",
        value: { data: [], arrowUp: true } as dropDownValues
    };
    const [expanded, setExpanded] = React.useState<string | false>(false);

    const handleChange =
        (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
            setExpanded(isExpanded ? panel : false);
        };

    const isUserPermittedToView = () => {
        if (usersState.role == 'USER' && !(['SUBMITTED' ,'APPROVED'].includes(statusPrelims.toString()))){
            return true;
        }
        return false
    };


    return (
        <div className="homeComp">

            <NavigationBar></NavigationBar>
            <div >
                <Container maxWidth={false} sx={{ mt: '140px', color: "white" }} >
                    {/* <div>
                        <h2 style={{ color: "white" }}>Preliminary Application Process</h2>
                        <span>
                            Note: <a target="_blank" rel="noopener" href='/templates/SIDBI ASF-Preliminary Application.pdf'>Click</a> here, to view the Preliminary Application format to assess the data required for submission
                        </span>
                        <hr></hr>
                    </div> */}
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {isUserPermittedToView() ?
                                <Grid item xs={2}>
                                    <Card sx={{ display: 'flex', borderRadius: '10px' }}>
                                        <CardContent sx={{ flex: 1, alignContent: 'center', pb: '0 !important', p: 0, position: 'relative' }} >
                                            <Box className={"prelimsNavTab " + (pathname.includes("fund")? "activeTab" : "")}>
                                                <Link to="fund" style={{ textDecoration: 'none', color: '#363062' }}>
                                                    <IconButton onClick={() => navigate("fund")} className="prelimsNavTabIcon">
                                                        <CardMedia
                                                            component="img"
                                                            width="20"
                                                            //height="80"
                                                            image={fundImg}
                                                            alt="test-img"
                                                        />

                                                    </IconButton>

                                                    <Typography textAlign="center" sx={{ fontWeight: 700, pb: 3 }}>
                                                        Fund Overview
                                                    </Typography>
                                                </Link>
                                            </Box>
                                        {/* </CardContent> */}
                                    {/* </Card> */}
                                    {id?.toString() != 'NEW' ? <>
                                    <Divider sx={{ border: '1.5px solid #556ab1' }} />
                                        <Box className={"prelimsNavTab " + (pathname.includes("profile")? "activeTab" : "")}>
                                            <Link to="Profile" style={{ textDecoration: 'none', color: '#363062' }}>
                                                <IconButton onClick={() => navigate("Profile")} className="prelimsNavTabIcon">
                                                    <CardMedia
                                                        component="img"
                                                        width="20"
                                                        //height="80"
                                                        image={profileImg}
                                                        alt="test-img"
                                                    />

                                                </IconButton>

                                                <Typography textAlign="center" sx={{ fontWeight: 700, pb: 3 }}>
                                                        Profile
                                                </Typography>
                                            </Link>
                                        </Box>
                                        <Divider sx={{ border: '1.5px solid #556ab1' }} />
                                        <Box className={"prelimsNavTab " + (pathname.includes("selfrating")? "activeTab" : "")}>
                                            <Link to="selfRating" style={{ textDecoration: 'none', color: '#363062' }}>
                                                {/* {selfRating == '1'? 
                                                    <>
                                                    <WarningIcon style={{ width: '-webkit-fill-available', height: '40px', marginTop: '28px', marginBottom: '24px', color: 'red' }} />
                                                    <Typography textAlign="center" sx={{ color: 'red', fontWeight: 700, pb: 3 }}>
                                                    Self Rating
                                                    </Typography>
                                                    </>
                                                    :
                                                    <> */}
                                                    <IconButton onClick={() => navigate("selfRating")} className="prelimsNavTabIcon"> 
                                                        <CardMedia
                                                            component="img"
                                                            width="20"
                                                            //height="80"
                                                            image={selfRatingImg}
                                                            alt="test-img"
                                                        />
                                                    </IconButton>
                                                    <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700, pb: 3 }}>
                                                    Self Rating
                                                    </Typography>
                                                    {/* </>
                                                } */}
                                            </Link>
                                        </Box>
                                        <Divider sx={{ border: '1.5px solid #556ab1' }} />
                                        <Box className={"prelimsNavTab " + (pathname.includes("declaration")? "activeTab" : "")}>
                                            <Link to="declaration" style={{ textDecoration: 'none', color: '#363062' }} 
                                            // onClick={() => {setSelfRating('1'); setSelfRatingLink('1');}}
                                            >
                                                <IconButton onClick={() => {navigate("Declaration"); 
                                                // setSelfRating('1'); setSelfRatingLink('1');
                                                }} className="prelimsNavTabIcon">
                                                    <CardMedia
                                                        component="img"
                                                        width="20"
                                                        //height="80"
                                                        image={decImg}
                                                        alt="test-img"
                                                    />

                                                </IconButton>

                                                <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700, pb: 3 }}>
                                                    Declaration
                                                </Typography>
                                            </Link>
                                        </Box>
                                        <Divider sx={{ border: '1.5px solid #556ab1' }} />
                                        <Box className={"prelimsNavTab " + (pathname.includes("preview")? "activeTab" : "")}>
                                            <Link to="preview" style={{ textDecoration: 'none', color: '#363062'}}>
                                                <IconButton onClick={() => navigate("preview")} className="prelimsNavTabIcon">
                                                    <CardMedia
                                                        component="img"
                                                        width="20"
                                                        //height="80"
                                                        image={selfRatingImg}
                                                        alt="test-img"
                                                    />

                                                </IconButton>

                                                <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700, pb: 3 }}>
                                                    Preview
                                                </Typography>
                                            </Link>
                                        </Box>
                                    </>
                                        : null}
                                        </CardContent>
                                    </Card>
                                </Grid>
                                :
                                <Grid item xs={2}>
                                    <Card sx={{ display: 'flex', mb: 2 }}>
                                        <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                            <IconButton onClick={() => navigate("preview")} className="prelimsNavTabIcon">
                                                <CardMedia
                                                    component="img"
                                                    width="20"
                                                    //height="80"
                                                    image={selfRatingImg}
                                                    alt="test-img"
                                                />

                                            </IconButton>

                                            <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700 }}>
                                                <Link to="selfRating" style={{ textDecoration: 'none', color: '#363062' }}>
                                                    Preview
                                                </Link>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            }
                            <Grid item xs={10}>
                                <Outlet />


                            </Grid>
                        </Grid>

                    </Box>
                </Container>
            </div>

        </div>
    )
}


export default FundOverview;