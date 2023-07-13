import React from 'react';
import Typography from '@mui/material/Typography';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import { motion } from 'framer-motion';
import { styled as muistyled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import useMediaQuery from '@mui/material/useMediaQuery';

const LearnMorePaper = muistyled(Paper)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  backgroundColor: 'transparent',
  border: '2px solid #ffc000',
  color: '#ffc000',
  height: '100%',
  '&:hover': {
    // backgroundColor: '#ffa500',
    backgroundColor: '#ffaa33',
    color: '#000000',
  },
}));

const LearnMore = ({ title, titleIcon, itemIcon, listItems, id }) => {
  const mid = useMediaQuery('(max-width: 1100px)');
  //   const small = useMediaQuery('(max-width: 600px)');
  return (
    <LearnMorePaper
      key={id}
      component={motion.div}
      variant='elevation'
      elevation={6}
      sx={{ padding: mid ? '0rem' : '1rem', paddingTop: '1rem' }}
      //   initial={{ x: -1000 }}
      //   whileInView={{ x: 0 }}
    >
      <Typography
        variant='h4'
        component='p'
        sx={{
          display: 'flex',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}
      >
        {titleIcon}
        <span style={{ verticalAlign: 'middle', paddingLeft: '1rem' }}>
          {title}
        </span>
      </Typography>
      <List>
        {listItems.map((item, idx) => (
          <ListItem key={idx}>
            <ListItemIcon sx={{ fontSize: '1.8rem', color: 'inherit' }}>
              {' '}
              {itemIcon}
            </ListItemIcon>
            <ListItemText
              primaryTypographyProps={{
                sx: { fontSize: '1.4rem' },
              }}
              primary={`${item}`}
            />
          </ListItem>
        ))}
      </List>
    </LearnMorePaper>
  );
};

export default LearnMore;
