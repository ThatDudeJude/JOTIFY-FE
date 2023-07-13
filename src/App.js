import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import WelcomePage from './components/landing/WelcomePage';
import Main from './components/main/Main';
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Note from './components/main/Note';
import Task from './components/main/Task';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs'

export const client = axios.create({ baseURL: 'http://127.0.0.1:8000/api/v1' });
// export const client = axios.create({ baseURL: 'http://192.168.43.139:8000/api/v1' });
// http://192.168.43.139:3000

export const useClientStorage = (key, initialValue) => {
  const [value, setValue] = React.useState(
    localStorage.getItem(key) || initialValue
  );

  React.useEffect(() => {
    localStorage.setItem(key, value);
  }, [value, key]);

  return [value, setValue];
};

const App = () => {

    const [token, setToken] = useClientStorage('token', '');
    const [name, setName] = useClientStorage('name', '');
    const [currentTab, setCurrentTab] = useClientStorage('tab', 'notes')
    const [redirectToAuth, setRedirectToAuth] = React.useState(false);
    const [authForm, setAuthForm] = React.useState('token expired');
  return (
    <div className='App'>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
                <Route path='/' element={
                        token!== ''? <Navigate to="/app" /> : 
                        <Navigate to="/welcome" />                    
                } />
                <Route path='/app' element={<Main token={token} currentTab={currentTab}  setName={setName} setToken={setToken} setCurrentTab={setCurrentTab} 
                    redirectToAuth={redirectToAuth} setRedirectToAuth={setRedirectToAuth} authForm={authForm} setAuthForm={setAuthForm}
                />}/> :
                <Route path='/welcome' element={<WelcomePage setToken={setToken} setName={setName} />}/>                                      
                <Route path="/app/note/new" element={<Note token={token} setToken={setToken} />} />
                <Route path="/app/note/:action/:category/:id" element={<Note token={token} setToken={setToken} />} />
                <Route path='/app/task/new' element={<Task token={token} setToken={setToken} />} />
                <Route path="/app/task/:action/:id" element={<Task token={token} setToken={setToken} />} />
                <Route path="/account/password-reset/:uid/:reset_token" element={<Main token={token} currentTab={currentTab}  setName={setName} setToken={setToken} setCurrentTab={setCurrentTab} 
                    redirectToAuth={true} setRedirectToAuth={setRedirectToAuth} authForm={"reset password"} setAuthForm={setAuthForm}
                />} />
        </Routes>
      </BrowserRouter>
      </LocalizationProvider>
    </div>
  );
};

export default App;
