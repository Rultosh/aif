import React, { ReactElement, useEffect } from "react";
import FileUpload from "./FileUpload";

interface DocumentChipProps {
  id: String,
  onSuccess: (id: String, url: String) => void | undefined,
  children: ReactElement | undefined
  signed?: boolean | undefined
}

export default function DocumentChip(props: DocumentChipProps) {

  const [open, setOpen] = React.useState(false);
  return (<>
    <div onClick={() => setOpen(!open)} style={{display: "inline"}}>
      {props.children}
    </div>
    <FileUpload
      id={props.id}
      onSuccess={(id: String, url: String) => {
        props.onSuccess(props.id, url);
      }}
      signed={props.signed}
      open={open} setOpen={setOpen}></FileUpload>
  </>
  )
}
