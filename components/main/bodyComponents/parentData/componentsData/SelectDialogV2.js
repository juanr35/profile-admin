import * as React from 'react';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Button from '@mui/material/Button';
import OutlinedInput from '@mui/material/OutlinedInput';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Dialog from '@mui/material/Dialog';
import RadioGroup from '@mui/material/RadioGroup';
import Radio from '@mui/material/Radio';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputAdornment from '@mui/material/InputAdornment';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';

import AccountCircle from '@mui/icons-material/AccountCircle';
import ZoomOutMapIcon from '@mui/icons-material/ZoomOutMap';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

function ConfirmationDialogRaw(props) {
    const { title, onClose, options, value: valueProp, open, ...other } = props;
    const [value, setValue] = React.useState(valueProp);
    const radioGroupRef = React.useRef(null);
  
    React.useEffect(() => {
      if (!open) {
        setValue(valueProp);
      }
    }, [valueProp, open]);
  
    const handleEntering = () => {
      if (radioGroupRef.current != null) {
        radioGroupRef.current.focus();
      }
    };
  
    const handleCancel = () => {
      onClose();
    };
  
    const handleOk = () => {
      onClose(value);
    };
  
    const handleChange = (event) => {
      setValue(event.target.value);
    };
  
    return (
      <Dialog
        sx={{ '& .MuiDialog-paper': { width: '80%', maxHeight: 435 } }}
        maxWidth="xs"
        TransitionProps={{ onEntering: handleEntering }}
        open={open}
        {...other}
      >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent dividers>
          <RadioGroup
            ref={radioGroupRef}
            aria-label="ringtone"
            name="ringtone"
            value={value}
            onChange={handleChange}
          >
            {options.map((option) => (
              <FormControlLabel
                value={option}
                key={option}
                control={<Radio />}
                label={option}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={handleCancel}>
            Cancelar
          </Button>
          <Button onClick={handleOk}>Ok</Button>
        </DialogActions>
      </Dialog>
    );
  }
  

export default function ControlledOpenSelect(props) {
  const { title, name, value, error=null, onChange, options, sx, ...other } = props;
  const [open, setOpen] = React.useState(false);
  
  const handleClickListItem = () => {
    setOpen(true);
  };

  const handleClose = (newValue) => {
    setOpen(false);

    if (newValue) {
      onChange({
        target: {
          name,
          value: newValue
        }
      })
    }
  };

  return (
    <div>
      <FormControl 
        variant="outlined"
        sx={{
          'input#outlined-adornment-select-dialogv2': {
            cursor: "pointer"
          },
          '.MuiOutlinedInput-root' : {
            cursor: "pointer",
          },
          caretColor: 'transparent',
        }}  
      >
        <InputLabel htmlFor="outlined-adornment-select-dialogv2">{title}</InputLabel>
        <OutlinedInput
          name={name}
          value={value ? value : 'Sin definir'}
          id={`outlined-adornment-select-dialogv2`}
          label={title}
          onClick={handleClickListItem}
          endAdornment={
            <InputAdornment position="end" >
              <ZoomOutMapIcon />
            </InputAdornment>
          }
          sx={{...sx}}
        />
      </FormControl>
      <ConfirmationDialogRaw
        id={`${name}-menu`}
        keepMounted
        name={name}
        open={open}
        onClose={handleClose}
        value={value}
        options={options}
        title={title}
      />
    </div>
  );
}
