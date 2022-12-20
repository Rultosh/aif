import { Container, CardActionArea, Card, CardMedia } from "@mui/material";
import workflowImg from '../images/workflow.png'
import NavigationBar from './NavigationBar'



const Workflow = () => {

    
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