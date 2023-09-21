import { Fragment, useState, useEffect, forwardRef } from "react";
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import axios from 'axios';

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
import Switch from '@mui/material/Switch'

export default function PanelPermissions(props) {
  
  const { data: session, status } = useSession()
  let { categories, account } = props
  
  const [permissions, setPermissions] = useState({
    read: [],
    write: []
  })
  const [lastClick, setLastClick] = useState(null)

  useEffect(() => {
    let obj = {}
    new Array('read', 'write').forEach((option) => {
      let subObj = {}
      categories.forEach((item) => {
        subObj[item] = account.permissions[option].includes(item)
      })
      obj[option] = subObj
    })

    setPermissions(obj)
  }, [account])

  useEffect(()=>{
    if( lastClick ) {
      console.log("entro")
      handleSubmit()
      setLastClick(null)
    }  
  }, [lastClick])

  const getArrayPermissions = () => {
    return {
      permissions: {
        read: Object.entries(permissions.read).filter(item => item[1]).map(item => item[0]),
        write: Object.entries(permissions.write).filter(item => item[1]).map(item => item[0])
      }
    }
  };

  const handleChange = (option, category) => (e) => {
    e.preventDefault()
    setPermissions({
      ...permissions,
      [option]: {
        ...permissions[option],
        [category]: !permissions[option][category] 
      } 
    })
    setLastClick({
      option,
      category
    })
  };
  
  const handleSubmit = async () => {
    try {
      axios({
        url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${session.user._id}/account/${account._id}`,
        method: "put",
        data: getArrayPermissions(),
        params: { 
          ...lastClick,
          onlyPermission: true
        },
        withCredentials: true,
      })
    } 
    catch (error) {
      console.error(error)
    }
  }

	return (
		<>  
			<Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            <TableCell align="left">Categoria</TableCell>
            <TableCell align="right">Lectura</TableCell>
            <TableCell align="right">Escritura</TableCell>            
          </TableRow>
        </TableHead>
        <TableBody>
          {categories.map((category) => (
            <>
              <TableRow >
                <TableCell align="left">{category}</TableCell>
                <TableCell align="right">
                  <Switch
                    checked={permissions.read[category]}
                    onClick={handleChange('read', category)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </TableCell>
                <TableCell align="right">
                  <Switch
                    checked={permissions.write[category]}
                    onClick={handleChange('write', category)}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </TableCell>
              </TableRow>
            </>
          ))}
        </TableBody>
      </Table>
		</>
	)
}