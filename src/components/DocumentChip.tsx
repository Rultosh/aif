import { Chip } from "@mui/material";
import React from "react";
import FileUpload from "./FileUpload";
import CloseIcon from '@material-ui/icons/Close';
import FaceIcon from '@material-ui/icons/Face';
import CloudDownload from '@material-ui/icons/CloudDownload';
import CloudUpload from '@material-ui/icons/CloudUpload';

interface DocumentChipProps {
  id: String,
  label: String,
  url: String | undefined,
  onSuccess: (id: String, url: String) => void,
  onDelete: (id: String) => void
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);

  if (props.url)
    return (<>
      <Chip
        icon={<CloudDownload />}
        label={props.label}
        size="medium"
        deleteIcon={<CloseIcon />}
        onDelete={() => {props.onDelete(props.id)}}
        onClick={() => props.url ? window.open(props.url as string, "_blank") : setOpen(!open)}
        sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
    </>
    )
  else
    return (<>
      <Chip
        icon={<CloudUpload />}
        label={props.label}
        size="medium"
        onClick={() => props.url ? window.open(props.url as string, "_blank") : setOpen(!open)}
        sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
      <FileUpload
        id={props.id}
        onSuccess={(id: String, url: String) => {
          props.onSuccess(props.id, url);
        }}
        open={open} setOpen={setOpen}></FileUpload>
    </>
    )
}
