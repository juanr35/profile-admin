import { Fragment, useState, useEffect, forwardRef } from "react";
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import { styled } from '@mui/material/styles';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import Typography from '@mui/material/Typography';
import Checkbox from '@mui/material/Checkbox';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Divider from '@mui/material/Divider';
import Button from "./components/Button";
import MuiStack from '@mui/material/Stack';
import { useForm, Form } from "./components/useForm"; 

import axios from "axios"

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
}));

const Stack = styled((props) => (
  <MuiStack 
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="flex-start"
    alignItems={{ xs: 'center', sm: 'flex-start' }}
    spacing={2}
    {...props} 
  />
))(({ theme }) => ({}));

const afecciones = [
  {
    id: 'patologico_metabolico',
    label: 'Patologico Metabolico'
  },
  {
    id: 'patologico_gastrointestinal',
    label: 'Patologico Gastrointestinal'
  },
  {
    id: 'patologico_neurologico',
    label: 'Patologico Neurologico'
  },
  {
    id: 'patologico_cardiaco',
    label: 'Patologico Cardiaco'
  },
  {
    id: 'patologico_genitourinario',
    label: 'Patologico Genitourinario'
  },
  {
    id: 'infeccioso_vph',
    label: 'Infeccioso VPH'
  },
  {
    id: 'infeccioso_vih',
    label: 'Infeccioso VIH'
  },
  {
    id: 'infeccioso_hepatitis_a',
    label: 'Infeccioso Hepatitis A'
  },
  {
    id: 'infeccioso_hepatitis_b',
    label: 'Infeccioso Hepatitis B'
  },
  {
    id: 'quirurgico',
    label: 'Quirurgico'
  },
  {
    id: 'toxico_alergico',
    label: 'Toxico Alergico'
  },
  {
    id: 'medicamentos',
    label: 'Medicamentos'
  },
  {
    id: 'hematologicos',
    label: 'Hematologicos'
  },
]

const diagnosticos = [
  {
    id: 'examen_clinico',
    label: 'Examen Clinico'
  },
  {
    id: 'paraclinico',
    label: 'Paraclinico'
  },
  {
    id: 'diagnostico',
    label: 'Diagnostico'
  },
  {
    id: 'plan_tratamiento',
    label: 'Plan Tratamiento'
  },
  {
    id: 'observacion_final',
    label: 'Observacion Final'
  }
]

export default function ControlledAccordions(props) {
  let { account, setBackdrop } = props
  const { data: session, status } = useSession()
  let {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm();

  const joinOptions = (name, field, val) => ({
	  target: {
		  name, 
		  value: {
        ...values[name],
        [field]: val
      }
		}
	})

  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ...account
    }))
  }, [account])
  
  const validate = (fieldValues = values) => {
    let temp = {}
    if ('firstName' in fieldValues)
      fieldValues.firstName ? null : temp.firstName = "This field is required."
    if ('lastName' in fieldValues)
      fieldValues.lastName ? null : temp.lastName = "This field is required."
    if ('customized' in fieldValues)
      (fieldValues.customized.select && fieldValues.customized.input)  ? null : temp.customized = "This field is required."
    /* 
    if ('email' in fieldValues)
    temp.email = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(fieldValues.email) ? "" : "Email is not valid."
    */
    if ('mobile' in fieldValues)
      fieldValues.mobile.length > 9 ? null : temp.mobile = "This field is required."
    if ('selectId' in fieldValues)
      fieldValues.selectId.length != 0 ? null : temp.selectId = "This field is required."

    setErrors({
      ...temp
    })

    return temp
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = validate();
    if (Object.keys(errs).length) return;
    setBackdrop(true)    
       
    try {
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/medical/${account._id}`,
        method: "put",
        data: values,
        headers: {
          'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
        },
        withCredentials: true,
      })     
    } 
    catch (error) {
      console.error(error)
    }
  };
  
  return (
    <div>
      <Typography>
            Registro Medico
      </Typography>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'flex-start', sm: 'space-evenly' }}
        alignItems={{ xs: 'flex-start', sm: 'center' }}
        spacing={4}
        sx={{p:"15px"}}
      >
        <Typography sx={{ color: 'text.secondary' }}>
          Antecedentes medicos: {afecciones.filter( item => values[item.id]?.checked).length}
        </Typography>
        <Typography sx={{ color: 'text.secondary' }}>
          Diagnosticos: {diagnosticos.filter( item => values[item.id]?.checked).length}
        </Typography>
        {values?.grupo_sanguineo && 
          <Typography sx={{ color: 'text.secondary' }}>
            Tipo de Sangre: {values?.grupo_sanguineo}
        </Typography>}
      </Stack>
      {
        values?.alergias_operaciones?.checked &&
        values?.alergias_operaciones?.descripcion &&
        <TextField 
          name={'alergias_operaciones'}
          value={values?.alergias_operaciones?.descripcion}
          rows={4} 
          multiline 
          fullWidth 
          label="Alergias - Operaciones" 
          id="fullWidth" 
      />}
      {
        afecciones.map((item,index) => (
          <Accordion expanded={values[item.id].checked} key={index} >
            <AccordionSummary
              expandIcon={    
                <Checkbox
                  name={item.id}
                  checked={values[item.id].checked}
                  onChange={e => handleInputChange(joinOptions(e.target.name, 'checked', e.target.checked))}
                  inputProps={{ 'aria-label': 'controlled' }}
              />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: { xs: '60%' , sm: '80%'}, flexShrink: 0 }}>
                {item.label}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{values[item.id].checked ? null : 'Sin antecedentes'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  maxWidth: '100%',
                }}
              >
                <TextField 
                  name={item.id}
                  value={values[item.id].description} 
                  onChange={e => handleInputChange(joinOptions(e.target.name, 'description', e.target.value))}
                  rows={4} 
                  multiline 
                  fullWidth 
                  label="Descripcion" 
                  id="fullWidth" 
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      }
      <Divider sx={{ mt: 2 }} />
      <Divider />
      {
        diagnosticos.map((item, index) => (
          <Accordion expanded={values[item.id].checked} key={index} >
            <AccordionSummary
              expandIcon={    
                <Checkbox
                  name={item.id}
                  checked={values[item.id].checked}
                  onChange={e => handleInputChange(joinOptions(e.target.name, 'checked', e.target.checked))}
                  inputProps={{ 'aria-label': 'controlled' }}
              />}
              aria-controls="panel1bh-content"
              id="panel1bh-header"
            >
              <Typography sx={{ width: { xs: '60%' , sm: '80%'}, flexShrink: 0 }}>
                {item.label}
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>{values[item.id].checked ? null : 'Sin antecedentes'}</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box
                sx={{
                  maxWidth: '100%',
                }}
              >
                <TextField 
                  name={item.id}
                  value={values[item.id].description}
                  onChange={e => handleInputChange(joinOptions(e.target.name, 'description', e.target.value))}
                  rows={4} 
                  multiline 
                  fullWidth 
                  label="Descripcion" 
                  id="fullWidth" 
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        ))
      }
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="center"
        alignItems={{ xs: 'center', sm: 'center' }}
        spacing={2}
        sx={{p:"15px"}}
      >
        <Button
          onClick={handleSubmit}  
          text="Guardar" 
        />
      </Stack>
    </div>
  );
}
