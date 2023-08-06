import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Link from '@mui/material/Link';
import useMediaQuery from '@mui/material/useMediaQuery';
import apiClient from '../../../apiClient';

const defaultFormValues = {
  value: '',
  error: false,
  message: 'Please fill out this field!',
};

const RegisterForm = ({ setAuthForm }) => {
  const small = useMediaQuery('(max-width: 600px)');
  const [name, setName] = React.useState(defaultFormValues);
  const [email, setEmail] = React.useState(defaultFormValues);
  const [password1, setPassword1] = React.useState(defaultFormValues);
  const [password2, setPassword2] = React.useState(defaultFormValues);

  const [formError, setFormError] = React.useState({
    error: false,
    errorMessage: '',
  });

  const nameHandler = (value) => {
    if (value === '') {
      setName({
        ...name,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setName({ ...name, value: value, error: false, message: '' });
    }
  };

  const emailHandler = (value) => {
    if (value === '') {
      setEmail({
        ...email,
        value: value,
        error: true,
        message: 'Please provide your email!',
      });
    } else if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
      setEmail({
        ...email,
        value: value,
        error: true,
        message: 'Please provide a valid email!',
      });
    } else {
      setEmail({ ...email, value: value, error: false, message: '' });
    }
  };

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
    if (e.target.name === 'name') {
      nameHandler(e.target.value);
    } else if (e.target.name === 'email') {
      emailHandler(e.target.value);
    } else if (e.target.name === 'password1') {
      password1Handler(e.target.value);
    } else if (e.target.name === 'password2') {
      password2Handler(e.target.value);
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    delete apiClient.defaults.headers.common['Authorization'];
    apiClient
      .post('/auth/signup/', {
        email: email.value,
        name: name.value,
        password: password2.value,
      })
      .then((response) => {
        if (response.status === 201) setAuthForm('login');
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
      <Typography
        variant={small ? 'h5' : 'h3'}
        component='h1'
        sx={{ width: '100%', textAlign: 'center', marginTop: '2rem' }}
      >
        Register
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
              name='name'
              label='Name'
              required
              type='text'
              variant='outlined'
              className='jotify-authtextfield'
              value={name.value}
              error={name.error}
              helperText={name.error && name.message}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              name='email'
              label='Email'
              required
              type='text'
              variant='outlined'
              className='jotify-authtextfield'
              value={email.value}
              error={email.error}
              helperText={email.error && email.message}
            />
          </Box>
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
            disabled={
              !(
                name.value &&
                !name.error &&
                email.value &&
                !email.error &&
                password2.value &&
                !password2.error
              )
            }
          >
            Register Account
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
          Already have an account? Login{' '}
          <Link
            component='button'
            variant='button'
            onClick={() => setAuthForm('login')}
          >
            here
          </Link>
        </Typography>
      </Box>
    </Box>
  );
};

export default RegisterForm;
