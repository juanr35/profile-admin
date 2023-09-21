import TableSort from "./TableSort";
import PageHeader from "../bodyHeader/PageHeader";
import HubIcon from '@mui/icons-material/Hub';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Paper } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import theme from '../../../../src-material-ui/themeBodyComponent';

export default function TableSortWithPaper(props) {
  let { listUsers, headCells, selectCells, setAccount, setBackdrop, handleSelectUser, children } = props

  return (
    <ThemeProvider theme={theme}>
      <Paper 
        sx={{
          margin: theme.spacing(2),
          padding: theme.spacing(1),
          zIndex: 1
        }}
      >
        {children}
      </Paper>
    </ThemeProvider>
  ) 
}