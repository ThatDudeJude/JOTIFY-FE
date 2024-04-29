import React from 'react';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { styled as muistyled } from '@mui/material/styles';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getDate } from '../Notes';
import apiClient from '../../../apiClient';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ArrowBack, Edit, Delete } from '@mui/icons-material';
import { ModalDialogStack } from '../NoteForm';
import TaskForm from '../TaskForm';
import { getAllUserCategories } from '../Notes';

// Styles

const TaskBoxContainer = muistyled(Box)(({ theme }) => ({
  color: 'white',
  display: 'flex',
  justifyContent: 'center',
  position: 'relative',
  backgroundColor: '#000000',
  height: '100vh',
  width: '100vw',
  overflowY: 'hidden',
}));

const TaskGrid = muistyled(Grid)(({ theme }) => ({
  border: '5px solid #ffc000',
  borderRadius: '15px',
  padding: '0px 0px',
  margin: '5vh 0',
  alignContent: 'flex-start',
  backgroundColor: '#0d192c',
}));

const TaskActionBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  backgroundColor: '#ffc000',
  height: 'fit-content',
}));

//  Utilities
const getTask = async (client, token, taskId) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await client.get(`/tasks/task/${taskId}`);
};

const deleteTask = async (client, token, taskId) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;
  return await client.delete(`/tasks/task/${taskId}/`);
};

// Variants

const viewTaskVariant = {
  hidden: {
    x: -1000,
  },
  show: {
    x: 0,
    transition: {
      //   type: 'spring',
      //   dampness: '2000',
      //   stiffness: '500',
      ease: 'easeIn',
      duration: 0.5,
    },
  },
  exit: {
    x: 1000,
    transition: {
      ease: 'easeOut',
      duration: 0.5,
    },
  },
};

const viewModalVariant = {
  hidden: {
    left: '50%',
    top: '-150%',
    transform: 'translate(-50%, 0%)',
  },
  show: {
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    transition: {
      ease: 'easeIn',
      duration: 0.5,
    },
  },
};

const Task = ({ token, setToken }) => {
  const params = useParams();
  const navigate = useNavigate();
  const action = params.action;
  const taskId = params.id;
  const [task, setTask] = React.useState({});
  const [openDeleteTaskModal, setOpenDeleteTaskModal] = React.useState(false);
  const mid = useMediaQuery('(max-width: 1100px)');
  const small = useMediaQuery('(max-width: 600px)');

  React.useEffect(() => {
    if (taskId >= 1) {
      getTask(apiClient, token, taskId)
        .then((response) => {
          if (response.status === 200) setTask(response.data);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
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
  }, [action, taskId]);

  const handleDeleteTask = (taskId) => {
    deleteTask(apiClient, token, taskId)
      .then((res) => {
        navigate('/app');
      })
      .catch((error) => {
        if (error.response) {
          if (error.response.status === 401) {
            setToken('');
            navigate('/');
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.log(error.request);
        } else {
          // Something happened in setting up the request that triggered an Error
          console.log('Error', error.message);
        }
      });
  };

  return (
    <AnimatePresence>
      <TaskBoxContainer>
        {action === 'view' ? (
          task.id && (
            // <TaskBoxContainer>
            <TaskGrid
              container
              spacing={0}
              sx={{ width: small ? '95vw' : mid ? '70vw' : '55vw' }}
              variants={viewTaskVariant}
              initial='hidden'
              animate='show'
              exit={{ y: 1000 }}
              component={motion.div}
            >
              <Grid item xs={12} sx={{ padding: '0px' }}>
                <TaskActionBox>
                  <Box>
                    <IconButton
                      color='secondary'
                      aria-label='back'
                      onClick={() => navigate('/app')}
                    >
                      {' '}
                      <ArrowBack sx={{ fontSize: '2rem' }} />{' '}
                    </IconButton>
                  </Box>
                  <Box>
                    <ButtonGroup>
                      <IconButton
                        color='secondary'
                        aria-label='edit'
                        onClick={() => navigate(`/app/task/edit/${taskId}`)}
                        sx={{ marginRight: '25px' }}
                      >
                        {' '}
                        <Edit />{' '}
                      </IconButton>
                      <IconButton
                        color='secondary'
                        aria-label='delete'
                        onClick={() => setOpenDeleteTaskModal(true)}
                      >
                        {' '}
                        <Delete />{' '}
                      </IconButton>
                    </ButtonGroup>
                  </Box>
                </TaskActionBox>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{
                  padding: '10px 32px',
                  backgroundColor: '#242e3d',
                  borderBottom: '1px dashed #43392a',
                }}
              >
                <Stack sx={{ height: 'fit-content' }}>
                  <Box sx={{ marginBottom: '1rem' }}>
                    <Typography
                      id='modal-note-title'
                      variant={small ? 'h5' : 'h4'}
                    >
                      {task.short_description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{ display: 'flex', justifyContent: 'space-between' }}
                  >
                    <Stack>
                      <Typography variant='h6'>
                        Due Date:{' '}
                        <Typography variant='body1' component='span'>
                          {new Date(task.due_date).toLocaleDateString()}
                        </Typography>
                      </Typography>
                      <Typography variant='h6'>
                        Due Time:{' '}
                        <Typography variant='body1' component='span'>
                          {task.due_time}
                        </Typography>
                      </Typography>
                    </Stack>
                    <Stack>
                      <Typography variant='h6'>
                        Task Priority:{' '}
                        <Typography variant='body1' component='span'>
                          {task.task_priority}
                        </Typography>
                      </Typography>
                      <Typography variant='h6'>
                        Task Status:{' '}
                        <Typography variant='body1' component='span'>
                          {task.task_completed === false ? 'Pending' : 'Done'}
                        </Typography>
                      </Typography>
                    </Stack>
                  </Box>
                </Stack>
              </Grid>
              <Grid
                item
                xs={12}
                sx={{ padding: '10px 32px', paddingTop: '40px' }}
              >
                <Typography
                  id='modal-note-body'
                  variant='p'
                  sx={{
                    whiteSpace: 'pre-wrap',
                    lineHeight: small ? '1.5rem' : '2rem',
                    fontSize: '1.3rem',
                  }}
                >
                  {task.task_description}
                </Typography>
              </Grid>
            </TaskGrid>
            // </TaskBoxContainer>
          )
        ) : action === 'edit' ? (
          task.id && (
            <TaskForm
              type={action}
              task={task}
              token={token}
              setToken={setToken}
            />
          )
        ) : (
          <TaskForm type={'new'} token={token} setToken={setToken} />
        )}
        <Modal
          open={openDeleteTaskModal}
          onClose={() => setOpenDeleteTaskModal(false)}
          aria-labelledby='modal-modal-title'
          aria-describedby='modal-modal-description'
        >
          <ModalDialogStack
            sx={{
              width: small ? '85vw' : '60vw',
              padding: small ? '1rem 2rem' : '2rem 3rem',
            }}
            component={motion.div}
            variants={viewModalVariant}
            initial='hidden'
            animate='show'
          >
            <Typography
              id='modal-modal-title'
              variant='h4'
              sx={{
                marginBottom: '1.5rem',
                textAlign: 'center',
              }}
            >
              Delete Task
            </Typography>
            <Stack spacing={3}>
              <Typography
                variant='body1'
                sx={{ fontSize: small ? '1rem' : '1.5rem', color: '#ffffff' }}
              >
                Delete{' '}
                <b style={{ fontWeight: 'bold', fontStyle: 'italic' }}>
                  "{task.short_description}"
                </b>{' '}
                ?
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'end',
                  justifyContent: 'right',
                }}
              >
                <Button
                  onClick={() => setOpenDeleteTaskModal(false)}
                  sx={{ marginRight: '15px' }}
                >
                  Cancel
                </Button>
                <Button
                  variant='warning'
                  onClick={() => handleDeleteTask(task.id)}
                >
                  Confirm Delete
                </Button>
              </Box>
            </Stack>
          </ModalDialogStack>
        </Modal>
      </TaskBoxContainer>
    </AnimatePresence>
  );
};

export default Task;
