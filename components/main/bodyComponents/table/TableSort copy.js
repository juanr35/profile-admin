import { Fragment, useState, useEffect, forwardRef } from "react";

import Box from '@mui/material/Box';
import Collapse from '@mui/material/Collapse';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled } from '@mui/material/styles';

import IconButton from '@mui/material/IconButton';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import CloseIcon from '@mui/icons-material/Close';
import CheckIcon from '@mui/icons-material/Check';

import useTable from "./components/useTable";
import SelectCategory from './components/SelectCategory'
import InputSearch from './components/InputSearch';

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
  const { row, closeAll, setCloseAll } = props;
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (closeAll) {
      setOpen(false)
      setCloseAll(false)
    }
  }, [closeAll])

  return (
    <Fragment>
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
          onClick={()=>console.log(`click in row ${row.name}`)}
          sx={{ '&:hover': { cursor: 'pointer' } }}
        >
          {row.firstName}
        </StyledTableCell>
        <StyledTableCell align="right">{row.email}</StyledTableCell>
        <StyledTableCell align="right">{row.mobile}</StyledTableCell>
        <StyledTableCell align="right">{row.department}</StyledTableCell>
      </StyledTableRow>
      <StyledInnerTableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                Permissions
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Category</TableCell>
                    <TableCell align="right">Read</TableCell>
                    <TableCell align="right">Write</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {row.permissions.map((historyRow) => (
                    <TableRow key={historyRow.category}>
                      <TableCell align="right" component="th" scope="row">{historyRow.category}</TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                        >
                          {historyRow.read ? <CheckIcon /> : <CloseIcon />}
                        </IconButton>
                      </TableCell>
                      <TableCell align="right">
                        <IconButton
                          aria-label="expand row"
                          size="small"
                        >
                          {historyRow.write ? <CheckIcon /> : <CloseIcon />}
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </StyledInnerTableRow>
    </Fragment>
  );
}

export default function TableSort(props) {

  let { listUsers, headCells, selectCells, setAccount, setBackdrop } = props

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
  
	const handleSearch = e => {
		let target = e.target;
		setFilterFn({
			fn: items => {
				if (target.value == "")
					return items;
				else
					return items.filter(x => x.fullName.toLowerCase().includes(target.value.toLowerCase()))
			}
		})
	}

  const handleSelect = e => {
		let target = e.target;
		setSelectFn({
			fn: items => {
				if (target.value == "all")
					return items;
				else
					return items.filter(x => x.purchaseMethod.toLowerCase().includes(target.value.toLowerCase()))
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
						label="Search"
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