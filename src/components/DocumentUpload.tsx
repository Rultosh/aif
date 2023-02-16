import React, { ReactElement, useEffect, useState, useCallback } from "react";
import FileUpload from "./FileUpload";
import FileUploadService from "./FileUploadService";
import { useDropzone } from 'react-dropzone'

interface DocumentChipProps {
  id: String,
  onSuccess: (id: String, url: String) => void | undefined,
  children: ReactElement | undefined
  signed?: boolean | undefined
}

interface IFileUploadInfo {
  file: File | null
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);
  
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
        props.onSuccess(
          props.id,
          response.data['message']
        )
      }).catch((error) => {
        setError("Error uploading file.");
      });
    })
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

  return (<>
  
    <div {...getRootProps()}>
      <input {...getInputProps()} />
        <div style={{display: "inline"}}>
          {props.children}
          <div style={{ color: "red", display: "inline-block", marginLeft: '10px' }}>{error}</div>
        </div>
    </div>
  </>
  )
}
