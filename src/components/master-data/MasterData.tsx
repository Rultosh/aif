import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import MasterDataService from './MasterDataService';

interface MasterDataProps {
  propertyType: string,
  propertyValue: Number | undefined,
  onChange: (id: string, value: string) => void
}

export default function MasterData(props: MasterDataProps) {

  const [listOfValues, setListOfValues] = React.useState([] as any);
  const [value, setValue] = React.useState(props.propertyValue || '');

  React.useEffect(() => {
    MasterDataService.load(props.propertyType).then((response: any) => {
      setListOfValues(response.data);
    });
  }, [])

  const handleChange = (ev:any) => {
    setValue(ev.target.value);
    props.onChange(props.propertyType, ev.target.value);
  }

  return (<Select
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
    </Select>)
}