import React from 'react';
import { motion } from 'framer-motion';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { ArrowDownward } from '@mui/icons-material';
import { styled as muistyled } from '@mui/material/styles';
import styled from 'styled-components';
import useMediaQuery from '@mui/material/useMediaQuery';

const HeroBox = muistyled(Box)(({ theme }) => ({
  textAlign: 'center',
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
}));

const HeroHeader = styled.h1`
  width: fit-content;
  letter-spacing: 0.35rem;
`;

// Styles

let welcomeStyle = {
  position: 'relative',
  width: '100vw',
  height: '100vh',
  display: 'grid',
  gridTemplateColumns: '100vw',
  gridTemplateRows: 'max-content',
  scroll: 'none',
  color: '#ffffff',
  alignItems: 'center',
};

const heroStyle = {
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'grid',
  marginTop: '35vh',
  gridTemplateColumns: '100%',
  gridTemplateRows: '70% 30%',
};

let heroMessage = {
  position: 'relative',
  width: '100%',
  height: '100%',
};

let heroGrid = {
  gridTemplateColumns: '1fr',
  gridTemplateRows: 'max-height',
};

const actionButtonContainerStyle = {
  width: 'fit-content',
  paddingLeft: '5rem',
  paddingRight: '5rem',
  marginTop: '1rem',
  opacity: 0,
};

//   Variants

const heroVariant = {
  hidden: {
    x: -500,
  },
  visible: {
    x: 0,
    transition: {
      type: 'tween',
      delay: 5,
      delayChildren: 1,
      when: 'beforeChildren',
      staggerChildren: 1,
    },
  },
};

const mainMessageVariant = {
  hidden: {
    x: -1000,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
  },
};

const Hero = ({ detailScope, buttonScope }) => {
  //   const large = useMediaQuery('(min-width: 1100px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');

  const showCaseText = [
    {
      id: 0,
      h1: 'Keep',
      delayedText: ' Track',
    },
    {
      id: 1,
      h1: 'Keep',
      delayedText: ' Notes',
    },
    {
      id: 2,
      h1: 'Stay',
      delayedText: ' Organized',
    },
  ];

  heroGrid = {
    ...heroGrid,
    justifyItems: mid ? 'center' : 'start',
    alignItems: mid ? 'center' : 'start',
    padding: small ? '4.5rem 3rem' : '5rem',
    paddingBottom: '0.5rem',
  };

  welcomeStyle = {
    ...welcomeStyle,
    backgroundColor: mid ? 'rgba(0, 0, 0, 0.65)' : 'transparent',
    justifyContent: mid ? 'start' : 'start',
  };

  heroMessage = {
    ...heroMessage,
    alignItems: mid ? 'center' : 'start',
  };

  return (
    <motion.main className='welcome' style={welcomeStyle}>
      <div style={heroStyle}>
        <HeroBox style={heroMessage}>
          <Grid
            container
            spacing={small ? 1 : 2}
            direction='column'
            component={motion.div}
            variants={heroVariant}
            animate='visible'
            initial='hidden'
            style={heroGrid}
          >
            {showCaseText.map((text) => (
              <Grid
                item
                key={text.id}
                component={motion.div}
                variants={mainMessageVariant}
                style={{ width: 'fit-content' }}
              >
                <HeroHeader
                  key={text.id}
                  style={{ fontSize: small ? '2rem' : '3rem' }}
                >
                  {text.h1}
                  <motion.span key={text.id}>
                    {text.delayedText}
                    {text.id < 2 ? ',' : '.'}
                  </motion.span>
                </HeroHeader>
              </Grid>
            ))}
            <Grid
              item
              key={3}
              component={motion.div}
              variants={mainMessageVariant}
              style={{ width: 'fit-content' }}
            >
              <Typography component='p' variant='h5' ref={detailScope}>
                Save short notes and to-do lists with Jotify.
              </Typography>
            </Grid>
          </Grid>
          <Box style={actionButtonContainerStyle} ref={buttonScope}>
            <Button
              variant='contained'
              onClick={() =>
                document
                  .getElementById('more')
                  .scrollIntoView({ behavior: 'smooth' })
              }
            >
              Learn More <ArrowDownward />
            </Button>
          </Box>
        </HeroBox>
      </div>
    </motion.main>
  );
};

export default Hero;
