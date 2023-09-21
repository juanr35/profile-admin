import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';

const maxWidth = 345
const maxHeight = 190

export default function CardLoader(props) {

  const { title } = props;

  return (
    <Card sx={{ maxWidth: maxWidth }}>    
      <CardHeader
        title={title}
      />
      <Stack spacing={1}>
        <Skeleton variant="text" width={maxWidth} />
        <Skeleton variant="rectangular" width={maxWidth} height={maxHeight} />
      </Stack>
    </Card>
  );
}