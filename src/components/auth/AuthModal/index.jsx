import React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { styled as muistyled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import LoginForm from '../LoginForm';
import RegisterForm from '../RegisterForm';
import PasswordReset from '../PasswordReset';
import PasswordResetConfirm from '../PasswordResetConfirm';
import { Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

//  Styles

const ModalBox = muistyled(Box)(({ theme }) => ({
  position: 'absolute',
  top: 0,
  left: 0,
  backgroundColor: '#000000e8',
  width: '100%',
  height: '100%',
  display: 'none',
  zIndex: 300,
}));

let modalContentStyle = {
  position: 'relative',
  width: 'clamp(40%, 400px, 90%)',
  height: 'fit-content',
  border: '5px solid #ffc000',
  backgroundColor: '#000000',
  borderRadius: '9px',
};

const CloseButton = muistyled(Button)(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  top: '10px',
  right: '10px',
  width: '30px',
  height: 'min-content',
  justifyContent: 'center',
  alignItems: 'center',
  borderRadius: '25px',
  border: '3px solid #ffc000',
  //   backgroundColor: '#ffc000',
}));

// Variants

const modalVariant = {
  hidden: {
    // display: 'none',
    opacity: 0,
  },
  visible: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 1,
    transition: {
      duration: 0.5,
      delayChildren: 1,
    },
  },
};

const modalContentVariant = {
  contentHidden: {
    y: -500,
    opacity: 0,
  },
  contentVisible: {
    y: 0,
    opacity: 1,
    transition: {
      type: 'spring',
      dampness: '500',
      stiffness: '200',
      duration: 0.2,
    },
  },
  exit: {
    y: 500,
    opacity: 0,
  },
};

const AuthModal = ({
  setAuthModal,
  setAuthForm,
  setToken,
  currentAuthForm,
  setName,
}) => {
  const small = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  modalContentStyle = {
    ...modalContentStyle,
    paddingLeft: small ? '1.5rem' : '2.5rem',
    paddingRight: small ? '1.5rem' : '2.5rem',
  };

  return (
    <ModalBox
      component={motion.div}
      variants={modalVariant}
      animate='visible'
      initial='hidden'
      exit={{ opacity: 0 }}
      onClick={() => {
        if (token) {
          navigate('/app');
        } else setAuthModal(false);
      }}
      key='modalbox'
    >
      {currentAuthForm === 'login' && (
        <Box
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
          component={motion.div}
          variants={modalContentVariant}
          animate='contentVisible'
          initial='contentHidden'
          exit='exit'
        >
          <CloseButton variant='jotify-black'>
            <Close
              onClick={() => {
                if (token) navigate('/welcome');
                else setAuthModal(false);
              }}
              fontSize='medium'
            />
          </CloseButton>
          <LoginForm
            setAuthModal={setAuthModal}
            setAuthForm={setAuthForm}
            setToken={setToken}
            setName={setName}
          />
        </Box>
      )}
      {currentAuthForm === 'register' && (
        <Box
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
          component={motion.div}
          variants={modalContentVariant}
          animate='contentVisible'
          initial='contentHidden'
          exit='exit'
        >
          <CloseButton variant='jotify-black'>
            <Close
              onClick={() => {
                if (token) navigate('/welcome');
                else setAuthModal(false);
              }}
              fontSize='medium'
            />
          </CloseButton>
          <RegisterForm setAuthForm={setAuthForm} />
        </Box>
      )}
      {currentAuthForm === 'token expired' && (
        <Box
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
          component={motion.div}
          variants={modalContentVariant}
          animate='contentVisible'
          initial='contentHidden'
          exit='exit'
        >
          <Box sx={{ padding: '1rem 1.2rem' }}>
            <Stack
              spacing={2}
              sx={{
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                color: '#ffc000',
              }}
            >
              <Box>
                <Typography variant='h6' component='p'>
                  Your session's token has expired
                </Typography>
              </Box>
              <Box>
                <Button
                  onClick={() => setAuthForm('login')}
                  variant='contained'
                >
                  Login
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      )}
      {currentAuthForm === 'reset email' && (
        <Box
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
          component={motion.div}
          variants={modalContentVariant}
          animate='contentVisible'
          initial='contentHidden'
          exit='exit'
        >
          <CloseButton variant='jotify-black'>
            <Close
              onClick={() => {
                if (token) navigate('/welcome');
                else setAuthModal(false);
              }}
              fontSize='medium'
            />
          </CloseButton>
          <PasswordReset />
        </Box>
      )}
      {currentAuthForm === 'reset password' && (
        <Box
          style={modalContentStyle}
          onClick={(e) => e.stopPropagation()}
          component={motion.div}
          variants={modalContentVariant}
          animate='contentVisible'
          initial='contentHidden'
          exit='exit'
        >
          <CloseButton variant='jotify-black'>
            <Close
              onClick={() => {
                if (token) navigate('/welcome');
                else setAuthModal(false);
              }}
              fontSize='medium'
            />
          </CloseButton>
          <PasswordResetConfirm
            setAuthForm={setAuthForm}
            setAuthModal={setAuthModal}
          />
        </Box>
      )}
    </ModalBox>
  );
};

export default AuthModal;
