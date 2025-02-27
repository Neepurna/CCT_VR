import { Box, Button, Typography, Container } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import { BitcoinModel } from './BitcoinModel';

const WelcomePage = () => {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        height: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        background: 'linear-gradient(45deg, #000000 30%, #404040 90%)',
        position: 'fixed',
        top: 0,
        left: 0,
        overflow: 'hidden'
      }}
    >
      <Box
        sx={{
          width: '100%',
          height: '300px',
          position: 'relative',
          mb: 4,
          marginTop: '-15vh'    
        }}
      >
        <Canvas>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} />
          <PerspectiveCamera makeDefault position={[0, 0, 6]} />
          <BitcoinModel />
        </Canvas>
      </Box>
      <Container 
        maxWidth="sm" 
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            textAlign: 'center',
            mb: 4,
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Welcome to  <br/> Crypto Coin Tracker
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: 'white',
            textAlign: 'center',
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Track your favorite cryptocurrencies in real-time
        </Typography>
        <Box
          sx={{
            display: 'flex',
            gap: 3,
            justifyContent: 'center',
            width: '100%'
          }}
        >
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/dashboard')}
            sx={{
              backgroundColor: 'white',
              color: '#000000',
              padding: '12px 24px',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Dashboard
          </Button>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/gameplay')}
            sx={{
              backgroundColor: 'white',
              color: '#000000',
              padding: '12px 24px',
              fontSize: '1.1rem',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.9)',
              },
            }}
          >
            Immersive Board
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomePage;