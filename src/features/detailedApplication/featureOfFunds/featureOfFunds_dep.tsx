import { TextField } from "@mui/material"
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAppSelector } from "../../../app/hooks";
import { Controller } from "../../../lib/api-wrappers/Controller";
import uuid from "react-uuid";
import { useNavigate } from "react-router-dom";
import { defaultIFeaturesOfFunds, IFeaturesOfFunds } from "./IFeaturesOfFund_dep";
import { featureOfFundsThunk, selectFeatureOfFunds } from "./featuresOfFundSlice_dep";

export const FeatureOfFunds = () => {
  const { id } = useParams()
  const [parentId] = useState(Number(id))
  const [featureOfFundId, setFeatureOfFundId] = useState(0)
  const [formData, setFormData] = useState(defaultIFeaturesOfFunds);
  const actionId = useState(uuid());
  const controller = new Controller(actionId, featureOfFundsThunk);
  const state = useAppSelector(selectFeatureOfFunds);
  const navigate = useNavigate();

  useEffect(() => {
    if (parentId) {
      if (!state[parentId]?.data[0]) {
        controller.all({ ...formData, parentId: parentId });
      }
    }
  }, [])

  useEffect(() => {
    if (id && state[parentId]?.data) {
      Object.keys(state[parentId]?.data).map((key) => {
        let value = state[parentId]?.data[key]
        if (value && value.id) {
          setFormData(value);
          setFeatureOfFundId(value.id);
        } else {
          setFormData({ ...formData, parentId: parentId })
        }
      });
    }
  }, [state[parentId]?.data])

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
    if (parentId) {
      navigate(`/detailed/fundRaising/${parentId}`)
    }
  }

  const handleBack = () => {
    if (parentId) {
      navigate(`/detailed/sidbiReference/${parentId}`)
    }
  }

  return <>
    {controller.isActionError(parentId, state) ?
      <div style={{ margin: "10px", color: "red" }}>{controller.error(parentId, state)}</div> : <></>}
    <TextField
      required
      id="domesticAmount1"
      label="Domestic Amount 1."
      value={formData["domesticAmount1"]}
      variant="standard"
      onChange={handleChange}
      sx={{ display: 'flex', ml: 2 }} />
    <button onClick={handleBack}>Back</button>
    <button onClick={handleSave}>Save</button>
    <button onClick={handleNext}>Next</button>
  </>
}


