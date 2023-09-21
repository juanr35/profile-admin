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
const MENU = ['registry_1', 'registry_2'];
const emptyValues = {
  //registry: '1',
  active: true,
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
  email: '',        
  profesion: '',
  empresa: '',
  image: {
    secure_url: '',
    public_id: ''
  },  
}

const Stack = styled((props) => (
  <MuiStack 
    direction={{ xs: 'column', sm: 'row' }}
    justifyContent="flex-start"
    alignItems={{ xs: 'center', sm: 'flex-start' }}
    spacing={2}
    {...props} 
  />
))(({ theme }) => ({}));

function FormParent(props) {
  const {
    values,
    idAccount,
    setValues,
    errors,
    setBackdrop,
    handleInputChange,
    handleDelete } = props

  return (
    <>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'center', sm: 'left' }}
        spacing={2}
        sx={{p:"15px"}}
      >
        <div>
          <Button
            onClick={handleDelete}  
            text="Borrar" 
            color="error"
          />
        </div>
      </Stack>
      <Form>
        <Grid container>
          <Grid item xs={12} md={9}>
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
              />
              <Input
                label="Email"
                name="email"
                value={values.email}
                onChange={handleInputChange}
                error={errors.email}
              />
            </Stack>
            <Stack direction={{ xs: 'row', sm: 'row' }}>
              <Input
                label="Profesion"
                name="profesion"
                value={values.profesion}
                onChange={handleInputChange}
                error={errors.profesion}
              />
              <Input
                label="Empresa"
                name="empresa"
                value={values.empresa}
                onChange={handleInputChange}
                error={errors.empresa}
              />
            </Stack>
          </Grid>
          <Grid 
            item xs={12} 
            md={3}            
            justifyContent="space-around"
            align="center" 
            sx={{
              p: 2
            }}
          >
            <CardItem 
              title={"Foto"} 
              name={`image_${Number(values.registry)+1}`}
              file={values.image}
              idAccount={idAccount}
              setFiles={setValues}
              setBackdrop={setBackdrop}             
            />
          </Grid>
        </Grid>
      </Form>
    </>
  )
}

export default function DataForm(props) {
  const [menuList, setMenuList] = React.useState([]);
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

  useEffect(() => {
    /** First render */    
    account.parentsId?.forEach( function (item) {
      const ind = item.registry
      setValues((prev) => ({
        ...prev,
        [`registry_${ind}`]: {
          ...prev[`registry_${ind}`],
          ...item,
        }
      }))

      if ( item.active && !menuList.includes(`registry_${item.registry}`) ) {
        setMenuList((prev) => [`registry_${item.registry}`, ...prev]);  
      }
    });        
  }, [])

  useEffect(() => {
    /** Check if the data incoming is only for images fields */
    if ( 
      account.image_2 && account.image_2.secure_url != values.registry_1.image.secure_url || 
      account.image_3 && account.image_3.secure_url != values.registry_2.image.secure_url 
    ) {
      new Array('image_2', 'image_3').forEach((field, ind) => {
        setValues((prev) => ({
          ...prev,
          [`registry_${ind+1}`]: {
            ...prev[`registry_${ind+1}`],
            image: account[field]
          }
        }))
      })
    }
    else {
      account.parentsId?.forEach( function (item) {
        const ind = item.registry
        setValues((prev) => ({
          ...prev,
          [`registry_${ind}`]: {
            ...prev[`registry_${ind}`],
            ...item,
          }
        }))
  
        if ( item.active && !menuList.includes(`registry_${item.registry}`) ) {
          setMenuList((prev) => [`registry_${item.registry}`, ...prev]);  
        }
      });        
    }
  }, [account])

  useEffect(() => {
    menuList.forEach( item => {
      setValues((prev) => ({
        ...prev,
        [item]: {
          ...prev[item],
          active: true
        }
      }))
    })
  }, [menuList, account])

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

  const handleAddForm = () => {
    const nextHiddenItem = MENU.find((i) => !menuList.includes(i));
    if (nextHiddenItem) {
      setMenuList((prev) => [nextHiddenItem, ...prev]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errs = validate();

    if (Object.keys(errs).length) return;
    setBackdrop(true)    
       
    try {
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/parents/${account._id}`,
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

  const handleDelete = registry => async (e) => {
    e.preventDefault();

    try {
      setMenuList((prev) => [...prev.filter((i) => i !== registry)]);

      if (values[registry]?.image?.public_id) {
        setBackdrop(true)    
        await axios({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/files/${account._id}`,
          method: "DELETE",
          data: {
            [`image_${Number(values[registry].registry)+1}`]: values[registry].image 
          },
          headers: {
            'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
          },
          withCredentials: true,
        })
      }
      if ( values[registry]?._id ){
        setBackdrop(true)    
        let dataReset = {
          ...emptyValues,
          registry: registry.slice(-1),
          _id: values[registry]._id
        }
        await axios({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/parents/${account._id}`,
          method: "put",
          data: {
            [registry]: dataReset
          },
          params: { desactiveAfter: true },
          headers: {
            'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
          },
          withCredentials: true,
        })     
      }
      else {
        setValues((prev) => ({
          ...prev,
          [registry]: {
            ...emptyValues,
            registry: registry.slice(-1),
            active: false
          }
        }))
      }
    } 
    catch (error) {
      console.error(error)
    }
  };

  return (
    <>
      {values.registry_1.active &&
        <FormParent 
          values={values.registry_1}
          idAccount={account._id}
          setValues={setValues}
          errors={errors}
          setBackdrop={setBackdrop}
          handleInputChange={handleInputChange('registry_1')}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete('registry_1')}
      />}
      {
        values.registry_1.active && 
        values.registry_2.active &&
        <>
          <Box
            sx={{
              height: 25,
            }}
          />
          <Divider sx={{ p: 3 }} />
          <Divider sx={{ p: 3 }} />
          <Box
            sx={{
              height: 25,
            }}
          />
        </>
      }  
      {values.registry_2.active &&
        <FormParent 
          values={values.registry_2}
          idAccount={account._id}
          setValues={setValues}
          errors={errors}
          setBackdrop={setBackdrop}
          handleInputChange={handleInputChange('registry_2')}
          handleSubmit={handleSubmit}
          handleDelete={handleDelete('registry_2')}
      />}
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent={{ xs: 'center', sm: 'space-evenly' }}
        alignItems={{ xs: 'center', sm: 'center' }}
        spacing={4}
        sx={{p:"15px"}}
      >
        {menuList.length >= 1 &&
          <Button
            onClick={handleSubmit}  
            text="Guardar" 
        />}
        <Button
          onClick={handleAddForm}  
          text="Agregar Padre"
          disabled={menuList.length >= MENU.length}
        />      
      </Stack>
    </>
  )
}
