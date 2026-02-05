import { Container, Paper, Grid, Typography } from "@mui/material";
import workflowImg from '../images/workflow.png'
import NavigationBar from './NavigationBar'
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react"


const Workflow = (props:any) => {

    const navigate = useNavigate();

    useEffect(() => {
        if(props.checkUnAuth){
            navigate('/login')
        }
    })
    
    return (
        <div>
            <NavigationBar></NavigationBar>
            <Container  maxWidth="xl" sx={{ py: '80px' }}>
                <Paper elevation={0} sx={{ backgroundColor: '#ffffff', borderRadius: '10px', p: '40px' }}>
                    <Paper elevation={0} sx={{ backgroundImage: 'linear-gradient(#2f44cf, #0a20b6, #0a22bf, #2d3883)', height: '16px', borderRadius: '10px', mt:'20px', px: '20px', position: 'relative', top: '83px' }}>
                    </Paper>
                    <Grid container direction="row" justifyContent="center" alignItems="center" spacing={3} sx={{ pl: '40px', pr: '20px', zIndex: '999999', position: 'relative' }}>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>Eligibility Screener & Registration</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>Preliminary Application</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>Detailed Application</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>VC Investment committee</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>SIDBI Executive committee</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="workflowCircle">
                                <Typography variant="subtitle2" gutterBottom sx={{ p: '10px', m: 'auto', textAlign: 'center', fontWeight: '500' }}>Onboarded for fund cycle</Typography>
                            </div>
                        </Grid>
                    </Grid>
                    
                    <Grid container spacing={3} sx={{ px: '20px' }}>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>
                                    Eligibility Screener 
                                    Registration
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>
                                    Preliminary Application
                                    Feedback
                                    Go/ No-go 
                                    First Meeting</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>
                                    Due deiligence
                                    Second Meeting
                                    Terms Discussion
                                    Appraisal memo submission
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>Present to VC Investment committee</Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>
                                    Final Feedback - Post IC & EC
                                    Issue of LOI
                                    Agreement finalization
                                </Typography>
                            </div>
                        </Grid>
                        <Grid item xs={2}>
                            <div className="">
                                <Typography variant="subtitle2" gutterBottom sx={{ mt:'20px', px: '20px', textAlign: 'left'}}>Onboarding for Fund cycle</Typography>
                            </div>
                        </Grid>
                    </Grid>
                </Paper>
            </Container>
        </div>


    )

}

export default Workflow;