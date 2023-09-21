import * as React from 'react';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import { Button as MuiButton } from '@mui/material';


export default function Button(props) {
  const theme = useTheme()
  const { text, size, color, variant, onClick, ...other } = props

  return (
    <>
    <MuiButton 
      variant={variant || "contained"}
      size={size || "large"}
      color={color || "primary"}
      onClick={onClick}
      {...other}
      sx={{
        margin: theme.spacing(0.5),
        textTransform: 'none'
      }}
    >
      {text}
    </MuiButton>
    </>
  );
}