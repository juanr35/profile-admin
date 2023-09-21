import * as React from 'react';
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

export default function BasicSelect(props) {
  const { selectCells, onChange } = props
  const [option, setOption] = React.useState('Todos');
  
  const handleChange = (event) => {
    setOption(event.target.value);
    return event
  };

  return (
    <Box sx={{ minWidth: { xs: 400, sm: 300 }  }}>
      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">Category</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={option}
          label="Categoria"
          onChange={e => onChange(handleChange(e))}
        >
          <MenuItem key={0} value={'Todos'}>Todos</MenuItem>              
          {
            selectCells.map((obj, index) => (
              <MenuItem key={index+1} value={obj}>{obj}</MenuItem>              
            ))
          }
        </Select>
      </FormControl>
    </Box>
  );
}
