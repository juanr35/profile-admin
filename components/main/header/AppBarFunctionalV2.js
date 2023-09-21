import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import { Fragment, useState } from 'react';

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function AppBarFunctionalV2({ 
    onDrawerToggle,
    avatarComponent
  }) {

  return (
      <AppBar color="primary" position="static" elevation={0} style={{ padding: 15 }} >
        <Toolbar          
          sx={{
            justifyContent: { sm: "flex-start", xs: "space-between" }
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={onDrawerToggle}
            edge="start"
            sx={{ display: { sm: 'none', xs: 'block' } }}
          >
            <MenuIcon />
          </IconButton>

          <Typography 
            color="inherit" 
            variant="h5" 
            component="h1"
            sx={{ 
              flexGrow: {
                sm: 1
              }     
            }}
          >
            <FingerprintIcon sx={{ fontSize: 60 }} />
          </Typography>
          {avatarComponent}          
        </Toolbar>
      </AppBar> 
  );
}

 
AppBarFunctionalV2.propTypes = {
  onDrawerToggle: PropTypes.func.isRequired,
  avatarComponent: PropTypes.node.isRequired
}

AppBarFunctionalV2.defaultProps = {
  onDrawerToggle: () => console.log("click Drawer"),
}
