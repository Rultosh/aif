import { Delete } from "@mui/icons-material";
import { Box, TableContainer, Paper, Table, TableHead, TableRow, TableBody, TableCell, Chip } from "@mui/material";
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import React, * as Rect from 'react'
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DocumentUpload from "../../../components/DocumentUpload";
import uuid from "react-uuid";
import ListFiles from "../../../components/ListFiles";

interface UploadComponentProps {
    id: String
    signed?: boolean
}

export const UploadComponents = (props: UploadComponentProps) => {

    const [refreshId, setRefreshId] = Rect.useState(uuid());
    const handleSuccess = () => {
        setRefreshId(uuid());
    }

    return (<>
        <Box>
            <DocumentUpload id={props.id} signed={props.signed}
                onSuccess={handleSuccess}>

                <Chip
                    icon={<FileUploadIcon sx={{ color: 'inherit !important' }} />}
                    label="Upload File"
                    size="medium"
                    sx={{
                        backgroundColor: '#000080',
                        width: 'fit-content',
                        color: '#ffffff',
                        '&:hover': {
                            border: '1px solid #000080',
                            color: '#000080',
                            backgroundColor: 'rgb(208 208 237)',
                            '& .MuiChip-icon': {
                                color: '#000080 !important',
                            }
                        }
                    }} />
                {/* <FileUploadIcon>
                </FileUploadIcon> */}
            </DocumentUpload>
        </Box>
        <ListFiles id={props.id} refreshId={refreshId} />
    </>
    );
}

export default UploadComponents;