import React from 'react';
import useMediaQuery from '@mui/material/useMediaQuery';
import StickyNoteImage from '../../../imgs/lightbulb-flipped-comp.png';

const generalStyle = {
  backgroundImage: `url(${StickyNoteImage})`,
  backgroundSize: 'cover',
  backgroundRepeat: 'no-repeat',
  height: '100vh',
  width: '100vw',
};

const WelcomeWrapper = ({ children }) => {
  const large = useMediaQuery('(min-width: 1100px)');

  const wrapperStyle = large
    ? {
        ...generalStyle,
        backgroundPosition: '50% 0%',
        position: 'relative',
        height: '100vh',
        width: '100vw',
      }
    : {
        ...generalStyle,
        backgroundPosition: '75% 0%',
        position: 'relative',
        height: '100vh',
        width: '100vw',
      };

  return <div style={wrapperStyle}>{children}</div>;
};

export default WelcomeWrapper;
