import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { styled as muistyled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import AuthModal from '../../auth/AuthModal';
import MainHeader from '../MainHeader';
import Body from '../Body';

// Styles

const MainBoxContainer = muistyled(Box)(({ theme }) => ({
  color: 'white',
  position: 'relative',
  backgroundColor: '#000000',
  height: '100vh',
  width: '100vw',
  overflowY: 'hidden',
}));

// utilities

const Main = ({
  token,
  setToken,
  setName,
  currentTab,
  setCurrentTab,
  redirectToAuth,
  setRedirectToAuth,
  authForm,
  setAuthForm,
}) => {
  //   const clientToken = localStorage.getItem('token');
  const smallForHeader = useMediaQuery('(max-width: 750px)');
  //   const [redirectToAuth, setRedirectToAuth] = React.useState(false);
  //   const [authForm, setAuthForm] = React.useState('token expired');

  return (
    <Box sx={{ height: '100%' }}>
      {redirectToAuth ? (
        <AuthModal
          setAuthModal={setRedirectToAuth}
          setAuthForm={setAuthForm}
          currentAuthForm={authForm}
          setToken={setToken}
          setName={setName}
          token={token}
        />
      ) : (
        <>
          <div>
            <MainBoxContainer>
              <Grid container spacing={1}>
                <Grid item xs={12}>
                  <MainHeader setToken={setToken} />
                </Grid>
                {/* <Grid item xs={12}>
                  Hello, {clientName}.
                </Grid> */}
                <Grid
                  item
                  xs={12}
                  sx={{
                    height: 'max-content',
                    marginTop: smallForHeader ? '33px' : 'initial',
                  }}
                >
                  <Body
                    setRedirectToAuth={setRedirectToAuth}
                    token={token}
                    currentTab={currentTab}
                    setCurrentTab={setCurrentTab}
                    setToken={setToken}
                  />
                </Grid>
              </Grid>
            </MainBoxContainer>
          </div>
        </>
      )}
    </Box>
  );
};

export default Main;
