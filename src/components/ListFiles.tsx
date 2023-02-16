import React, { useEffect } from "react";
import FileUploadService from "./FileUploadService";
import { IFile } from "./IFile";
import CloseIcon from '@material-ui/icons/Close';
import DownloadIcon from '@mui/icons-material/Download';
import DeleteIcon from '@mui/icons-material/Delete';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';


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

  const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      fontSize: 13,
      backgroundColor: '#363062',
      color: theme.palette.common.white,
      padding: '10px'
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 12,
      lineBreak: 'anywhere',
      textAlign: 'left',
      padding: '10px'
    },
  }));
  
  const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
  }));
console.log(files);
  return <div style={{margin: "10px 0px"}}>
    {files.length > 0? 
    <TableContainer component={Paper}>
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell align="center">File Name</StyledTableCell>
            <StyledTableCell align="center">Actions</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {
            files.map((file) => {
              return <StyledTableRow>
                <StyledTableCell align="right">{file.name}</StyledTableCell>
                <StyledTableCell align="right">
                  <div onClick={(event) => {event.stopPropagation(); deleteFile(file)}} style={{display: "flex"}}>
                    <Tooltip title="Download">
                      <IconButton href={`${file.url}?access_token=${localStorage.getItem('token')}`} onClick={(event) => {event.stopPropagation()}}>
                        <DownloadIcon style={{fontSize: "20px", color: "green", fontWeight: "bold", verticalAlign: "bottom"}} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton>
                        <DeleteIcon style={{fontSize: "19px", color: "red", fontWeight: "bold", verticalAlign: "bottom"}}/>
                      </IconButton>
                    </Tooltip>
                  </div>
                </StyledTableCell>
              </StyledTableRow>
            })
          }
          
    </TableBody>
      </Table>
    </TableContainer> : ''}
  </div>
}
