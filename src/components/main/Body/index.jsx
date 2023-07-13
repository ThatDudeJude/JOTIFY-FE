import React from 'react';
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import useMediaQuery from '@mui/material/useMediaQuery';
import Typography from '@mui/material/Typography';
import { motion } from 'framer-motion';
import { StickyNote2, ListAlt } from '@mui/icons-material';
import apiClient from '../../../apiClient';
import Notes from '../Notes';
import Tasks from '../Tasks';

// utilities

export const getAllNotesCategories = async (client, token) => {
  apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await apiClient.get('/notes/all-notes-categories/');
};

const getAllNotes = async (client, token, category, id) => {
  apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  if (category === 'All' && id === 0) {
    return await apiClient.get('/notes/all/');
  } else if (id === 1) {
    return await apiClient.get('/notes/all/quick/');
  } else if (category && id) {
    return await apiClient.get(`/notes/all/categorized/${id}/`);
  } else {
    throw new Error('No search category provided');
  }
};

const getAllTasks = async (client, token) => {
  apiClient.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await apiClient.get('/tasks/');
};

const Body = ({
  setRedirectToAuth,
  token,
  currentTab,
  setCurrentTab,
  setToken,
}) => {
  //   const large = useMediaQuery('(min-width: 1100px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');
  const [isLoading, setIsLoading] = React.useState(true);
  //   const [currentTab, setCurrentTab] = React.useState('tasks');
  const [notesTabData, setNotesTabData] = React.useState({
    notes: [],
    categories: [],
  });
  const [category, setCategory] = React.useState({
    id: 0,
    name: 'All',
  });
  const [tasksTabData, setTasksTabData] = React.useState({
    tasks: [],
    priorities: [
      { id: 'LOW', name: 'Low' },
      { id: 'MEDIUM', name: 'Medium' },
      { id: 'HIGH', name: 'High' },
    ],
  });
  //   const [priority, setPriority] = React.useState({
  //     id: 'ALL',
  //     name: 'All',
  //   });

  React.useEffect(() => {
    if (currentTab === 'notes') {
      Promise.all([
        getAllNotesCategories(client, token),
        getAllNotes(client, token, category.name, category.id),
      ])
        .then(([categoriesResponse, notesResponse]) => {
          if (
            categoriesResponse.status === 200 &&
            categoriesResponse.statusText === 'OK' &&
            notesResponse.status === 200 &&
            notesResponse.statusText === 'OK'
          )
            // setIsLoading(true);
            setNotesTabData({
              ...notesTabData,
              categories: categoriesResponse.data.all_user_categories,
              notes:
                category.id === 0
                  ? notesResponse.data.author_notes
                  : notesResponse.data,
            });
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setRedirectToAuth(true);
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    } else if (currentTab === 'tasks') {
      getAllTasks(client, token)
        .then((tasksResponse) => {
          if (tasksResponse.status === 200 && tasksResponse.statusText === 'OK')
            setTasksTabData({
              priorities: tasksTabData.priorities,
              tasks: tasksResponse.data,
            });
          setIsLoading(false);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setRedirectToAuth(true);
            }
          } else if (error.request) {
            // The request was made but no response was received
            console.log(error.request);
          } else {
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
          }
        });
    }
  }, [currentTab, token, category]);

  const handleTabChange = (e, newValue) => {
    setIsLoading(true);
    setCurrentTab(newValue);
  };
  //   console.log(notesTabData.notes);
  return (
    <>
      <TabContext value={currentTab}>
        <Box sx={{ width: '100%' }}>
          <Tabs
            value={currentTab}
            onChange={handleTabChange}
            variant={mid ? 'fullWidth' : 'standard'}
            textColor='primary'
            centered={mid ? false : true}
            indicatorColor='primary'
            aria-label='navigate tabs'
            sx={{ fontSize: small && '1.2rem' }}
          >
            <Tab
              icon={
                <StickyNote2 sx={{ fontSize: small ? '1.6rem' : '2.1rem' }} />
              }
              iconPosition='start'
              label={
                <span style={{ fontSize: small && '1.2rem' }}>My Notes</span>
              }
              value='notes'
              sx={{ minHeight: small ? '45px' : '4rem' }}
            />
            <Tab
              icon={<ListAlt sx={{ fontSize: small ? '1.6rem' : '2.1rem' }} />}
              iconPosition='start'
              label={
                <span style={{ fontSize: small && '1.2rem' }}>My Tasks</span>
              }
              value='tasks'
              sx={{ minHeight: small ? '45px' : '4rem' }}
            />
          </Tabs>
          <TabPanel
            value='notes'
            sx={{
              padding: small ? '1rem 0' : '2rem',
            }}
          >
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '400px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant='h4'
                  component={motion.h3}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Fetching Notes...
                </Typography>
              </Box>
            ) : (
              <Notes
                allNotes={notesTabData.notes}
                allCategories={notesTabData.categories.concat([
                  { id: 0, category: 'All' },
                ])}
                currentCategory={category}
                setCurrentCategory={setCategory}
                token={token}
                setToken={setToken}
              />
            )}
          </TabPanel>
          <TabPanel value='tasks' sx={{ padding: small ? '1rem 0' : '2rem' }}>
            {isLoading ? (
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  height: '400px',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <Typography
                  variant='h4'
                  component={motion.h3}
                  animate={{ opacity: 1 }}
                  initial={{ opacity: 0 }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Fetching Tasks...
                </Typography>
              </Box>
            ) : (
              <Tasks
                allTasks={tasksTabData.tasks}
                taskPriorities={tasksTabData.priorities.concat([
                  { id: 'ALL', name: 'All' },
                ])}
              />
            )}
          </TabPanel>
        </Box>
      </TabContext>
    </>
  );
};

export default Body;
