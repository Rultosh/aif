import { Chip } from "@mui/material";
import React from "react";
import { Upload } from "@mui/icons-material";
import DocumentUpload from "./DocumentUpload";
import ListFiles from "./ListFiles";
import { IFile } from "./IFile"
import FileUploadService from "./FileUploadService";
import uuid from "react-uuid";

interface DocumentChipProps {
  id: String
  label: String
  signed?: boolean | undefined
  validationTitle?: string
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);
  const [refreshId, setRefreshId] = React.useState<String>("")

  const onUploadSuccess = () => {
    setRefreshId(uuid())
  }

  return (<DocumentUpload id={props.id} onSuccess={onUploadSuccess} signed={props.signed} validationTitle={props.validationTitle}>
    <div>
      <Chip
        icon={<Upload sx={{ color: '#ffffff !important' }} />}
        label={props.label}
        size="medium"
        onClick={() => setOpen(!open)}
        sx={{
          backgroundColor: '#000080',
          color: '#ffffff',
          width: 'fit-content',
          '&:hover': {
            border: '1px solid #000080',
            color: '#000080',
            backgroundColor: 'rgb(208 208 237)',
            '& .MuiChip-icon': {
              color: '#000080 !important',
            }
          }
        }} />
      <ListFiles id={props.id} refreshId={refreshId} />
    </div>
  </DocumentUpload>
  )
}
