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

import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import BloodtypeIcon from '@mui/icons-material/Bloodtype';

const optionsCedula = ['V', 'E']
const optionsSexo = ['Masculino', 'Femenino']
const optionsCategoria = [
  'Sub 7', 'Sub 8', 'Sub 9',
  'Sub 10', 'Sub 11', 'Sub 12',
  'Sub 13', 'Sub 14', 'Sub 15', 
  'Sub 16', 'Sub 17', 'Sub 18',
  'Sub 19', 'Absoluta'
]
const optionsPosicion = [   
  'Sin definir', 'Portero', 'Defensa Central',
  'Defensa Lateral', 'Centrocampista', 'Mediapunta',
  'Medio Centro Defensivo', 'Interior Derecho o Izquierdo',
  'Delantero Centro', 'Segunda Punta', 'Extremo',
];
const optionsGrupoSanguineo = [   
  'O-', 'O+', 'A-', 'A+', 
  'B-', 'B+', 'AB-', 'AB+'
];
const optionsPiernaDominante = ['Derecha', 'Izquierda'];

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
  
  /** First render */    
  useEffect(() => {
    setValues((prev) => ({
      ...prev,
      ...account
    }))
  }, [])

  /** Check if the data incoming is only for images fields */
  useEffect(() => {
    if ( account.image_1 && account.image_1.secure_url != values.image_1.secure_url ) {
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/${account._id}`,
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
              name={"image_1"}
              file={values.image_1}
              idAccount={account._id}
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
              />
              <Input
                label="Segundo Nombre"
                name="segundo_nombre"
                value={values.segundo_nombre}
                onChange={handleInputChange}
                error={errors.segundo_nombre}
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
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <DatePicker
                disableFuture={true}
                name="fecha_nacimiento"
                label="Fecha de Nacimiento"
                value={values.fecha_nacimiento}
                onChange={handleInputChange}
              />
              <SelectDialogV2
                name="category"
                title="Categoria"
                value={values.category}
                onChange={handleInputChange}
                options={optionsCategoria}
                error={errors.category}
                sx={{ width: '90%' }}
              />
              <Input
                label="Edad"
                name="edad"
                value={values.edad}
                onChange={handleInputChange}
                error={errors.edad}
                sx={{ width: '10ch' }}
              />
            </Stack>
          </Grid>
          <Grid item xs={12} md={6}>
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <SelectDialog
                name="posicion"
                title='Posicion'
                icon={<DirectionsRunIcon/>}
                options={optionsPosicion}
                value={values.posicion}
                onChange={handleInputChange}
                error={errors.category}
                sx={{ width: '90%' }}
              />
              <SelectDialog
                name="grupo_sanguineo"
                title='Grupo Sanguíneo'
                icon={<BloodtypeIcon/>}
                options={optionsGrupoSanguineo}
                value={values.grupo_sanguineo}
                onChange={handleInputChange}
                error={errors.grupo_sanguineo}
                sx={{ width: '90%' }}

              />
            </Stack>
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <Input
                label="Estatura"
                name="estatura_m"
                value={values.estatura_m}
                onChange={handleInputChange}
                error={errors.estatura_m}
                sx={{ width: '13ch' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">m</InputAdornment>,
                }}
              />
              <Input
                label="Peso"
                name="peso_kg"
                value={values.peso_kg}
                onChange={handleInputChange}
                error={errors.peso_kg}
                sx={{ width: '10ch' }}
                InputProps={{
                  endAdornment: <InputAdornment position="end">kg</InputAdornment>,
                }}
              />
              <Select
                name="pierna_dominante"
                label="Pierna Dominante"
                value={values.pierna_dominante}
                onChange={handleInputChange}
                options={optionsPiernaDominante}
                error={errors.pierna_dominante}
                sx={{ width: '38%' }}
              />
            </Stack>
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <Input
                label="Telefono"
                name="telefono"
                value={values.telefono}
                onChange={handleInputChange}
                error={errors.telefono}
                sx={{ width: '45%' }}
              />
              <Input
                label="Telefono de Habitacion"
                name="telefono_habitacion"
                value={values.telefono_habitacion}
                onChange={handleInputChange}
                error={errors.telefono_habitacion}
                sx={{ width: '45%' }}
              />
            </Stack>
            <AccordionCheck 
                name="alergias_operaciones"
                label="Alergias - Operaciones"
                value={values.alergias_operaciones}
                onChange={handleInputChange}
                error={errors.alergias_operaciones}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Input
              label="Direccion"
              name="direccion_habitacion"
              value={values.direccion_habitacion}
              onChange={handleInputChange}
              error={errors.direccion_habitacion}
              multiline
              rows={2} 
              sx={{ width: '90%' }}
            />
            <Stack direction={{ xs: 'row', sm: 'row' }} >
              <Input
                label="Institucion"
                name="institucion"
                value={values.institucion}
                onChange={handleInputChange}
                error={errors.institucion}
                sx={{ width: '60%' }}
              />
              <Input
                label="Grado - Año"
                name="año_grado"
                value={values.año_grado}
                onChange={handleInputChange}
                error={errors.año_grado}
                sx={{ width: '30%' }}
              />
            </Stack>
            <Input
              label="Lugar de Nacimiento"
              name="lugar_nacimiento"
              value={values.lugar_nacimiento}
              onChange={handleInputChange}
              error={errors.lugar_nacimiento}
              sx={{ width: '90%' }}
            />
            <Stack>
              <Input
                label="Partida de Nacimiento"
                name="partida_nacimiento"
                value={values.partida_nacimiento}
                onChange={handleInputChange}
                error={errors.partida_nacimiento}
              />
              <Input
                label="Pasaporte"
                name="pasaporte"
                value={values.pasaporte}
                onChange={handleInputChange}
                error={errors.pasaporte}
              />
            </Stack>
          </Grid>
        </Grid>
        <Stack
          direction={{ xs: 'column', sm: 'row' }}
          justifyContent="center"
          alignItems={{ xs: 'center', sm: 'center' }}
          spacing={2}
          sx={{p:"15px"}}
        >
          <div>
            <Button
              onClick={handleSubmit}  
              text="Guardar" 
            />
          </div>
        </Stack>
      </Form>
    </>
  )
}
