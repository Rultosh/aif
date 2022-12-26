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
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);
  const [refreshId, setRefreshId] = React.useState<String>("")

  const onUploadSuccess = () => {
    setRefreshId(uuid())
  }

  return (<DocumentUpload id={props.id} onSuccess={onUploadSuccess}>
      <div>
        <Chip
          icon={<Upload />}
          label={props.label}
          size="medium"
          onClick={() => setOpen(!open)}
          sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
        <ListFiles id={props.id} refreshId={refreshId}/>
      </div>
    </DocumentUpload>
  )
}
