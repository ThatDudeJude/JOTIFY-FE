import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router-dom';
import { client } from '../../../App';

// import { useClientStorage } from '../../../App';

const defaultFormValues = {
  value: '',
  error: false,
  message: 'Please fill out this field!',
};

const PasswordReset = () => {
  const small = useMediaQuery('(max-width: 600px)');
  const [email, setEmail] = React.useState(defaultFormValues);
  const [emailAccepted, setEmailAccepted] = React.useState({
    isConfirmed: false,
    message: '',
  });
  const [formError, setFormError] = React.useState({
    error: false,
    errorMessage: '',
  });

  const emailHandler = (value) => {
    if (value === '') {
      setEmail({
        ...email,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setEmail({ ...email, value: value, error: false, message: '' });
      setFormError({
        ...formError,
        error: false,
        errorMessage: '',
      });
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === 'email') {
      emailHandler(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    delete client.defaults.headers.common['Authorization'];
    client
      .post('/auth/password-reset/', {
        email: email.value,
      })
      .then((res) => {
        if (res.status === 202) {
          setEmailAccepted({
            ...emailAccepted,
            isConfirmed: true,
            message: res.data.message,
          });
        }
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 406) {
            setEmail({
              ...email,
              error: true,
              message: error.response.data.error,
            });
          } else if (error.response.status === 400) {
            setFormError({
              ...formError,
              error: true,
              errorMessage: error.response.data.error,
            });
          }
        } else if (error.request) {
          setFormError({
            ...formError,
            error: true,
            errorMessage: `No response received!: ${error.request}`,
          });
        } else {
          setFormError({
            ...formError,
            error: true,
            errorMessage: 'Something went wrong.',
          });
        }
      });
  };

  return (
    <Box sx={{ color: '#ffffff' }}>
      <Typography
        variant={small ? 'h5' : 'h3'}
        component='h1'
        sx={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}
      >
        Password Reset
      </Typography>
      {emailAccepted.isConfirmed ? (
        <Box sx={{ margin: '2rem 0rem' }}>
          <Typography variant='h6' component='p'>
            Request successful. {emailAccepted.message}
          </Typography>
        </Box>
      ) : (
        <form
          action=''
          onSubmit={(e) => handleFormSubmit(e)}
          onChange={(e) => handleFormChange(e)}
          style={{ marginTop: '2rem', marginBottom: '2rem' }}
        >
          <Stack spacing={2}>
            <Box>
              <Typography variant='h6' component='p'>
                Confirm email address for password reset link:
              </Typography>
            </Box>
            <Box>
              <TextField
                fullWidth
                name='email'
                label='Email'
                required
                type='email'
                variant='outlined'
                className='jotify-authtextfield'
                value={email.value}
                error={email.error}
                helperText={email.error && email.message}
              />
            </Box>
            <Button
              variant='contained'
              type='submit'
              component='button'
              disabled={!(email.value && !email.error)}
            >
              Send Reset Request
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
      )}
    </Box>
  );
};

export default PasswordReset;
