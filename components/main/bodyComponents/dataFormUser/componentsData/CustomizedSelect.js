import * as React from 'react';
import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';
import { TextField } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Stack from '@mui/material/Stack';

export default function CustomizedSelect(props) {

  const { name, label, value, error=null, onChange, options, sx, ...other } = props;

  const joinOptions = (name, field, val) => ({
	  target: {
		  name, 
		  value: {
        ...value,
        [field]: val
      }
		}
	})

  return (    
    <Stack 
      direction='row'
      justifyContent="flex-start"
      alignItems={{ xs: 'center', sm: 'flex-start' }}
      spacing={2}
      {...sx} 
    > 
      <FormControl variant="outlined"
        {...(error && { error:true })}
      >
        <MuiSelect
          name={name}
          value={value.select}
          onChange={e => onChange(joinOptions(name, 'select', e.target.value))}
        >
          {
          options.map((item, index) => (
            <MenuItem key={index} value={index}>{item}</MenuItem>
          ))
          }
        </MuiSelect>
      </FormControl>
      <TextField
        variant="outlined"
        label={label}
        name={name}
        value={value.input}
        onChange={e => onChange(joinOptions(name, 'input', e.target.value))}
        sx={{ width: '80%' }}
        {...(error && { error:true, helperText:error })}
        {...other}
      />
    </Stack>
  );
}
