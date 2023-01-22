import { TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { Controller } from "../../../lib/api-wrappers/Controller";
import { detailedApplicationThunk, selectedDetailedApplications } from "./detailedApplicationSlice";
import { defaultIDetailedApplication } from "./IDetailedApplication";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";

export const SidbiReference = () => {
  const { id } = useParams()
  const [formData, setFormData] = useState(defaultIDetailedApplication);
  const [actionId] = useState(uuid())
  const controller = new Controller(actionId, detailedApplicationThunk);
  const state = useAppSelector(selectedDetailedApplications);
  const navigate = useNavigate();

  useEffect(() => {
    if (id && Number(id)) {
      if (!state[0]?.data[id]) {
        controller.fetch({ ...formData, id: Number(id) });
      }
    }
  }, [])

  useEffect(() => {
    let newData = state[0]?.data[Number(id)];
    if (newData) setFormData(newData)
  }, [state[0]?.data])

  const handleChange = (ev: any) => {
    ev.preventDefault();
    let copiedValue = { ...formData }
    let key = ev.target.id ? ev.target.id : ev.target.name;
    copiedValue[key as keyof typeof formData] = ev.target.value;
    setFormData(copiedValue);
  };

  const handleSave = () => {
    controller.save(formData);
  }

  const handleNext = () => {
    if (!Number(id)) navigate(`/detailed/featureOfFunds/${state[0].createdId}`)
    else navigate(`/detailed/featureOfFunds/${id}`)
  }

  return <>
    {controller.isActionError(0, state) ?
      <div style={{ margin: "10px", color: "red" }}>{controller.error(0, state)}</div> : <></>}
    <><TextField
      required
      id="sidbiReferenceNumber"
      label="Reference No."
      value={formData["sidbiReferenceNumber"]}
      variant="standard"
      onChange={handleChange}
      sx={{ display: 'flex', ml: 2 }} />
      <button onClick={handleSave}>Save</button>
      <button onClick={handleNext}>Next</button></>
  </>
}


