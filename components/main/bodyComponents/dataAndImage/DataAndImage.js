import React, { useState, useEffect } from 'react'
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import axios from "axios"

/** Material UI */
import Grid from '@mui/material/Grid';
import Button from "./componentsData/Button";
import Checkbox from "./componentsData/Checkbox";
import DatePicker from "./componentsData/DatePicker";
import Input from "./componentsData/Input";
import RadioGroup from "./componentsData/RadioGroup";
import Select from "./componentsData/Select";
import CustomizedSelect from "./componentsData/CustomizedSelect";
import { useForm, Form } from "./componentsData/useForm";
import { styled } from '@mui/material/styles';
import CardItem from "./componentsImage/CardItem";
import MuiStack from '@mui/material/Stack';
import InputAdornment from '@mui/material/InputAdornment';
import SelectDialog from "./componentsData/SelectDialog"
import AccordionCheck from "./componentsData/AccordionCheck"
import SelectDialogV2 from "./componentsData/SelectDialogV2"
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Chip from '@mui/material/Chip';

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';
import { set } from 'date-fns';

const optionsCedula = ['V', 'E']
const optionsSexo = ['Masculino', 'Femenino']

const Stack = styled((props) => (
  <MuiStack 
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="flex-start"
    alignItems={{ xs: 'center', sm: 'flex-start' }}
    spacing={2}
    {...props} 
  />
))(({ theme }) => ({}));

export default function DataForm(props) {
  let { account, setBackdrop, idAccount } = props
  const { data: session, status } = useSession()
  let {
    values,
    setValues,
    errors,
    setErrors,
    handleInputChange,
    resetForm
  } = useForm();

  /** First render */    
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ...account
    }))
  }, [])

  /** Check if the data incoming is only for images fields */
  useEffect(() => {
    if ( account?.image_1?.secure_url && account.image_1?.secure_url != values.image_1?.secure_url ) {
      setValues((prev) => ({
        ...prev,
        image_1: account.image_1
      }))
    }
    else {
      setValues((prev) => ({
        ...prev,
        ...account
      }))
    }
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/account/${idAccount ? idAccount : ''}`,
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
    <>
      <Form>
        <Grid container>
          <Grid 
            item xs={12} 
            md={4}            
            justifyContent="space-around"
            align="center" 
            sx={{
              p: 2
            }}
          >
            <CardItem 
              title={"Foto"} 
              name={`image_1`}
              file={values.image_1}
              idAccount={idAccount}
              setFiles={setValues}
              setBackdrop={setBackdrop}             
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <Stack direction={{ xs: 'row', sm: 'row' }}>
              <Input
                label="Primer Nombre"
                name="primer_nombre"
                value={values.primer_nombre}
                onChange={handleInputChange}
                error={errors.primer_nombre}
                sx={{ width: '100%' }}
              />
              <Input
                label="Segundo Nombre"
                name="segundo_nombre"
                value={values.segundo_nombre}
                onChange={handleInputChange}
                error={errors.segundo_nombre}
                sx={{ width: '100%' }}
              />
            </Stack>
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <Input
                label="Primer Apellido"
                name="primer_apellido"
                value={values.primer_apellido}
                onChange={handleInputChange}
                error={errors.primer_apellido}
              />
              <Input
                label="Segundo Apellido"
                name="segundo_apellido"
                value={values.segundo_apellido}
                onChange={handleInputChange}
                error={errors.segundo_apellido}
              />
            </Stack>
            <Stack>
              <CustomizedSelect
                name="cedula"
                label="Cedula"
                value={values.cedula}
                onChange={handleInputChange}
                options={optionsCedula}
                error={errors.cedula}
                sx={{ width: '60%' }}
              />
              <Input
                label="Nacionalidad"
                name="nacionalidad"
                value={values.nacionalidad}
                onChange={handleInputChange}
                error={errors.nacionalidad}
                sx={{ width: { xs: '80%', sm: '35%' } }}
              />
              <Select
                name="sexo"
                label="Sexo"
                value={values.sexo}
                onChange={handleInputChange}
                options={optionsSexo}
                error={errors.sexo}
                sx={{ width: { xs: '80%', sm: '35%' } }}
              />              
            </Stack>
            <Stack direction={{ xs: 'row', sm: 'row' }}>
              <Input
                label="Telefono"
                name="telefono"
                value={values.telefono}
                onChange={handleInputChange}
                error={errors.telefono}
                sx={{ width: '50%' }}
              />
              <Input
                label="Cargo"
                name="cargo"
                value={values.cargo}
                onChange={handleInputChange}
                error={errors.cargo}
              />
            </Stack>
          </Grid>
        </Grid>
      </Form>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-evenly' }}
        alignItems={{ xs: 'center', sm: 'center' }}
        spacing={4}
        sx={{p:"15px"}}
      >
        <Button
          onClick={handleSubmit}  
          text="Guardar" 
        />
      </Stack>
    </>
  )
}
