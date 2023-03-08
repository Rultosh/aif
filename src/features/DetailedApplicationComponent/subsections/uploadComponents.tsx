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
                icon={<FileUploadIcon sx={{ color: '#ffffff !important' }} />}
                label="Upload File"
                size="medium"
                sx={{ backgroundColor: '#D586F7', width: 'fit-content', color: '#ffffff' }} />
                {/* <FileUploadIcon>
                </FileUploadIcon> */}
            </DocumentUpload>
        </Box>
            <ListFiles id={props.id} refreshId={refreshId}/>
    </>
    );
}

export default UploadComponents;