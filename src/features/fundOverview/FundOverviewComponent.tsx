import { Box, Button, Card, CardContent, CardMedia, Container, Divider, Grid, Typography } from '@mui/material';
import { Link, useNavigate, Outlet, useParams } from 'react-router-dom';
import NavigationBar from '../../components/NavigationBar'
import React, * as Rect from 'react'
import { useState, useEffect } from "react"
import fundImg from '../../images/fund.png'
import decImg from '../../images/declaration.png'
import selfRatingImg from '../../images/rating.png'
import profileImg from '../../images/profile.png'
import IconButton from '@mui/material/IconButton';
import { selectUsers } from '../admin/adminSlice'
import { useAppSelector, useAppDispatch } from '../../app/hooks'
import { selectPrelimApplication } from "../fundOverview/subsections/fundOverviewData/prelimApplicationDataSlice"


export const FundOverview = (props:any) => {

    const { id } = useParams();
    const usersState = useAppSelector(selectUsers)
    const prelimApplicationState = useAppSelector(selectPrelimApplication);
    const statusPrelims = prelimApplicationState.prelimApplication.status || '';
    const navigate = useNavigate();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
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
                <Container maxWidth={false} sx={{ mt: '40px' }} >
                    <div>
                        <h2 style={{ color: "gray" }}>Preliminary Application Process</h2>
                        <span>
                            Note: <a target="_blank" rel="noopener" href='/templates/SIDBI ASF-Preliminary Application.pdf'>Click</a> here, to view the Preliminary Application format to assess the data required for submission
                        </span>
                        <hr></hr>
                    </div>
                    <Box sx={{ flexGrow: 1 }}>
                        <Grid container spacing={2}>
                            {isUserPermittedToView() ?
                                <Grid item xs={2}>
                                    <Card sx={{ display: 'flex' }}>
                                        <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                            <IconButton onClick={() => navigate("fund")}>
                                                <CardMedia
                                                    component="img"
                                                    width="20"
                                                    //height="80"
                                                    image={fundImg}
                                                    alt="test-img"
                                                />

                                            </IconButton>

                                            <Typography textAlign="center" sx={{ color: 'red', fontWeight: 700 }}>
                                                <Link to="fund" style={{ textDecoration: 'none', color: '#363062' }}>
                                                    Fund Overview
                                                </Link>
                                            </Typography>
                                        </CardContent>
                                    </Card>
                                    <Divider />
                                    {id?.toString() != 'NEW' ? <>
                                        <Card sx={{ display: 'flex' }}>
                                            <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                                <IconButton onClick={() => navigate("Profile")}>
                                                    <CardMedia
                                                        component="img"
                                                        width="20"
                                                        //height="80"
                                                        image={profileImg}
                                                        alt="test-img"
                                                    />

                                                </IconButton>

                                                <Typography textAlign="center" sx={{ fontWeight: 700 }}>
                                                    <Link to="Profile" style={{ textDecoration: 'none', color: '#363062' }}>
                                                        Profile
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Divider />
                                        <Card sx={{ display: 'flex' }}>
                                            <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                                <IconButton onClick={() => navigate("selfRating")}>
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
                                                        Self Rating
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Divider />
                                        <Card sx={{ display: 'flex' }}>
                                            <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                                <IconButton onClick={() => navigate("Declaration")}>
                                                    <CardMedia
                                                        component="img"
                                                        width="20"
                                                        //height="80"
                                                        image={decImg}
                                                        alt="test-img"
                                                    />

                                                </IconButton>

                                                <Typography textAlign="center" sx={{ color: '#363062', fontWeight: 700 }}>
                                                    <Link to="declaration" style={{ textDecoration: 'none', color: '#363062' }}>
                                                        Declaration
                                                    </Link>
                                                </Typography>
                                            </CardContent>
                                        </Card>
                                        <Divider />
                                        <Card sx={{ display: 'flex', mb: 2 }}>
                                            <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                                <IconButton onClick={() => navigate("preview")}>
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
                                        <Divider />
                                    </>
                                        : null}
                                </Grid>
                                :
                                <Grid item xs={2}>
                                    <Card sx={{ display: 'flex', mb: 2 }}>
                                        <CardContent sx={{ flex: 1, alignContent: 'center' }} >
                                            <IconButton onClick={() => navigate("preview")}>
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