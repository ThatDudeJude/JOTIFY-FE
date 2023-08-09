import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { styled as muistyled } from '@mui/material/styles';
import {
  StickyNote2,
  NoteAdd,
  CalendarMonth,
  ListAlt,
  TaskAlt,
  ChevronRight,
  KeyboardDoubleArrowUp,
} from '@mui/icons-material';
import { useAnimate, useInView } from 'framer-motion';
import LearnMore from '../LearnMore';

// Styled Elements

const ScrollUpButton = muistyled(Button)(({ theme }) => ({
  position: 'fixed',
  display: 'none',
  bottom: '25px',
  right: '25px',
  width: '50px',
  height: '50px',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '25px',
  //   backgroundColor: '#ffc000',
}));

// styles

let learnMoreContainer = {
  paddingTop: '2rem',
  backgroundColor: 'black',
  color: '#eeeeee',
  display: 'none',
};

const More = ({ learnMoreScope, setAuthModal, setAuthForm }) => {
  const [scrollUpButtonScope, animateScrollUpButton] = useAnimate();
  const [goodiesScope, _] = useAnimate();
  const isInView = useInView(goodiesScope);

  useEffect(() => {
    if (isInView) {
      animateScrollUpButton(scrollUpButtonScope.current, { display: 'flex' });
    } else {
      animateScrollUpButton(scrollUpButtonScope.current, { display: 'none' });
    }
  }, [isInView]);

  const large = useMediaQuery('(min-width: 1100px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');

  learnMoreContainer = {
    ...learnMoreContainer,
    padding: small ? '2rem' : mid ? '3rem' : '5rem',
  };

  const handleRegisterAction = () => {
    setAuthModal(true);
    setAuthForm('register');
  };

  return (
    <motion.div
      ref={learnMoreScope}
      style={learnMoreContainer}
      id='more'
      data-test-id='more'
    >
      <Typography
        variant='h3'
        sx={{ marginBottom: '3rem', textAlign: mid ? 'center' : 'start' }}
        component={motion.h3}
      >
        The Goodies
      </Typography>
      <Grid container spacing={4} justifyContent='center'>
        {[
          {
            id: 0,
            title: 'Notes',
            titleIcon: <StickyNote2 sx={{ fontSize: '3rem' }} />,
            itemIcon: <NoteAdd />,
            listItems: [
              'Create titled notes',
              'Save both quick and categorized notes.',
            ],
          },
          {
            id: 1,
            title: 'To-Dos',
            titleIcon: <CalendarMonth sx={{ fontSize: '3rem' }} />,
            itemIcon: <TaskAlt />,
            listItems: [
              'Save to-do tasks',
              'Prioritize and specify task deadlines.',
            ],
          },
          {
            id: 2,
            title: 'Organize',
            titleIcon: <ListAlt sx={{ fontSize: '3rem' }} />,
            itemIcon: <ChevronRight />,
            listItems: ['View notes by category', 'View tasks by priority'],
          },
        ].map((item) => (
          <Grid
            item
            xs={large ? 4 : small ? 12 : 6}
            key={item.id}
            {...(item.id === 1 ? { ref: goodiesScope } : {})}
            //   initial={{ opacity: 0 }}
            //   whileInView={{ opacity: 1 }}
            initial={{ x: -100 * (1 + item.id), opacity: 0 }}
            whileInView={{ x: 0, opacity: 1 }}
            transition={{ duration: 1.0 }}
            viewport={{ once: true }}
            component={motion.div}
          >
            <LearnMore id={item.id} {...item} />
          </Grid>
        ))}
      </Grid>
      <Box
        sx={{
          display: 'flex',
          marginTop: '5rem',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '2rem',
        }}
      >
        <Button
          variant='contained'
          sx={{ fontSize: '1.8rem', padding: '1.3rem' }}
          onClick={() => {
            document
              .getElementById('jotify-header')
              .scrollIntoView({ behavior: 'smooth' });
            setTimeout(handleRegisterAction, 500);
          }}
        >
          Create Account
        </Button>
      </Box>
      <ScrollUpButton
        variant='contained'
        ref={scrollUpButtonScope}
        onClick={() => {
          document
            .getElementById('jotify-header')
            .scrollIntoView({ behavior: 'smooth' });
        }}
      >
        <KeyboardDoubleArrowUp />
      </ScrollUpButton>
    </motion.div>
  );
};

export default More;
