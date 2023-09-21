import { Paper, Card, Typography, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function PageHeader(props) {
  
  const theme = useTheme()
  const styles = {
    root: {
      backgroundColor: '#fdfdff'
    },
    pageHeader:{
      padding:theme.spacing(3),
      display:'flex',
      marginBottom:theme.spacing(1)
    },
    pageIcon:{
      display:'inline-block',
      padding:theme.spacing(2),
      color:'#3c44b1'
    },
    pageTitle:{
      paddingLeft:theme.spacing(4),
      '& .MuiTypography-subtitle2':{
        opacity:'0.6'
      }
    }
  }

  const { title, subTitle, icon } = props;
  return (
    <Paper 
      elevation={0} 
      square 
      sx={styles.root}
    >
      <Box sx={styles.pageHeader}>
        <Card sx={styles.pageIcon}>
          {icon}
        </Card>
        <Box sx={styles.pageTitle}>
          <Typography
            variant="h6"
            component="div">
            {title}
          </Typography>
          <Typography
            variant="subtitle2"
            component="div">
            {subTitle}
          </Typography>
        </Box>
      </Box>
    </Paper>
  )
}
