import TextField from '@mui/material/TextField';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker as MuiDatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { useState } from 'react';

export default function DatePicker(props) {

  const { name, label, value, onChange, ...other } = props

  const convertToDefEventPara = (name, value) => ({
    target: {
      name, 
      value
    }
  })

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
        label={label}
        name={name}
        inputFormat="dd/MM/yyyy"
        onChange={e => onChange(convertToDefEventPara(name, e))}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        {...other}
        />
    </LocalizationProvider>
  )
}
/*
return (
  <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MuiDatePicker
      label={label}
      name={name}
        onChange={onChange}
        value={value}
        renderInput={(params) => <TextField {...params} />}
        />
    </LocalizationProvider>
  )
}
      */