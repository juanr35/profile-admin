import PersonIcon from '@mui/icons-material/Person';
import { Paper } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import theme from '../../../../src-material-ui/themeBodyComponent';
import Typography from '@mui/material/Typography';
import PageHeader from "../bodyHeader/PageHeader";
import AccordionPanel from "./AccordionPanel";

export default function DataFormWithHeader(props) {
  let { account, setAccount, setBackdrop, idAccount } = props

  return (
    <ThemeProvider theme={theme}>
      <PageHeader
        title="Historial Clinico"
        subTitle="Info"
        icon={<PersonIcon fontSize="large" />}
      />
      <Paper 
        sx={{
          margin: theme.spacing(2),
          padding: theme.spacing(1)
        }}
      >
        <AccordionPanel
          account={account}
          setBackdrop={setBackdrop} 
        />
      </Paper>
    </ThemeProvider>
  ) 
}