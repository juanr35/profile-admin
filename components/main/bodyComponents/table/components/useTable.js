import * as React from 'react';
import { Fragment, useState, useEffect, forwardRef } from "react";

import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableSortLabel, { tableSortLabelClasses } from '@mui/material/TableSortLabel';
import TablePagination from '@mui/material/TablePagination';
import { styled } from '@mui/material/styles';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableSortLabel = styled(TableSortLabel)(({ theme }) => ({
  [`&.${tableSortLabelClasses.root}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
    fontSize: 14,
  },
}));

export default function useTable(records, headCells, filterFn, selectFn, setCloseAll) {

  const pages = [5, 10, 25]
  const [page, setPage] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(pages[page])
  const [order, setOrder] = useState()
  const [orderBy, setOrderBy] = useState()

  const TblHead = props => {

    const handleSortRequest = cellId => {
        const isAsc = orderBy === cellId && order === "asc";
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(cellId)
    }

    return (
      <TableHead>
        <TableRow>
          {
            headCells.map(headCell => (
              <StyledTableCell 
                  key={headCell.id}
                  sortDirection={orderBy === headCell.id ? order : false}
                  align={ headCell.align ? headCell.align : "none" }
              >
                {
                  headCell.disableSorting ? headCell.label :
                    <StyledTableSortLabel
                        active={orderBy === headCell.id}
                        direction={orderBy === headCell.id ? order : 'asc'}
                        onClick={() => { handleSortRequest(headCell.id) }}>
                        {headCell.label}
                    </StyledTableSortLabel>
                }
              </StyledTableCell>
            ))
          }
        </TableRow>
      </TableHead>
    )
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setCloseAll(true);
  }

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10))
    setPage(0);
  }

  const TblPagination = () => (
    records.length > 0 ? (
      <TablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={filterFn.fn(selectFn.fn(records)).length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    ) : null
  )

  function stableSort(array = [], comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === 'desc'
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const recordsAfterPagingAndSorting = () => {
    return stableSort(filterFn.fn(selectFn.fn(records)), getComparator(order, orderBy))
      .slice(page * rowsPerPage, (page + 1) * rowsPerPage)
  }

  return {
    TblHead,
    TblPagination,
    recordsAfterPagingAndSorting
  }
}
