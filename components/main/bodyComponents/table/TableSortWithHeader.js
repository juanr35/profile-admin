import TableSort from "./TableSort";
import PageHeader from "../bodyHeader/PageHeader";
import HubIcon from '@mui/icons-material/Hub';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { Paper } from '@mui/material';
import { createTheme, ThemeProvider, useTheme } from '@mui/material/styles';
import theme from '../../../../src-material-ui/themeBodyComponent';

export default function DataFormWithHeader(props) {
  let { listUsers, headCells, setAccount, setBackdrop } = props

  return (
    <ThemeProvider theme={theme}>
      <PageHeader
        title="List"
        subTitle="Sort and filter with the options below"
        icon={<ContentPasteSearchIcon fontSize="large" />}
      />
      <Paper 
        sx={{
          margin: theme.spacing(2),
          padding: theme.spacing(1)
        }}
      >
        <TableSort
          listUsers={listUsers}
          headCells={headCells}
        />

      </Paper>
    </ThemeProvider>
  ) 
}