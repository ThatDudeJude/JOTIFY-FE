import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../../../apiClient';

const defaultFormValues = {
  value: '',
  error: false,
  message: 'Please fill out this field!',
};

const PasswordResetConfirm = ({ setAuthForm, setAuthModal }) => {
  const small = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const params = useParams();
  const uid = params.uid;
  const resetToken = params.reset_token;
  const [password1, setPassword1] = React.useState(defaultFormValues);
  const [password2, setPassword2] = React.useState(defaultFormValues);
  const [newPasswordConfirmed, setNewPasswordConfirmed] = React.useState({
    isConfirmed: false,
    message: '',
  });
  const [formError, setFormError] = React.useState({
    error: false,
    errorMessage: '',
  });

  const password1Handler = (value) => {
    if (value === '') {
      setPassword1({
        ...password1,
        value: value,
        error: true,
        message: 'Please provide a password!',
      });
    } else if (
      !value.match(/^(?=.*[0-9])(?=.*[!@#$%^&*()])[a-zA-Z0-9!@#$%^&*()]{7,15}$/)
    ) {
      setPassword1({
        ...password1,
        value: value,
        error: true,
        message:
          'Please provide a password with between 7 to 15 characters containing at least one numeric digit and a special character!',
      });
    } else {
      setPassword1({ ...password1, value: value, error: false, message: '' });
    }
  };

  const password2Handler = (value) => {
    if (password1.value !== value) {
      setPassword2({
        ...password2,
        value: value,
        error: true,
        message: "Passwords don't match!",
      });
    } else {
      setPassword2({ ...password2, value: value, error: false, message: '' });
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === 'password1') {
      password1Handler(e.target.value);
    } else if (e.target.name === 'password2') {
      password2Handler(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    delete apiClient.defaults.headers.common['Authorization'];
    apiClient
      .post(`/auth/password-reset-confirm/${uid}/${resetToken}/`, {
        new_password: password2.value,
      })
      .then((res) => {
        if (res.status === 202) {
          setNewPasswordConfirmed({
            ...newPasswordConfirmed,
            isConfirmed: true,
            message: res.data.message,
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 406) {
          setFormError({
            ...formError,
            error: true,
            errorMessage: error.response.data.error,
          });
        } else if (error.request) {
          setFormError({
            ...formError,
            error: true,
            errorMessage: 'No response received!',
          });
        } else {
          setFormError({
            ...formError,
            error: true,
            errorMessage: 'Something went wrong!',
          });
        }
      });
  };

  return (
    <Box sx={{ color: '#ffffff' }}>
      {newPasswordConfirmed.isConfirmed ? (
        <Stack spacing={2} alignItems='center' sx={{ margin: '2rem 0rem' }}>
          <Box>
            <Typography
              variant={small ? 'h6' : 'h5'}
              component='p'
              sx={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}
            >
              {newPasswordConfirmed.message}
            </Typography>
          </Box>
          <Box>
            <Link
              component='button'
              variant='button'
              onClick={() => {
                console.log('Clicked');
                setAuthModal(true);
                setAuthForm('login');
                navigate('/app');
              }}
            >
              Login
            </Link>
          </Box>
        </Stack>
      ) : (
        <>
          <Typography
            variant={small ? 'h5' : 'h3'}
            component='h1'
            sx={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}
          >
            New password
          </Typography>
          <form
            action=''
            onSubmit={(e) => handleFormSubmit(e)}
            onChange={(e) => handleFormChange(e)}
            style={{ marginTop: '2rem', marginBottom: '2rem' }}
          >
            <Stack spacing={3}>
              <Box>
                <TextField
                  label='Password'
                  name='password1'
                  fullWidth
                  required
                  type='password'
                  variant='outlined'
                  className='jotify-authtextfield'
                  value={password1.value}
                  error={password1.error}
                  helperText={password1.error && password1.message}
                />
              </Box>
              <Box>
                <TextField
                  label='Confirm Password'
                  name='password2'
                  fullWidth
                  required
                  type='password'
                  variant='outlined'
                  className='jotify-authtextfield'
                  value={password2.value}
                  error={password2.error}
                  helperText={password2.error && password2.message}
                  disabled={password1.error || !password1.value}
                />
              </Box>
              <Button
                variant='contained'
                type='submit'
                component='button'
                disabled={!(password2.value && !password2.error)}
              >
                Reset Password
              </Button>
              {formError.error && (
                <Typography
                  variant='p'
                  sx={{
                    color: 'red',
                    fontSize: '1rem',
                    marginTop: '1rem',
                    marginBottom: '1rem',
                    width: '100%',
                  }}
                >
                  {formError.errorMessage}
                </Typography>
              )}
            </Stack>
          </form>
        </>
      )}
    </Box>
  );
};

export default PasswordResetConfirm;
