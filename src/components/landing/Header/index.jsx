import React from 'react';
import { motion } from 'framer-motion';
import { styled as muistyled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import useMediaQuery from '@mui/material/useMediaQuery';
import JotifyLogo from '../../../imgs/jotify_transparent.png';

// Styles

const HeaderButton = muistyled(Button)(({ theme }) => ({
  width: '110px',
  fontSize: '1rem',
}));

let headerStyle = {
  textAlign: 'center',
  color: 'white',
  width: '100vw',
  alignItems: 'center',
  position: 'absolute',
  top: 0,
  left: 0,
  zIndex: '100',
};

const Header = ({ authButtonScope, setAuthModal, setAuthForm }) => {
  // const large = useMediaQuery('(min-width: 1100px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');

  headerStyle = {
    ...headerStyle,
    display: small ? 'grid' : 'flex',
    gridTemplateRows: small ? '1fr 0fr' : '',
    padding: `0rem ${small ? '1.5rem' : mid ? '2rem' : '5rem'}`,
  };

  const headerVariant = {
    initialHeaderStyle: {
      height: '100vh',
      //   backgroundColor: 'rgba(255, 192, 0, 1)',
      //   backgroundColor: 'rgb(206, 73, 0)''rgba(255, 170, 51, 1)',
      //   backgroundColor: 'rgba(255, 118, 43, 1)',
      backgroundColor: 'rgba(206, 73, 0, 1)',
    },
    finalHeaderStyle: {
      height: small ? '8rem' : 'max-content',
      //   paddingTop: '0.5rem',
      //
      paddingBottom: '0.5rem',
      //   backgroundColor: 'rgba(255, 192, 0, 0.7)',
      //   backgroundColor: 'rgba(255, 170, 51, 0.7)',
      // backgroundColor: 'rgba(255, 118, 43, 0.63)',
      backgroundColor: 'rgba(206, 73, 0, 0.63)',
      //   display: 'grid',
      flexDirection: small ? 'column' : 'row',
      //   columnGap: '30%',
      gridTemplateColumns: small ? '1fr' : '',
      gridTemplateRows: small ? '1fr 1fr' : '',
      justifyContent: small ? 'center' : 'space-between',
      //   alignItems: 'center',
      transition: {
        type: 'tween',
        duration: 1.0,
        // ease: 'easeOut',
        delay: 3,
      },
    },
  };

  const logoVariant = {
    initialLogoStyle: {
      height: small ? '3.8rem' : '5rem',
      x: small ? 'calc(50vw - 63%)' : 'calc(50vw - 70%)',
      //   x: '50vw',
      //   y: '50vh',
    },
    finalLogoStyle: {
      height: small ? '3.8rem' : '5rem',
      x: small ? 'calc(50vw - 63%)' : 0,
      //   y: 0,
      transition: small
        ? { type: 'tween' }
        : {
            type: 'spring',
            duration: 1,
            stiffness: 100,
            delay: 5,
          },
    },
  };

  const headerButtonsGridStyle = {
    display: 'none',
    gridTemplateColumns: '1fr 1fr',
    justifyContent: 'space-between',
    width: small ? '100%' : '40%',
  };

  const loginAuthHandler = () => {
    setAuthModal(true);
    setAuthForm('login');
  };

  const registerAuthHandler = () => {
    setAuthModal(true);
    setAuthForm('register');
  };

  return (
    <motion.header
      style={headerStyle}
      variants={headerVariant}
      initial='initialHeaderStyle'
      animate='finalHeaderStyle'
      id='jotify-header'
    >
      <motion.img
        src={JotifyLogo}
        alt='Jotify logo'
        variants={logoVariant}
        initial='initialLogoStyle'
        animate='finalLogoStyle'
      />
      <Grid
        container
        columnSpacing={{ xs: 0, md: 4 }}
        style={headerButtonsGridStyle}
        ref={authButtonScope}
      >
        <Grid item xs={12}>
          <Box
            display='flex'
            justifyContent={small ? 'flex-start' : 'flex-end'}
            sx={{ width: 'inherit' }}
          >
            <HeaderButton
              variant='jotify-header-button'
              onClick={loginAuthHandler}
              role='button'
            >
              Login
            </HeaderButton>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box display='flex' justifyContent='flex-end'>
            <HeaderButton
              variant='jotify-header-button'
              onClick={registerAuthHandler}
              role='button'
            >
              Register
            </HeaderButton>
          </Box>
        </Grid>
      </Grid>
    </motion.header>
  );
};

export default Header;
