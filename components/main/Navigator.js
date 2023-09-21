import PropTypes from 'prop-types';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import HomeIcon from '@mui/icons-material/Home';
import FileOpenIcon from '@mui/icons-material/FileOpen';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';

const item = {
  py: '2px',
  px: 3,
  color: 'rgba(255, 255, 255, 0.7)',
  '&:hover, &:focus': {
    bgcolor: 'rgba(255, 255, 255, 0.08)',
  },
};

const itemCategory = {
  boxShadow: '0 -1px 0 rgb(255,255,255,0.1) inset',
  py: 1.5,
  px: 3,
};

export default function Navigator(props) {
  const { 
    openFileFunc,
    downloadFunc,
    settingsFunc,
    logoutFunc,
    ...other 
  } = props;

  const categories = [
    {
      id: 'Herramientas',
      children: [
        { id: 'Abrir Archivo', icon: <FileOpenIcon />, callFunc: openFileFunc },
        { id: 'Descargar Pdf', icon: <PictureAsPdfIcon />, callFunc: downloadFunc },
      ],
    },
    {
      id: 'Cuenta',
      children: [
        { id: 'Configuracion', icon: <SettingsIcon />, callFunc: settingsFunc },
      ],
    },
  ];

  return (
    <Drawer variant="permanent" {...other}>
      <List disablePadding>
        <ListItem sx={{ ...item, ...itemCategory, fontSize: 22, color: '#fff' }}>
          <ListItemText align="center" >
            Sistema de Registro
          </ListItemText>
        </ListItem>
        {/*
        <ListItem sx={{ ...item, ...itemCategory }}>
          <ListItemIcon>
            <FingerprintIcon fontSize='large' />
          </ListItemIcon>
          <ListItemText>Home Page</ListItemText>
        </ListItem>
        */}
        {categories.map(({ id, children }) => (
          <Box key={id} sx={{ bgcolor: '#101F33' }}>
            <ListItem sx={{ py: 2, px: 3 }}>
              <ListItemText sx={{ color: '#fff' }}>{id}</ListItemText>
            </ListItem>
            {children.map(({ id: childId, icon, callFunc }) => (
              <ListItem disablePadding key={childId}>
                <ListItemButton sx={item} onClick={callFunc} >
                  <ListItemIcon>{icon}</ListItemIcon>
                  <ListItemText>{childId}</ListItemText>
                </ListItemButton>
              </ListItem>
            ))}
            <Divider sx={{ mt: 2 }} />
          </Box>
        ))}
      </List>
    </Drawer>
  );
}

Navigator.propTypes = {
  openFileFunc: PropTypes.func.isRequired,
  downloadFunc: PropTypes.func.isRequired,
  settingsFunc: PropTypes.func.isRequired,
  logoutFunc: PropTypes.func.isRequired,
}

Navigator.defaultProps = {
  openFileFunc: () => console.log("click open file"),
  downloadFunc: () => console.log("click download"),
  settingsFunc: () => console.log("click settings"),
  logoutFunc: () => console.log("click loguot"),
}