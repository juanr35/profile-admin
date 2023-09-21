import { useTheme } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import { useState } from 'react';

const emptyValues = {
  primer_nombre: '',
  segundo_nombre: '',
  primer_apellido: '',
  segundo_apellido: '',
  cedula: {
    select: '0',
    input: '',
  },
  nacionalidad: '',
  sexo: '',
  telefono: '',
  cargo: '',
  image_1: {
    secure_url: '',
    public_id: ''
  },  
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