import React from 'react';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { KeyboardArrowDown } from '@mui/icons-material';
import JotifyLogo from '../../../imgs/jotify_transparent.png';
import { motion } from 'framer-motion';

const MainHeader = ({ setToken }) => {
  const mid = useMediaQuery('(max-width: 1100px)');
  const smallForHeader = useMediaQuery('(max-width: 750px)');
  const small = useMediaQuery('(max-width: 700px)');
  const navigate = useNavigate();

  const [smallHeaderVisible, setSmallHeaderVisible] = React.useState(false);

  // handler
  const handleLogout = () => {
    setToken('');
    navigate('/');
  };

  const toggleSmallHeader = (state) => {
    setSmallHeaderVisible(state);
  };
  // Styling
  const mainHeaderStyling = {
    padding: `0.5rem ${small ? '1.5rem' : mid ? '2rem' : '5rem'}`,
  };
  const mainHeaderSmallStyling = {
    ...mainHeaderStyling,
    backgroundColor: 'rgb(206, 73, 0)',
  };
  return (
    <div>
      {smallForHeader ? (
        <div style={{ position: 'relative', zIndex: '1' }}>
          <Button
            variant='jotify-header-drawer'
            sx={{
              position: 'absolute',
              top: '95%',
              left: '43%',
              zIndex: '100',
            }}
            onClick={() => toggleSmallHeader(!smallHeaderVisible)}
          >
            <KeyboardArrowDown />
          </Button>
          <SwipeableDrawer
            anchor='top'
            open={smallHeaderVisible}
            onClose={() => toggleSmallHeader(false)}
            onOpen={() => toggleSmallHeader(true)}
          >
            <Grid container direction={'row'} sx={mainHeaderSmallStyling}>
              <Grid item xs={8}>
                <motion.img
                  style={{ height: small ? '2.5rem' : '5rem' }}
                  src={JotifyLogo}
                  alt='Jotify logo'
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                />
              </Grid>

              <Grid item xs={4}>
                <Box
                  component={motion.div}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 1.5 }}
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    width: '100%',
                    justifyContent: small ? 'end' : 'end',
                  }}
                >
                  <Button
                    onClick={() => handleLogout()}
                    variant='jotify-header-button'
                  >
                    Logout
                  </Button>
                </Box>
              </Grid>
            </Grid>{' '}
          </SwipeableDrawer>
        </div>
      ) : (
        <>
          <Grid container direction={'row'} sx={mainHeaderStyling}>
            <Grid item xs={8}>
              <motion.img
                style={{ height: small ? '2.5rem' : '5rem' }}
                src={JotifyLogo}
                alt='Jotify logo'
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1 }}
              />
            </Grid>

            <Grid item xs={4}>
              <Box
                component={motion.div}
                animate={{ opacity: 1 }}
                initial={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  width: '100%',
                  justifyContent: small ? 'end' : 'end',
                }}
              >
                <Button onClick={() => handleLogout()} variant='transparent'>
                  Logout
                </Button>
              </Box>
            </Grid>
          </Grid>
        </>
      )}
    </div>
  );
};

export default MainHeader;
