import { Modal, Box, Card, CardContent, Typography, Divider, TextField, Button, Grid } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';

export const ModalComponent = (props: any) => {

    const { msg, status } = props;
    let colorStatus = status == 'idle' ? 'green' : 'red'


    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '30%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      
    };

    return <Modal
        open={props.open}
        onClose={props.close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="special_modal"
    >

        <Box sx={style}>
            <Grid container >
                <Grid item xs={11} >
                    <Box sx={{ backgroundColor: 'white', borderRadius: 1 }}>
                        <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 'bolder', color: colorStatus, mt: 2 }}>{msg}</Typography>

                        {/*<Card sx={{ display: 'flex', background: '#f2f2f2' }}>
                    <CardContent sx={{ flex: 1 }}>
                                <Typography variant="subtitle1" sx={{ flex: 1, fontWeight: 'bolder', color: colorStatus, mt: 2 }}>{msg}</Typography>
                               <Divider sx={{ mb: 2 }} />
                    </CardContent>
                </Card>
*/}
                    </Box>
                </Grid>
               {/*} <Grid item xs={1} >
                    <CloseIcon onClick={props.close} sx={{cursor:'pointer'}}></CloseIcon>
</Grid>*/}
            </Grid>
        </Box>
    </Modal>
}

export default ModalComponent;