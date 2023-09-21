import { FormControl, InputLabel, Select as MuiSelect, MenuItem, FormHelperText } from '@mui/material';

export default function Select(props) {

  const { name, label, value,error=null, onChange, options, ...other } = props;

  return (
    <FormControl variant="outlined"
      sx={{ width: '80%' }}
      {...(error && { error:true })}
      {...other}
    >
      <InputLabel>{label}</InputLabel>
      <MuiSelect
        label={label}
        name={name}
        value={value}
        onChange={onChange}
      >
        {
          options.map((item, key) => (
            <MenuItem key={key} value={item}>{item}</MenuItem>
          ))
        }
      </MuiSelect>
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  )
}
