import { Modal, Box, Typography, Button } from "@mui/material";

export const ModalComponent = (props: any) => {

    const { msg, status, btnText, onBtnClick, title } = props;

    // Default titles based on status if not provided
    const defaultTitle = status === 'idle' ? 'Success' : status === 'failed' ? 'Error' : 'Notification';
    const displayTitle = title || defaultTitle;

    const style = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: { xs: '90%', sm: '600px' },
        bgcolor: '#ffffff',
        borderRadius: '16px',
        boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.15)',
        p: { xs: 3, sm: 4 },
        outline: 'none',
    };

    return (
        <Modal
            open={props.open}
            onClose={props.close}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
            className="special_modal"
        >
            <Box sx={style}>
                <Typography id="modal-modal-title" variant="h5" component="h2" sx={{ fontWeight: 800, mb: 2, color: '#000000' }}>
                     {displayTitle}
                </Typography>
                <Typography id="modal-modal-description" sx={{ mb: 4, color: '#4a4a4a', fontSize: '1.05rem', lineHeight: 1.6 }}>
                    {msg || (status === 'idle' ? 'Your action was successful.' : status === 'failed' ? 'An error occurred. Please try again.' : 'Here is some information regarding your action.')}
                </Typography>
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                    {btnText && onBtnClick && (
                        <Button 
                            variant="contained" 
                            onClick={onBtnClick}
                            disableElevation
                            sx={{ 
                                backgroundColor: '#f97316', 
                                color: '#ffffff',
                                textTransform: 'none',
                                fontWeight: 700,
                                fontSize: '1rem',
                                px: 3,
                                py: 1.2,
                                borderRadius: '8px',
                                '&:hover': { 
                                    backgroundColor: '#ea580c',
                                 }
                            }}
                        >
                            {btnText}
                        </Button>
                    )}
                </Box>
            </Box>
        </Modal>
    );
}

export default ModalComponent;