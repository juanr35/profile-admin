import { useTheme } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import { useState } from 'react';

const emptyValues = {
  patologico_metabolico: {
    checked: false,
    description: ''
  },
  patologico_gastrointestinal: {
    checked: false,
    description: ''
  },
  patologico_neurologico: {
    checked: false,
    description: ''
  },
  patologico_cardiaco: {
    checked: false,
    description: ''
  },
  patologico_genitourinario: {
    checked: false,
    description: ''
  },
  infeccioso_vph: {
    checked: false,
    description: ''
  },
  infeccioso_vih: {
    checked: false,
    description: ''
  },
  infeccioso_hepatitis_a: {
    checked: false,
    description: ''
  },
  infeccioso_hepatitis_b: {
    checked: false,
    description: ''
  },
  quirurgico: {
    checked: false,
    description: ''
  },
  toxico_alergico: {
    checked: false,
    description: ''
  },
  medicamentos: {
    checked: false,
    description: ''
  },
  hematologicos: {
    checked: false,
    description: ''
  },
  examen_clinico: {
    checked: false,
    description: ''
  },
  paraclinico: {
    checked: false,
    description: ''
  },
  diagnostico: {
    checked: false,
    description: ''
  },
  plan_tratamiento: {
    checked: false,
    description: ''
  },
  observacion_final: {
    checked: false,
    description: ''
  }
}

export function useForm() {
  const [values, setValues] = useState(emptyValues);
  const [errors, setErrors] = useState({});

  const handleInputChange = e => {
    const { name, value } = e.target
    setValues({
      ...values,
      [name]: value
    })
  }

  const resetForm = () => {
    setValues(emptyValues);
    setErrors({})
  }

  return {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  }
}

export function Form(props) {
  const theme = useTheme()
  const { children, ...other } = props;

  return (
    <FormControl       
      sx={{
        '& .MuiFormControl-root': {         
          margin: theme.spacing(1)
        }
      }}
      autoComplete="off" 
      {...other}
      >
      {children}
    </FormControl>
  )
}