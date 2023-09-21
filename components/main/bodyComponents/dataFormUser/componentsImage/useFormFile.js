import { useTheme } from '@mui/material/styles';
import { FormControl } from '@mui/material';
import { useState } from 'react';

const emptyValues = {
  image_1: {
    secure_url: '',
    public_id: '',
    newFile: null
  },
  image_2: {
    secure_url: '',
    public_id: '',
    newFile: null
  },
}

export function useFormFile(initialValues) {

  const { image_1, image_2 } = initialValues

  /**Control upload files */
  const [files, setFiles] = useState({ image_1, image_2 })
  const [errors, setErrors] = useState({});

  const resetForm = () => {
    setFiles(emptyValues);
    setErrors({})
  }

  return {
    files,
    setFiles,
    errors,
    setErrors,
    resetForm
  }
}