import { MenuItem, Select, Typography } from '@mui/material';
import * as React from 'react';
import MasterDataService from './MasterDataService';
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";
import FormHelperText from '@mui/material/FormHelperText';

interface MasterDataProps {
  propertyType: string,
  propertyValue: Number | undefined,
  onChange: (id: string, value: string) => void,
  propertyRequired: string | undefined,
  propertyTitle: any | undefined,
  control: any,
  childToParentSelect: any
}

export default function MasterData(props: MasterDataProps) {

  const [listOfValues, setListOfValues] = React.useState([] as any);
  const [value, setValue] = React.useState(props.propertyValue || '');
  const [valueSelect, setValueSelect] = React.useState('');

  React.useEffect(() => {
    MasterDataService.load(props.propertyType).then((response: any) => {
      setListOfValues(response.data);
    });
  }, [])

  const handleChange = (ev: any) => {
    setValue(ev.target.value);
    props.childToParentSelect(props.propertyType, ev.target.value);
    props.onChange(props.propertyType, ev.target.value);
  }

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(props.propertyTitle),
  });
  const propertyTypeErrors = errors;
  return (
    <>
      {props.propertyRequired == 'required' ? (
        <>
          <Controller
            name={props.propertyType}
            control={props.control}
            defaultValue={null}
            render={({
              field: { onChange, value },
              fieldState: { error, invalid }
            }) => (
              console.log(invalid && (props.propertyValue || '')),
              (
                <>
                  <Select
                    labelId={props.propertyType}
                    id={props.propertyType}
                    value={props.propertyValue || ''}
                    onChange={handleChange}
                    name={props.propertyType}
                    error={invalid && ((props.propertyValue || '') == '') ? true : false}
                  >
                    {
                      listOfValues.map((item: { id: string | number | readonly string[] | undefined; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                        // console.log('CB', props.propertyValue, item.id, props.propertyValue === item.id);
                        return <MenuItem
                          value={item.id}
                          selected={props.propertyValue === item.id} >
                          {item.value}
                        </MenuItem>
                      })
                    }
                  </Select>
                  {invalid &&  ((props.propertyValue || '') == '')? <FormHelperText>
                    <Typography variant="caption" color="error" sx={{ ml: '10px' }}>
                      <>{props.propertyTitle} is required</>
                    </Typography>
                  </FormHelperText> : <></>}
                </>
              )
            )}
          />
        </>)
        : (<>
          <Select
            labelId={props.propertyType}
            id={props.propertyType}
            value={props.propertyValue || ''}
            onChange={handleChange}
            name={props.propertyType}
          >
            {
              listOfValues.map((item: { id: string | number | readonly string[] | undefined; value: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | React.ReactPortal | null | undefined; }) => {
                // console.log('CB', props.propertyValue, item.id, props.propertyValue === item.id);
                return <MenuItem
                  value={item.id}
                  selected={props.propertyValue === item.id} >
                  {item.value}
                </MenuItem>
              })
            }
          </Select>
        </>)}  </>)
}