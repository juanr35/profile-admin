import PropTypes from 'prop-types';
import CircularProgress, { circularProgressClasses, } from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';


export default function LoaderComponent() {

	return (

    <Grid
      container
      spacing={0}
      direction="column"
      alignItems="center"
      justifyContent="center"
      style={{ minHeight: '60vh' }}
    >

      <Grid item xs={3}>
        <CircularProgress
            variant="indeterminate"
            
            sx={{
              animationDuration: '1750ms',
              left: 0,
              [`& .${circularProgressClasses.circle}`]: {
                strokeLinecap: 'round',
              },
            }}
            size={70}
            thickness={2}
        />    
      </Grid>    
    </Grid> 
	);
}



/*
AppBarFunctionalV1.propTypes = {
	profileChild: PropTypes.node.isRequired,
	fillChild: PropTypes.node.isRequired,
	uploadChild: PropTypes.node.isRequired,
	editChild: PropTypes.node.isRequired
}

AppBarFunctionalV1.defaultProps = {
	profileChild: "profile",
	fillChild: "fill",
	uploadChild: "upload",
	editChild: "edit"
}
*/