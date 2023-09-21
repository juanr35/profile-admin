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
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocalHospitalIcon from '@mui/icons-material/LocalHospital';

/** Body */
import AppBarFunctionalV1 from '../components/main/AppBarFunctionalV1';
import PermissionsCollapse from '../components/main/PermissionsCollapse';
//import DataFormWithHeader  from '../components/main/bodyComponents/dataForm/DataFormWithHeader';
import Profile from '../components/main/bodyComponents/profile/Profile';
import DataAndImageWithHeader from '../components/main/bodyComponents/dataAndImage/DataAndImageWithHeader'
import TableSortWithHeader from '../components/main/bodyComponents/table/TableSortWithHeader'
import TableSortWithPaper from '../components/main/bodyComponents/table/TableSortWithPaper'
import TableSort from '../components/main/bodyComponents/table/TableSort'
import TableSortAdmin from '../components/main/bodyComponents/table/TableSortAdmin'
import PanelPermissions from '../components/main/bodyComponents/panelPermissions/PanelPermissions'
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
    
    if ( !account.superAdmin ) {
      return {
        redirect: {
          permanent: false,
          destination: `${process.env.NEXT_PUBLIC_ADMIN_AUTH_DOMAIN}/profile`,
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

/** Menu and options table */
const headCellsUsers = [
  { id: 'extra', label: '' },
  { id: 'fullName', label: 'Nombre' },
  { id: 'email', label: 'Email', align: "right" },
  { id: 'mobile', label: 'Telefono', align: "right" },
  { id: 'category', label: 'Categoria', align: "right" },
  { id: 'delete', label: '', align: "right" },
]

const headCellsAdmins = [
  { id: 'extra', label: '' },
  { id: 'fullName', label: 'Nombre' },
  { id: 'email', label: 'Email', align: "center" },
  { id: 'mobile', label: 'Telefono', align: "center" },
  { id: 'delete', label: '', align: "right" },
]

const categories = [
  'Sub 7', 'Sub 8', 'Sub 9',
  'Sub 10', 'Sub 11', 'Sub 12',
  'Sub 13', 'Sub 14', 'Sub 15', 
  'Sub 16', 'Sub 17', 'Sub 18',
  'Sub 19', 'Absoluta'
]

async function fetchData(id) {
  axios({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${id}/get-users`,
    method: "GET",
    withCredentials: true,
    params: { socketId: socket.id }
  })

  axios({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${id}/get-admins`,
    method: "GET",
    withCredentials: true,
    params: { socketId: socket.id }
  })
  /*
  axios({
    url: `${process.env.NEXT_PUBLIC_BACKEND_URL}/api-admin/${id}/get-list-example`,
    method: "GET",
    withCredentials: true,
    params: { socketId: socket.id }
  })
  */
}

function HomePage({ props }) {
  
  const [listData, setListData] = useState({
    users:{},
    admins: {},
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
  const [adminSelect, setAdminSelect] = useState('')
  const handleOptionAvatar = (newValue) => (e) => {
    setTabOption(newValue);
  };
  const handleSelectUser = (id) => {
    setUserSelect(id)
    setTabOption(tabsBasic.length);
  };
  const handleSelectAdmin = (id) => {
    setAdminSelect(id)
    setTabOption(tabsBasic.length);
  };

  /** Control backdrop and alert */
  const [backdrop, setBackdrop] = useState(false);
  const { enqueueSnackbar } = useSnackbar();

  /** Socket implementation */
  useEffect( async () => {  
    if(!socket){
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
        setAccount((prev) => ({
          ...prev,
          ...data
        }))
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
        setAdminSelect((prev) => {
          if (prev == id) {
            setTabOption(0)
            setAdminSelect('')
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
    if( tabOption < tabsBasic.length ) {
      setUserSelect('')
      setAdminSelect('')
    }
  }, [tabOption])
  
  const tabsBasic = [
    {
      component:
        <>
          <TableSortWithPaper>
            <TableSort
              listUsers={listData.users}
              headCells={headCellsUsers}
              selectCells={account.permissions.read}
              handleSelectUser={handleSelectUser}
              setBackdrop={setBackdrop}
            />
          </TableSortWithPaper>
        </>,
      title: "Lista de usuarios",
      icon: <ListAltIcon />,        },
    {
      component:
        <>
          <TableSortWithPaper>
            <TableSortAdmin
              listUsers={listData.admins}
              headCells={headCellsAdmins}
              selectCells={account.permissions.read}
              handleSelectAdmin={handleSelectAdmin}
              setBackdrop={setBackdrop}
            />
          </TableSortWithPaper>
        </>,
      title: "Lista administradores",
      icon: <ListAltIcon />,        },
  ]

  const tabsUsers = [
    ...tabsBasic,
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

  const tabsAdmins = [
    ...tabsBasic,
    {
      component:
        <DataAndImageWithHeader
          account={listData?.admins[adminSelect]}
          setBackdrop={setBackdrop}
          idAccount={adminSelect}
        />, 
      title: "Datos Admin",
      icon: <PersonIcon fontSize="small" />,
    },
    {
      component:
        <>
          <TableSortWithPaper>
            <PanelPermissions
              categories={categories}
              account={listData?.admins[adminSelect]}
            />
          </TableSortWithPaper>
        </>,
      title: "Permisos",
      icon: <AdminPanelSettingsIcon fontSize="small" />,
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
                  menuOptions={tabsBasic}
                  logoutFunc={() => signOut()}
                /> 
              }
            />
          {/** Body */}
            <AppBarFunctionalV1 
              valueMenu={tabOption}
              handleValueMenu={setTabOption}
              moduleTabs={userSelect ? tabsUsers : adminSelect ? tabsAdmins : tabsBasic}
            />
        </Box>
      </Box>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={backdrop}
        onClick={()=> {
          }  }
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