import { Button, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material";
import { Component, useCallback, useState } from "react";
import { useDropzone } from 'react-dropzone'
import CloseIcon from '@material-ui/icons/Close';
import { wrapArgument } from "../lib/api-status/actionWrapper";
import FileUploadService from "./FileUploadService";
import { StringLiteral } from "typescript";

export interface FileUploadProps {
  id: String;
  open: boolean;
  setOpen: any;
  onSuccess: (id: String, url: String) => void;
}

interface IFileUploadInfo {
  file: File | null
}

export default function FileUpload(props: FileUploadProps) {

  const {open, setOpen} = props;
  const [fileInfo, setFileInfo] = useState({ file: null } as IFileUploadInfo);
  const [progress, setProgress] = useState(0.0);
  const [error, setError] = useState('');

  const handleClose = () => {
    setOpen(!open);
    setFileInfo({"file": null});
    setError('');
  };

  const onDrop = useCallback((acceptedFiles: any) => {
    acceptedFiles.forEach((file: File) => {
      console.log(file);
      setFileInfo({ "file": file });
    })
  }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  const uploadFiles = () => {
    console.log('uploading...', fileInfo);
    FileUploadService.upload(
      fileInfo.file,
      (event: any) => {
        let uploadProgress = Math.round((100 * event.loaded) / event.total);
        setProgress(progress)
      }).then((response) => {
        console.log(response);
        setOpen(false);
        setFileInfo({ file: null });
        setError('');
        props.onSuccess(
          props.id,
          response.data['message']
        )
      }).catch((error) => {
        setError("Error uploading file.");
      });
  }

  return (
    <div>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex' }}>Upload a file...</div>
          <IconButton onClick={handleClose} style={{ float: 'right' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          {fileInfo.file ?
            <div style={{ textAlign: 'center' }}>
              <div>{fileInfo.file.name}</div>
              <div style={{color: 'red'}}>{error}</div>
              {progress ?
                <div>
                    {progress}%
                </div> :
                <Button onClick={uploadFiles}>
                  Upload
                </Button>}
            </div> :
            <div>
              <div {...getRootProps()}>
                <input {...getInputProps()} />
                {
                  isDragActive ?
                    <div style={{ border: 'solid 1px black', margin: '10px', color: 'darkgray' }}><p>Drag 'n' drop some files here, or click to select files</p></div> :
                    <div style={{ margin: '10px' }}><p>Drag 'n' drop some files here, or click to select files</p></div>
                }
              </div>
            </div>}
        </DialogContent>
      </Dialog>
    </div>
  )
}