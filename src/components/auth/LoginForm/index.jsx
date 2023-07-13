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

const LoginForm = ({ setAuthModal, setAuthForm, setToken, setName }) => {
  const small = useMediaQuery('(max-width: 600px)');
  const navigate = useNavigate();
  const [email, setEmail] = React.useState(defaultFormValues);
  const [password, setPassword] = React.useState(defaultFormValues);

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
    }
  };

  const passwordHandler = (value) => {
    if (value === '') {
      setPassword({
        ...password,
        value: value,
        error: true,
        message: 'Please enter your password.',
      });
    } else {
      setPassword({
        ...password,
        value: value,
        error: false,
        message: '',
      });
    }
  };

  const handleFormChange = (e) => {
    if (e.target.name === 'email') {
      emailHandler(e.target.value);
    } else if (e.target.name === 'password') {
      passwordHandler(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    delete client.defaults.headers.common['Authorization'];
    client
      .post('/auth/login/', {
        email: email.value,
        password: password.value,
      })
      .then((res) => {
        if (res.status === 201) {
          setToken(res.data.token);
          setName(res.data.name);
          setAuthModal(false);
          navigate('/');
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          setEmail({
            ...email,
            error: true,
            message: error.response.data.error,
          });
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
        Login
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
          <Box>
            <TextField
              fullWidth
              name='password'
              label='Password'
              required
              type='password'
              variant='outlined'
              className='jotify-authtextfield'
              value={password.value}
              error={password.error}
              helperText={password.error && password.message}
            />
          </Box>
          <Link
            style={{ fontSize: '0.9rem', cursor: 'pointer' }}
            onClick={() => setAuthForm('reset email')}
          >
            Forgot password?
          </Link>
          <Button
            variant='contained'
            type='submit'
            component='button'
            disabled={
              !(
                email.value &&
                !email.error &&
                password.value &&
                !password.error
              )
            }
          >
            Login
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
      <Box>
        <Typography
          variant='h6'
          component='p'
          sx={{ width: '100%', textAlign: 'center', marginBottom: '2rem' }}
        >
          Don't have an account? Register{' '}
          <Link
            variant='button'
            component='button'
            onClick={() => setAuthForm('register')}
          >
            here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default LoginForm;
