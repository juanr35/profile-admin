import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import ProTip from './src/ProTip';

export default function Profile(props) {

  const { onClickHandle, name } = props;

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          minHeight: '40vh',
          my: 10,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4" component="h1" align='center' gutterBottom>
          Welcome {name}
        </Typography>
        <Typography variant="h4" component="h1" align='center' gutterBottom>
          You have not yet filled in your data
        </Typography>
        <ProTip />
        <Box maxWidth="sm">
          <Button variant="contained" onClick={onClickHandle} >
            Add Info
          </Button>
        </Box>
      </Box>
    </Container>
  );
};