import { useState, useEffect } from 'react';
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import axios from 'axios'

/** Material UI */
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Fab from "@mui/material/Fab";
import Button from '@mui/material/Button';


const maxWidth = 250
const maxHeight = 250

export default function CardItem(props) {
  const { data: session, status } = useSession()
  const { name, title, file, idAccount, setFiles, setBackdrop, subheader } = props;

  /**Control upload files */
  const [preview, setPreview] = useState(null)
  const [newFile, setNewFile] = useState(null);
  const [errors, setErrors] = useState({});

  /**Control menu icon */
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleClose = () => {
    setAnchorEl(null);
  };

  const deleteFile = (e) => {
    e.preventDefault();
    setAnchorEl(null);

    if ( file.public_id ) {
      setBackdrop(true)    
      try {
        axios({
          url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/files/${idAccount ? idAccount : ''}`,
          method: "DELETE",
          data: {
            [name]: file
          },
          headers: {
            'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
          },
          withCredentials: true,
        })
      } 
      catch (error) {
        console.error(error)
      }
    }
    if ( newFile ) {
      setNewFile(null);
    }
  }

  const validate = (fieldValue = newFile) => {
    let temp = {}
    /*
    if ('firstName' in fieldValues)
    fieldValues.firstName ? null : temp.firstName = "This field is required."
    if ('lastName' in fieldValues)
    fieldValues.lastName ? null : temp.lastName = "This field is required."
    if ('customized' in fieldValues)
    (fieldValues.customized.select && fieldValues.customized.input)  ? null : temp.customized = "This field is required." 
    if ('email' in fieldValues)
    temp.email = (/^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/).test(fieldValues.email) ? "" : "Email is not valid."
    if ('mobile' in fieldValues)
    fieldValues.mobile.length > 9 ? null : temp.mobile = "This field is required."
    if ('selectId' in fieldValues)
    fieldValues.selectId.length != 0 ? null : temp.selectId = "This field is required."
    */
    
    setErrors({
      ...temp
    })
    
    return temp
  }

  const handleSubmit = async () => {
    let errs = validate();
    if (Object.keys(errs).length) return;
    
    setBackdrop(true)    

    try {
      const formData = new FormData();
      formData.append(
        name,
        newFile
      )

      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/files/${idAccount ? idAccount : ''}`,
        method: "put",
        data: formData,
        headers: {
          'Authorization':`Bearer ${process.env.TOKEN_ACCESS}`
        },
        withCredentials: true,
      })
    } 
    catch (error) {
      console.error(error)
    }
  }
  
  const handleChangeFile = (e) => {

    if (!e.target.files || e.target.files.length === 0) {
      return
    }
    setNewFile(e.target.files[0]);
  }

  // If url of image exist, create a preview as a side effect
  useEffect(() => {
    if ( file?.error && newFile ) {
      setNewFile(null)
      setFiles( (files) => {
        return {
          ...files,
          [name]: {
            newFile: null 
          }
        }
      });    }
    else if ( !file?.secure_url && !newFile ) {
      setPreview(null)  
      return
    }
    else if (file.secure_url) {
      setPreview(file.secure_url)
      setNewFile(null)
    }    
    else {
      const objectUrl = URL.createObjectURL(newFile)
      setPreview(objectUrl)
      handleSubmit()

      // Free memory when ever this component is unmounted
      return () => URL.revokeObjectURL(objectUrl)
    }
  }, [file, newFile])

  return (
    <>
    <Card 
        elevation={3}
        sx={{  
          width: maxWidth,
        }}
      >
        <CardHeader
            title={title}
            subheader={subheader}
            action={
              preview ? (
                <div>
                  <IconButton
                    id="basic-button"
                    aria-controls={open ? 'basic-menu' : undefined}
                    aria-haspopup="true"
                    aria-expanded={open ? 'true' : undefined}
                    onClick={handleClick}
                  >
                    <MoreVertIcon />
                  </IconButton>
                  <Menu
                    id="basic-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={handleClose}
                    MenuListProps={{
                      'aria-labelledby': 'basic-button',
                    }}
                  >
                    <MenuItem onClick={deleteFile}>Delete</MenuItem>
                  </Menu>
                </div>
              ) : null
            }
        />
        {
          preview ? (
            <CardMedia
              component="img"
              image={preview}
              alt={title}
            />         
          ) : (
            <Box 
              align="center"
              sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                width: maxWidth,
                height: maxHeight 
              }}
            >
              <Typography variant="h4" component="h1" align='center' gutterBottom>
                Sin imagen
              </Typography>

              <label htmlFor={`upload-${name}`}>
                <input
                  style={{ display: "none" }}
                  id={`upload-${name}`}
                  name={name}
                  type="file"
                  onChange={handleChangeFile}
                />
                <Fab
                  color="secondary"
                  size="small"
                  component="span"
                  aria-label="add"
                  variant="extended"
                  sx={{ zIndex: 1 }}
                >
                  <AddIcon /> AGREGAR FOTO
                </Fab>
              </label>
            </Box>
          )
        }
      </Card>
    </>
  );
}