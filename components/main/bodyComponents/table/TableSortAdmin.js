import { Fragment, useState, useEffect, forwardRef } from "react";
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from '@mui/icons-material/Delete';

import useTable from "./components/useTable";
import SelectCategory from './components/SelectCategory'
import InputSearch from './components/InputSearch';
import AlertDialog from "../alertDialog/AlertDialog";
//import PermissionsCollapse from '../components/main/PermissionsCollapse';
import PermissionsCollapse from '../../PermissionsCollapse';

import axios from 'axios'

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(4n+1)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
  '&:hover': {
    backgroundColor: theme.palette.action.disabledBackground,
  },  
}));

const StyledInnerTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(4n+2)': {
    backgroundColor: theme.palette.action.hover,
  },  
}));

const headCellsPermissions = [
  [
    { id: 'sub-7', label: 'Sub 7', align: "center" },
    { id: 'sub-8', label: 'Sub 8', align: "center" },
    { id: 'sub-9', label: 'Sub 9', align: "center" },
    { id: 'sub-10', label: 'Sub 10', align: "center" },
    { id: 'sub-11', label: 'Sub 11', align: "center" },
    { id: 'sub-12', label: 'Sub 12', align: "center" },
    { id: 'sub-13', label: 'Sub 13', align: "center" },
    { id: 'sub-14', label: 'Sub 14', align: "center" },
  ],
  [
    { id: 'sub-15', label: 'Sub 15', align: "center" },
    { id: 'sub-16', label: 'Sub 16', align: "center" },
    { id: 'sub-17', label: 'Sub 17', align: "center" },
    { id: 'sub-18', label: 'Sub 18', align: "center" },
    { id: 'sub-19', label: 'Sub 19', align: "center" },
    { id: 'absoluta', label: 'Absoluta', align: "center" },
  ]
]

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

function Row(props) {
  const { row, closeAll, setCloseAll, handleSelectAdmin, setBackdrop, iconDelete } = props;
  const { data: session, status } = useSession()

  /** Control bar collapse */
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (closeAll) {
      setOpen(false)
      setCloseAll(false)
    }
  }, [closeAll])

  /** Control Alert Dialog */
  const [openAlert, setOpenAlert] = useState(false);
  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const deleteAccount = () => {
    setBackdrop(true)    
    try {
      session?.user &&
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/account/${row._id}`,
        method: "delete",
        withCredentials: true,
      })
      setOpenAlert(false) 
    }
    catch (error) {
      console.error(error)
    }
  }  

  return (
    <Fragment>
      <AlertDialog
        open={openAlert}
        setOpen={() => setOpenAlert(!openAlert)}
        title={"¿Eliminar esta cuenta?"}
        text={"Una vez aceptado no puede deshacerse."}
        handleAccept={deleteAccount}
      />
      <StyledTableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <StyledTableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </StyledTableCell>
        <StyledTableCell 
          component="th" 
          scope="row"
          onClick={() => handleSelectAdmin(row._id) }
          sx={{ '&:hover': { cursor: 'pointer' } }}
        >
          {`${row.primer_nombre ? row.primer_nombre : ''} ${row.segundo_nombre ? row.segundo_nombre : ''}`}
        </StyledTableCell>
        <StyledTableCell align="center">{row.email}</StyledTableCell>
        <StyledTableCell align="center">{row.telefono}</StyledTableCell>
        {
          iconDelete && <StyledTableCell 
            component="th" 
            scope="row"
          >
            <Tooltip title="Delete">
              <IconButton
                aria-label="expand row"
                size="small"
                sx={{ '&:hover': { cursor: 'pointer' } }}
                onClick={handleClickOpenAlert}
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
          </StyledTableCell>
        }        
      </StyledTableRow>
      <StyledInnerTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Permisos
              </Typography>
              {headCellsPermissions.map( (array, index) => (
                <Table size="small" aria-label="purchases" key={index} >
                  <TableHead>
                    <TableRow>
                      <TableCell key='category' align='center'></TableCell>
                        {
                          array.map(cell => (
                            <TableCell key={cell.id} align={cell.align}>{cell.label}</TableCell>
                          ))
                        }
                      </TableRow>                
                    </TableHead>
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" >Lectura</TableCell>
                      {array.map((obj, index) => (
                        <TableCell key={index} align="center">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                          >
                            {row.permissions.read.includes(obj.label) ? <CheckIcon /> : <CloseIcon />}
                          </IconButton>
                        </TableCell>
                      ))}
                    </TableRow>
                    <TableRow>
                      <TableCell align="center" >Escritura</TableCell>
                      {array.map((obj, index) => (
                        <TableCell key={index} align="center">
                          <IconButton
                            aria-label="expand row"
                            size="small"
                          >
                            {row.permissions.write.includes(obj.label) ? <CheckIcon /> : <CloseIcon />}
                          </IconButton>
                        </TableCell>
                      ))}
                    </TableRow>                
                  </TableBody>
                </Table>
              ))}
            </Box>
          </Collapse>
        </TableCell>
      </StyledInnerTableRow>
    </Fragment>
  );
}

export default function TableSort(props) {

  let { listUsers, headCells, selectCells, handleSelectAdmin, setBackdrop } = props
	const [records, setRecords] = useState([])
  const [closeAll, setCloseAll] = useState(false)
    
  /** Filters */
  const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [selectFn, setSelectFn] = useState({ fn: items => { return items; } })
	const handleSearch = e => {
		let target = e.target;
		setFilterFn({
			fn: items => {
				if (target.value == "")
					return items;
				else
					return items.filter(x => 
            x?.primer_nombre?.toLowerCase().includes(target.value.toLowerCase()) ||
            x?.primer_apellido?.toLowerCase().includes(target.value.toLowerCase())
          )
			}
		})
	}

  const handleSelect = e => {
		let target = e.target;
		setSelectFn({
			fn: items => {
				if (target.value == "All")
					return items;
				else
					return items.filter(x => x?.category?.toLowerCase().includes(target.value.toLowerCase()))
			}
		})
	}

  /** Init */
  const {
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  } = useTable(records, headCells, filterFn, selectFn, setCloseAll);
  
  useEffect( ()=> {
    const arrayList = Object.values(listUsers);
    setRecords(arrayList)
  }, [listUsers])

	return (
		<>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="flex-start"
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        spacing={2}
        sx={{p:"15px"}}
      >
					<InputSearch
						label="Search"
						onChange={handleSearch}
					/>
        </Stack>
				<Table aria-label="collapsible table">
					<TblHead />
					<TableBody>
						{
              recordsAfterPagingAndSorting().length < 1 ? (
                <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                  <TableCell align="center" colSpan={headCells.length}>
                    {'no results found'}
                  </TableCell>
                </TableRow>
              ) : (
                recordsAfterPagingAndSorting().map((item, index) => (
                  <Row 
                    key={index} 
                    row={item}
                    closeAll={closeAll}  
                    setCloseAll={setCloseAll}
                    handleSelectAdmin={handleSelectAdmin}
                    setBackdrop={setBackdrop}
                    iconDelete={headCells.filter((item) => item.id == 'delete').length > 0}
                  />
                ))
              )
						}
					</TableBody>
        </Table>
				<TblPagination />
		</>
	)
}