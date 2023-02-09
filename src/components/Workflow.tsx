import { Container, CardActionArea, Card, CardMedia } from "@mui/material";
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
            <Container maxWidth={false} sx={{ mt: '90px' }}>
                    <CardActionArea component="a" href="#" disableRipple>
                        <Card sx={{ display: 'flex', justifyContent: "center" }}>
                        <CardMedia
                                    component="img"
                                    //height="194"
                                    image={workflowImg}
                                    alt="card-bg">
                                        </CardMedia>
                        </Card>
                    </CardActionArea>
               
            </Container>
        </div>


    )

}

export default Workflow;