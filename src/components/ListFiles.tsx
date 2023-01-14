import React, { useEffect } from "react";
import FileUploadService from "./FileUploadService";
import { IFile } from "./IFile";
import CloseIcon from '@material-ui/icons/Close';

interface ListFilesProps {
  id: String,
  refreshId: String
}

export default function ListFiles(props: ListFilesProps) {
  const [files, setFiles] = React.useState<IFile[]>([]);
  const [error, setError] = React.useState("");

  const list = () => {
    FileUploadService.list(props.id).then((response) => {
        setFiles(response.data);
      }).catch((error) => {
        setError("Error uploading file.");
      });
  }

  useEffect(() => {
    list();
  }, [props.id, props.refreshId])

  const deleteFile = (file: IFile) => {
    FileUploadService
      .delete(file)
      .then(() => {
        list();
      });
  }
  
  return <div style={{margin: "10px"}}>
    {
      files.map((file) => {
        return <div>
            <a href={`${file.url}?access_token=${localStorage.getItem('token')}`} onClick={(event) => {event.stopPropagation()}}>{file.name}</a>
            <div onClick={(event) => {event.stopPropagation(); deleteFile(file)}} 
              style={{display: "inline"}}>
                <CloseIcon style={{fontSize: "20px", color: "red", fontWeight: "bold", verticalAlign: "bottom", marginLeft: "7px"}}/></div>
          </div>
      })
    }
    
  </div>
}