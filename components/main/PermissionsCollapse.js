import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { Fragment, useState } from 'react';

import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

const headCells = [
  [
    'Sub 7', 'Sub 8', 'Sub 9',
    'Sub 10', 'Sub 11', 'Sub 12',
    'Sub 13', 'Sub 14',
  ],
  [
    'Sub 15', 'Sub 16', 'Sub 17', 
    'Sub 18', 'Sub 19', 'Absoluta'
  ]
]

export default function AppBarCollapse(props) {
  const { permissions } = props
  const [open, setOpen] = useState(false);
  
  const handleChange = (event, newValue) => {
    handleValueMenu(newValue);
  };
  
  return (
    <Fragment>
      <Table aria-label="spanning table">
        <TableRow>
          <TableCell align="left" colSpan={4} >
            <IconButton
              aria-label="expand row"
              size="small"
              onClick={() => setOpen(!open)}
            >
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
            Permisos
          </TableCell>
        </TableRow>            
        {headCells.map((array, index) => (          
          <TableRow key={index} >
            <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} >
              <Collapse in={open} timeout="auto" unmountOnExit>
                <Box sx={{ margin: 1 }}>
                  <Table aria-label="purchases">
                    <TableHead>
                      <TableRow>
                        <TableCell key='category' align='center'></TableCell>
                        {
                          array.map( (cell, index) => (
                            <TableCell key={index} align='center'>{cell}</TableCell>
                          ))
                        }
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                        <TableCell align="center" >Lectura</TableCell>
                        {array.map((cell, index) => (
                          <TableCell key={index} align="center">
                            <IconButton
                              aria-label="expand row"
                              size="small"
                            >
                              {permissions.read.includes(cell) ? <CheckIcon /> : <CloseIcon />}
                            </IconButton>
                          </TableCell>
                        ))}
                      </TableRow>
                      <TableRow>
                        <TableCell align="center" >Escritura</TableCell>
                        {array.map((cell, index) => (
                          <TableCell key={index} align="center">
                            <IconButton
                              aria-label="expand row"
                              size="small"
                            >
                              {permissions.write.includes(cell) ? <CheckIcon /> : <CloseIcon />}
                            </IconButton>
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableBody>
                  </Table>
                </Box>
              </Collapse>
            </TableCell>
          </TableRow>
        ))}
      </Table>
    </Fragment>
  );
}