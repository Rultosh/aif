import { Chip } from "@mui/material";
import React, { useState, useCallback } from "react";
import { Upload } from "@mui/icons-material";
import DocumentUpload from "./DocumentUpload";
import ListFiles from "./ListFiles";
import { IFile } from "./IFile"
import FileUploadService from "./FileUploadService";
import uuid from "react-uuid";
import { useDropzone } from 'react-dropzone'

interface DocumentChipProps {
  id: String
  label: String
  signed?: boolean | undefined
}

interface IFileUploadInfo {
  file: File | null
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = useState(false);
  const [refreshId, setRefreshId] = useState<String>("")
  const [fileInfo, setFileInfo] = useState({ file: null } as IFileUploadInfo);
  const [progress, setProgress] = useState(0.0);
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File) => {
      console.log(file);
      setFileInfo({ "file": file });

      console.log('uploading...', file);
    FileUploadService.upload(
      props.id,
      file,
      props.signed,
      (event: any) => {
        let uploadProgress = Math.round((100 * event.loaded) / event.total);
        setProgress(progress)
      }).then((response) => {
        console.log(response);
        setOpen(false);
        setFileInfo({ file: null });
        setError('');
        onUploadSuccess()
      }).catch((error) => {
        setError("Error uploading file.");
      });
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const onUploadSuccess = () => {
    setRefreshId(uuid())
  }

  return (
  // <DocumentUpload id={props.id} onSuccess={onUploadSuccess} signed={props.signed}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <Chip
          icon={<Upload />}
          label={props.label}
          size="medium"
          onClick={() => setOpen(!open)}
          sx={{ backgroundColor: '#D586F7', width: 'fit-content' }} />
        <ListFiles id={props.id} refreshId={refreshId}/>
      </div>
    // </DocumentUpload>
  )
}
