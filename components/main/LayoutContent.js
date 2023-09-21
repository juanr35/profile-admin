import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import CodeIcon from '@mui/icons-material/Code';
import TerminalIcon from '@mui/icons-material/Terminal';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import MinimizeIcon from '@mui/icons-material/Minimize';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';


import LensBlurIcon from '@mui/icons-material/LensBlur';


function Copyright() {
  return (
    <>
      <Box
        sx={{
          typography: 'body2',
          color: "text.secondary",
          '& > :not(style) + :not(style)': {
          ml: 6,
          },
        }}
      
    >
      <Link href="#" color="inherit" underline="none">Site Map</Link>
      <Link href="#" color="inherit" underline="none">Contact Us</Link>
      <Link href="#" color="inherit" underline="none">Terms and Conditions</Link>
      <Link href="#" color="inherit" underline="none">Privacy Policy</Link>
    </Box>
    
    <Typography variant="body2" color="text.secondary">
        {'Copyright © '}
        <Link color="inherit" href="https://mui.com/">
          Your Website
        </Link>{' '}
        {new Date().getFullYear()}
        {'.'}
    </Typography>
    </>
  );
}

export default function LayoutContent({content}) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '70vh',
      }}
    >
      <CssBaseline />
      <Container>
        {content}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm" align="center">        
          <ArrowForwardIosIcon fontSize='medium' />
          <LensBlurIcon fontSize='large' />
          <FingerprintIcon fontSize='medium'/>
          <Copyright />
        </Container>
      </Box>
    </Box>
  );
}