import { Fragment, useState, useEffect, forwardRef } from "react";
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary {...props} />
))(({ theme }) => ({
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(0deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
}));

export default function ControlledAccordions(props) {

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
    <div>
      <Accordion sx={{  mb: 1, ml: 1 ,width: '90%', justifyContent:'center' }} expanded={value.checked} >
        <AccordionSummary
          expandIcon={    
            <Checkbox
              name={name}
              checked={value.checked}
              onChange={e => onChange(joinOptions(name, 'checked', e.target.checked))}
              inputProps={{ 'aria-label': 'controlled' }}
          />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography >
            {label}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
            Descripcion
          </Typography>
          <Box
            sx={{
              maxWidth: '100%',
            }}
          >
            <TextField 
              rows={4} 
              multiline 
              fullWidth 
              variant="outlined"
              label={label}
              name={name}
              value={value.descripcion}
              onChange={e => onChange(joinOptions(name, 'descripcion', e.target.value))}
            />
          </Box>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}