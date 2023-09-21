import PropTypes from 'prop-types';

import AppBar from '@mui/material/AppBar';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';
import { Fragment, useState } from 'react';
import LoaderComponent from './LoaderComponent';
import LayoutContent from './LayoutContent';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const lightColor = 'rgba(255, 255, 255, 0.7)';

export default function AppBarFunctionalV1({
  valueMenu, 
  handleValueMenu,
  moduleTabs,
}) {

  const [open, setOpen] = useState(true);
  
  const handleChange = (event, newValue) => {
    handleValueMenu(newValue);
  };
  
  return (
    <Fragment>
      <AppBar component="div" position="sticky" elevation={0} sx={{ zIndex: 2 }}>
        <Tabs value={valueMenu} textColor="inherit" onChange={handleChange}>
          {moduleTabs.map((obj, index) => (
            <Tab label={obj.title} {...a11yProps(index)} key={index} />
          ))}
        </Tabs>
      </AppBar>
      {moduleTabs.map((obj, index) =>( 
        <TabPanel value={valueMenu} index={index} key={index} >
          <LayoutContent content={obj.component}/>
        </TabPanel>
      ))}
    </Fragment>
  );
}