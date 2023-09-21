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

function Row(props) {
  const { row, closeAll, setCloseAll, handleSelectUser, setBackdrop, iconDelete } = props;
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
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/user/${row._id}`,
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
        title={"¿Eliminar cuenta?"}
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
          onClick={() => handleSelectUser(row._id) }
          sx={{ '&:hover': { cursor: 'pointer' } }}
        >
          {`${row.primer_nombre ? row.primer_nombre : ''} ${row.segundo_nombre ? row.segundo_nombre : ''}`}
        </StyledTableCell>
        <StyledTableCell align="right">{row.email}</StyledTableCell>
        <StyledTableCell align="right">{row.telefono}</StyledTableCell>
        <StyledTableCell align="right">{row.category}</StyledTableCell>
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
              {
                row?.parentsId?.length > 0 ? (
                  <Typography gutterBottom component="div">
                    Padres Registrados: {row?.parentsId.length} 
                  </Typography>
                ) : (
                  <Typography gutterBottom component="div">
                    Sin Padres Registrados
                  </Typography>
                )
              }
              {
                row?.medicalHistoryId && 
                Object.values(row?.medicalHistoryId).filter(item => item?.checked).length > 0 ? (
                  <Typography gutterBottom component="div">
                    Antecedentes Medicos: {Object.values(row?.medicalHistoryId).filter(item => item?.checked).length}
                  </Typography>
                ) : (
                  <Typography gutterBottom component="div">
                    Sin Antecedentes Medicos
                  </Typography>
                )
              }
            </Box>
          </Collapse>
        </TableCell>
      </StyledInnerTableRow>
    </Fragment>
  );
}

export default function TableSort(props) {

  let { listUsers, headCells, selectCells, handleSelectUser, setBackdrop } = props

	const [records, setRecords] = useState([])
	const [filterFn, setFilterFn] = useState({ fn: items => { return items; } })
  const [selectFn, setSelectFn] = useState({ fn: items => { return items; } })
  const [closeAll, setCloseAll] = useState(false)

  useEffect( ()=> {
    const arrayList = Object.values(listUsers);
    setRecords(arrayList)
  }, [listUsers])
  
	const {
		TblHead,
		TblPagination,
		recordsAfterPagingAndSorting
	} = useTable(records, headCells, filterFn, selectFn, setCloseAll);
  const _recordsAfterPagingAndSorting = recordsAfterPagingAndSorting().filter( x => {
    for (const item in selectCells) {
      if (x?.category?.toLowerCase().includes(selectCells[item].toLowerCase())) {
        return true
      }
    }
    return false
  })

	const handleSearch = e => {
		let target = e.target;
		setFilterFn({
			fn: items => {
				if (target.value == "")
					return items;
				else
					return items.filter(x => 
            x?.primer_nombre?.toLowerCase().includes(target.value.toLowerCase()) ||
            x?.segundo_nombre?.toLowerCase().includes(target.value.toLowerCase())
          )
			}
		})
	}

  const handleSelect = e => {
		let target = e.target;
		setSelectFn({
			fn: items => {
				if (target.value == "Todos")
					return items;
				else
					return items.filter(x => x?.category?.toLowerCase().includes(target.value.toLowerCase()))
			}
		})
	}
  
	return (
		<>
      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems={{ xs: 'center', sm: 'flex-start' }}
        spacing={2}
        sx={{p:"15px"}}
      >
        <InputSearch
          label="Buscar"
          onChange={handleSearch}
        />
        <SelectCategory 
          selectCells={selectCells} 
          onChange={handleSelect}
        />
      </Stack>
      <Table aria-label="collapsible table">
        <TblHead />
        <TableBody>
          {
            _recordsAfterPagingAndSorting.length < 1 ? (
              <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
                <TableCell align="center" colSpan={headCells.length}>
                  {'sin resultados'}
                </TableCell>
              </TableRow>
            ) : (
              _recordsAfterPagingAndSorting.map((item, index) => (
                <Row 
                  key={index} 
                  row={item}
                  closeAll={closeAll}  
                  setCloseAll={setCloseAll}
                  handleSelectUser={handleSelectUser}
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