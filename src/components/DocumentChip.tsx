import { Box, Chip } from "@mui/material";
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
  /** When true, shows a required indicator — upload is mandatory before you can proceed (where enforced). */
  required?: boolean
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);
  const [refreshId, setRefreshId] = React.useState<String>("")
  const required = props.required === true;

  const onUploadSuccess = () => {
    setRefreshId(uuid())
  }

  const chipLabel = (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.25 }}>
      <span>{props.label}</span>
      {required && (
        <Box component="span" sx={{ color: '#ffcdd2', fontWeight: 800, fontSize: '1.1em', lineHeight: 1 }} aria-hidden>
          *
        </Box>
      )}
    </Box>
  );

  return (<DocumentUpload id={props.id} onSuccess={onUploadSuccess} signed={props.signed} validationTitle={props.validationTitle}>
    <div>
      <Chip
        icon={<Upload sx={{ color: '#ffffff !important' }} />}
        label={chipLabel}
        title={required ? `${String(props.label)} (mandatory upload)` : String(props.label)}
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
