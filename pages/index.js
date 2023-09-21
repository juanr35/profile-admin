import { Fragment, useState, useEffect, forwardRef } from "react";
import { useRouter } from 'next/router';

/** Socket.IO */
import io from 'socket.io-client'

/** Material UI */
import { createTheme, ThemeProvider } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';
import theme from '../src-material-ui/themeHomePage';
import { SnackbarProvider, useSnackbar } from 'notistack';

/** Next-Auth */
import { getProviders, signIn, signOut, useSession, getSession } from 'next-auth/react'
import { getCsrfToken } from "next-auth/react"

/** Header */
import Navigator from '../components/main/Navigator';
import AvatarFunctionalV1 from '../components/main/header/AvatarFunctionalV1';
import AppBarFunctionalV2 from '../components/main/header/AppBarFunctionalV2';
import LoaderComponent from '../components/main/LoaderComponent';
import Avatar from '@mui/material/Avatar';
import Feed from '@mui/icons-material/Feed';
import UploadFile from '@mui/icons-material/UploadFile'
import Edit from '@mui/icons-material/Edit';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';

/** Body */
import AppBarFunctionalV1 from '../components/main/AppBarFunctionalV1';
import PermissionsCollapse from '../components/main/PermissionsCollapse';
import Profile from '../components/main/bodyComponents/profile/Profile';
import DataAndImageWithHeader from '../components/main/bodyComponents/dataAndImage/DataAndImageWithHeader'
import TableSortWithHeader from '../components/main/bodyComponents/table/TableSortWithHeader'
import TableSortWithPaper from '../components/main/bodyComponents/table/TableSortWithPaper'
import TableSortPrueba from '../components/main/bodyComponents/table/TableSortPrueba'
import TableSort from '../components/main/bodyComponents/table/TableSort'
import AccordionPanelWith from '../components/main/bodyComponents/accordionPanel/AccordionPanelWithHeader'
import DataFormUser from '../components/main/bodyComponents/dataFormUser/DataAndImageWithHeader'
import ParentData from '../components/main/bodyComponents/parentData/DataAndImage'

/** Utils */
import { getAccountData } from '../lib/utils';
import axios from 'axios'

let socket = false;

// This is the recommended way for Next.js 9.3 or newer
export async function getServerSideProps(context) {
  let session = await getSession(context)
  
  if (!session) {
    console.log("User not logged in")
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/auth/signin`,
      }
    };
  }

  if (!session.user.verified) {
    console.log("User not verified")

    return {
      redirect: {
        permanent: false,
        destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/auth/verify/${session.user._id}`,
      }
    };
  }

  try {   
    let account = await getAccountData( session.user._id)
    
    if ( !account ) {
      console.log("The account for the session don't exist")
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/auth/redirect-sign`,
        }
      };
    }    
    else if ( account.superAdmin ) {
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/profile/main`,
        }
      };        
    }
    else {
      return {
        props: {
          account
        },
      }  
    }
  }
  catch (error) {
    console.log(error)
    return {
      redirect: {
        permanent: false,
        destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/profile/error`,
      }
    };
  }
}
const drawerWidth = 256;

/** Menuu options prueba */
const headCellsPrueba = [
  { id: 'extra', label: '' },
  { id: 'storeLocation', label: 'Location' },
  { id: 'items', label: 'Items', align: "right", disableSorting: true },
  { id: 'purchaseMethod', label: 'Purchase Method', align: "right" },
  { id: 'couponUsed', label: 'Coupon Used', disableSorting: true, align: "right" },
]

const selectCellsPrueba = [
  { id: 'in store', label: 'In Store'},
  { id: 'online', label: 'Online' },
  { id: 'phone', label: 'Phone' },
]

/** Menu and options table */
const headCells = [
  { id: 'extra', label: '' },
  { id: 'fullName', label: 'Name' },
  { id: 'email', label: 'Email Address', align: "right" },
  { id: 'mobile', label: 'Mobile', align: "right" },
  { id: 'category', label: 'Category', align: "right" },
]

async function fetchData(id) {
  axios({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${id}/get-users`,
    method: "GET",
    withCredentials: true,
    params: { socketId: socket.id }
  })
}

async function fetchDataWithOutId() {
  let { user: { _id } } = await getSession()

  axios({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${_id}/get-users`,
    method: "GET",
    withCredentials: true,
    params: { socketId: socket.id }
  })
}

function HomePage({ props }) {
  const { query, push } = useRouter();
  const [listData, setListData] = useState({
    users:{},
    listExample:{},
  })
  const [account, setAccount] = useState(props.account)
  /** For sockets use */
  const [isConnected, setIsConnected] = useState(false);
  /** For navigator bar responive */
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

  /** Control tabs options */
  const [tabOption, setTabOption] = useState(0)
  const [userSelect, setUserSelect] = useState('')
  const handleOptionAvatar = (newValue) => (e) => {
    setTabOption(newValue);
  };
  const handleSelectUser = (id) => {
    setUserSelect(id)
    setTabOption(tabsAdmin.length);
  };

  /** Control backdrop and alert */
  const [backdrop, setBackdrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  /** Socket implementation */
  useEffect( async () => {  
    if ( !socket ) {
      let { user: { accountId } } = await getSession()
      socket = io( process.env.NEXT_PUBLIC_BACKEND_URL_RAW, { 
        withCredentials: true,
        autoConnect: false,
        query: { 
          id: accountId,
          cookies: document.cookie
        },
      });
      socket.connect();

      socket.onAny((event, ...args) => {
        console.log(event, args);
      });
    
      socket.on('connect', () => {    
        setIsConnected(true);
      });
    
      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on("connect_error", (err) => {
        console.log(err.message);
      });
        
      socket.on("alert_snackbar", ({ text, variant }) => {
        enqueueSnackbar(text, { variant });
      })

      socket.on("alert_backdrop", (msg) => {
        setBackdrop(msg)
      })

      socket.on("data_incoming", (data) => {
        setAccount((prev) => {
          if ( JSON.stringify(prev?.permissions?.read) != JSON.stringify(data?.permissions?.read) ) {
            fetchDataWithOutId()
          }
          return {
            ...prev,
            ...data
          }
        })
      })

      socket.on("fail_upload", (group, _id, fieldname) => {
        if ( group == 'account') {
          setAccount({
            ...account,
            [fieldname]: {
              error: 'fail_upload'
            }
          })
        }
        else {
          setListData((list) => {
            return {
              ...list,
              [group]: {
                ...list[group],
                [_id]: {
                  ...list[group][_id],
                  [fieldname]: {
                    error: 'fail_upload'
                  }
                }
              }
            }
          })            
        }
      })

      /** Admin list */
      socket.on("data_list_incoming", (group, data, callback) => {
        if ( Object.keys(data).length > 2 ) {
          delete data.parentsId
        }
        
        const { _id, ...rest } = data        
        setListData((list) => {
          return {
            ...list,
            [group]: {
              ...list[group],
              [_id]: {
                ...list[group][_id],
                ...rest,
                _id
              }
            }
          }
        })
        callback(data);
      });

      /** Delete account of the list */
      socket.on("delete_data_list", (group, id) => {
        setUserSelect((prev) => {
          if (prev == id ) {
            setTabOption(0)
            setUserSelect('')
          }  
          else {
            return prev
          }
        })    
        setListData((list) => {
          const copy = JSON.parse(JSON.stringify(list))    
          delete copy[group][id]

          return copy
        })
      });
      
      /** Close the session if account has been deleted */
      socket.on("account_deleted", () => {    
        push({ href: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/auth/redirect-sign` })
      });

      return () => {
        socket.off('connect');
        socket.off('disconnect');
        socket.off("connect_error");
        socket.off('alert_snackbar');
        socket.off('alert_backdrop');
        socket.off('data_incoming');
        socket.off('fail_upload');
        socket.off('data_list_incoming');
        socket.off('delete_data_list');
        socket.off('account_deleted');
      };
    }
  }, [])

   /** Calls API Data */
   useEffect( async () => {  
    if (isConnected) {
      let { user: { _id } } = await getSession()
      fetchData(_id)
    }
  }, [isConnected])
  
  /** Control tabs */
  useEffect( () => {
    if( tabOption < tabsAdmin.length ) {
      setUserSelect('')
    }
  }, [tabOption])
  
  const tabsAdmin = [
    {
      component: 
      <>
        <DataAndImageWithHeader
          account={account}
          setAccount={setAccount}
          setBackdrop={setBackdrop}
        /> 
      </>,
      title: "Perfil",
      icon: <Avatar />,
    },
    {
      component:
        <>
          <PermissionsCollapse 
            permissions={account.permissions}
          />
          <TableSortWithPaper>
            <TableSort
              listUsers={listData.users}
              headCells={headCells}
              selectCells={account.permissions.read}
              handleSelectUser={handleSelectUser}
            />
          </TableSortWithPaper>
        </>,
      title: "Lista de usuarios",
      icon: <ListAltIcon />,    
    },
  ]

  const tabsUsers = [
    ...tabsAdmin,
    {
      component: 
        <DataFormUser
          account={listData?.users[userSelect]}
          setBackdrop={setBackdrop}
        />, 
      title: "Registro Jugador",
      icon: <Edit fontSize="small" />,
    },
    {
      component: 
        <ParentData
          account={listData?.users[userSelect]}
          setBackdrop={setBackdrop}
        />, 
      title: "Registro Padres",
      icon: <SupervisorAccountIcon fontSize="small" />,
    },
    {
      component:
        <AccordionPanelWith 
          account={{
            ...listData?.users[userSelect]?.medicalHistoryId,
            _id: listData?.users[userSelect]?._id,
            alergias_operaciones: listData?.users[userSelect]?.alergias_operaciones,
            grupo_sanguineo: listData?.users[userSelect]?.grupo_sanguineo
          }}
          setBackdrop={setBackdrop}
        />,
      title: "Historial Clinico",
      icon: <LocalHospitalIcon fontSize="small" />,
    },    
  ]
  
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex', minHeight: '100vh' }}>
        <CssBaseline />
        <Box
          component="nav"
          sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        >
          {
            isSmUp ? null : (
              <Navigator
                PaperProps={{ style: { width: drawerWidth } }}
                variant="temporary"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                openFileFunc={()=>console.log("click")}
                downloadFunc={()=>console.log("click")}
                settingsFunc={()=>console.log("click")}
                logoutFunc={() => signOut()}
              />
            )
          }
          <Navigator
            PaperProps={{ style: { width: drawerWidth } }}
            sx={{ display: { sm: 'block', xs: 'none' } }}
            openFileFunc={()=>console.log("click")}
            downloadFunc={()=>console.log("click")}
            settingsFunc={()=>console.log("click")}
            logoutFunc={() => signOut()}
          />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          {/** Header */}
            <AppBarFunctionalV2 
              onDrawerToggle={handleDrawerToggle}
              avatarComponent={
                <AvatarFunctionalV1 
                  name={account.primer_nombre ? account.primer_nombre : "_"} 
                  clickMenu={handleOptionAvatar}
                  menuOptions={userSelect ? tabsUsers : tabsAdmin}
                  logoutFunc={() => signOut()}
                /> 
              }
            />
          {/** Body */}
            <AppBarFunctionalV1 
              valueMenu={tabOption}
              handleValueMenu={setTabOption}
              moduleTabs={userSelect ? tabsUsers : tabsAdmin}
            />
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
        onClick={()=> {
          
        }}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </ThemeProvider>
  );
}

export default function IntegrationNotistack(props) {
  return (
    <SnackbarProvider maxSnack={3}>
      <HomePage props={props} />
    </SnackbarProvider>
  );
}