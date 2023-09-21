import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: "#333996",
      light: '#3c44b126'
    },
    secondary: {
      main: "#f83245",
      light: '#f8324526'
    },
    neutral: {
      main: '#c2ccc8',
    },
  },
  overrides:{
    MuiAppBar:{
      root:{
        transform:'translateZ(2)'
      }
    }
  },
  props:{
    MuiIconButton:{
      disableRipple:true
    }
  },
})

export default theme;
