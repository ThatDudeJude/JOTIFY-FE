import React from 'react';
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import FormLabel from '@mui/material/FormLabel';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { DesktopTimePicker } from '@mui/x-date-pickers/DesktopTimePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { MobileTimePicker } from '@mui/x-date-pickers/MobileTimePicker';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import { styled as muistyled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { motion } from 'framer-motion';
import dayjs from 'dayjs';
import apiClient from '../../../apiClient';
import { ArrowBack } from '@mui/icons-material';
import { JotifyTextFieldOutlinedStyling } from '../../../jotifyTheme';

// Styles

const TaskFormBoxContainer = muistyled(Box)(({ theme }) => ({
  color: '#ffffff',
  display: 'flex',
  justifyContent: 'center',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  //   backgroundColor: '#000000',
  height: '100vh',
  width: '100vw',
  overflowY: 'hidden',
  padding: '0px 32px',
}));

const TaskFormGrid = muistyled(Grid)(({ theme }) => ({
  border: '5px solid #ffc000',
  borderRadius: '15px',
  padding: '0px 0px',
  margin: '5vh 0',
  alignContent: 'flex-start',
  //   backgroundColor: '#0d192c',
}));

const TaskFormActionBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'start',
  backgroundColor: '#ffc000',
  height: 'fit-content',
}));

// Utilities
const defaultFormTaskValues = {
  value: '',
  error: false,
  message: 'Please fill out this field',
};

const createTask = async (client, token, taskData) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;

  return await client.post(`/tasks/`, taskData);
};

const updateTask = async (client, token, taskId, taskData) => {
  client.defaults.headers.common['Authorization'] = `Token ${token}`;

  return await client.put(`/tasks/task/${taskId}/`, taskData);
};

// Variant
const noteTaskVariant = {
  hidden: {
    y: -1000,
  },
  show: {
    y: 0,
    transition: {
      ease: 'easeIn',
      duration: 0.5,
    },
  },
  exit: {
    y: 1500,
  },
};

// utilities

const taskPriorities = [
  { id: 'LOW', name: 'Low' },
  { id: 'MEDIUM', name: 'Medium' },
  { id: 'HIGH', name: 'High' },
];

const TaskForm = ({ type, task, token, setToken }) => {
  const small = useMediaQuery('(max-width: 600px)');
  const mid = useMediaQuery('(max-width: 1100px)');
  const navigate = useNavigate();
  const [taskShortDescription, setTaskShortDescription] = React.useState({
    ...defaultFormTaskValues,
    value: type === 'edit' ? task.short_description : '',
  });
  const [taskPriority, setTaskPriority] = React.useState({
    id:
      type === 'edit'
        ? taskPriorities.filter(
            (priority) => priority.name === task.task_priority
          )[0].id
        : 'LOW',
    name: type === 'edit' ? task.task_priority : 'Low',
  });
  const [taskCompleted, setTaskCompleted] = React.useState(
    type === 'edit' ? task.task_completed : false
  );
  const [taskDueDate, setTaskDueDate] = React.useState({
    ...defaultFormTaskValues,
    value:
      type === 'edit' ? task.due_date : new Date().toISOString().split('T')[0],
  });
  const [taskDueTime, setTaskDueTime] = React.useState({
    ...defaultFormTaskValues,
    value:
      type === 'edit' ? task.due_time : new Date().toTimeString().split(' ')[0],
  });

  const [taskDescription, setTaskDescription] = React.useState({
    ...defaultFormTaskValues,
    value: type === 'edit' ? task.task_description : '',
  });

  const [formError, setFormError] = React.useState({
    error: false,
    errorMessage: '',
  });

  //   handlers
  const shortDescriptionHandler = (value) => {
    if (value === '') {
      setTaskShortDescription({
        ...taskShortDescription,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setTaskShortDescription({
        ...taskShortDescription,
        value: value,
        error: false,
        message: '',
      });
    }
  };

  const taskDueDateHandler = (value) => {
    if (value === '') {
      setTaskDueDate({
        ...taskDueDate,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      value = new Date(value).toISOString().split('T')[0];
      setTaskDueDate({
        ...taskDueDate,
        value: value,
        error: false,
        message: '',
      });
    }
  };

  const taskDueTimeHandler = (value) => {
    if (value === '') {
      setTaskDueTime({
        ...taskDueTime,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      value = new Date(value).toTimeString().split(' ')[0];
      setTaskDueTime({
        ...taskDueTime,
        value: value,
        error: false,
        message: '',
      });
    }
  };

  const handleTaskPrioritySelect = (value) => {
    const selectedPriority = taskPriorities.filter(
      (priority) => priority.id === value
    )[0];
    if (selectedPriority) {
      setTaskPriority({
        id: selectedPriority.id,
        name: selectedPriority.name,
      });
    } else {
      throw new Error('Update priority failed');
    }
  };

  const taskCompletedHandler = (value) => {
    setTaskCompleted(value);
  };

  const taskDescriptionHandler = (value) => {
    if (value === '') {
      setTaskDescription({
        ...taskDescription,
        value: value,
        error: true,
        message: 'Please fill out this field.',
      });
    } else if (value) {
      setTaskDescription({
        ...taskDescription,
        value: value,
        error: false,
        message: '',
      });
    }
  };

  const handleTaskFormChange = (e) => {
    if (e.target.name === 'short_description') {
      shortDescriptionHandler(e.target.value);
    } else if (e.target.name === 'is_completed') {
      taskCompletedHandler(!taskCompleted);
    } else if (e.target.name === 'priority') {
      handleTaskPrioritySelect(e.target.value);
    } else if (e.target.name === 'description') {
      taskDescriptionHandler(e.target.value);
    }
  };

  const handleTaskFormSubmit = (e) => {
    e.preventDefault();
    const taskData = {
      short_description: taskShortDescription.value,
      due_date: taskDueDate.value,
      due_time: taskDueTime.value,
      task_priority: taskPriority.name,
      task_completed: taskCompleted,
      task_description: taskDescription.value,
    };
    if (type === 'edit') {
      updateTask(apiClient, token, task.id, taskData)
        .then((response) => {
          const task = response.data;
          navigate(`/app/task/view/${task.id}`);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
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
    } else {
      createTask(apiClient, token, taskData)
        .then((response) => {
          const task = response.data;
          navigate(`/app/task/view/${task.id}`);
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status === 401) {
              setToken('');
              navigate('/');
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
    }
  };

  return (
    <TaskFormBoxContainer>
      <TaskFormGrid
        container
        spacing={0}
        sx={{ width: small ? '95vw' : mid ? '80vw' : '55vw' }}
        variants={noteTaskVariant}
        animate='show'
        initial='hidden'
        component={motion.div}
      >
        <Grid item xs={12} sx={{ padding: '0px' }}>
          <TaskFormActionBox>
            <Box>
              <IconButton
                color='secondary'
                aria-label='back'
                onClick={() => {
                  navigate(
                    type === 'edit' ? `/app/task/view/${task.id}` : '/app'
                  );
                }}
                sx={{ padding: '0px' }}
              >
                {' '}
                <ArrowBack sx={{ fontSize: '2rem' }} />{' '}
              </IconButton>
            </Box>
          </TaskFormActionBox>
        </Grid>
        <Grid item xs={12} sx={{ padding: '0px 24px 10px 24px' }}>
          <Typography
            variant={small ? 'h4' : 'h3'}
            component='h1'
            sx={{
              width: '100%',
              textAlign: 'center',
              marginTop: small ? '1rem' : '2rem',
            }}
          >
            {type === 'edit' ? 'Edit Task' : 'New Task'}
          </Typography>
        </Grid>

        <Grid item xs={12} sx={{ padding: '10px 24px 20px 24px' }}>
          <form
            action=''
            onChange={(e) => handleTaskFormChange(e)}
            onSubmit={(e) => handleTaskFormSubmit(e)}
          >
            <Stack spacing={small ? 1 : 3}>
              <Box sx={{ color: '#ffffff' }}>
                <TextField
                  fullWidth
                  multiline
                  maxRows={1}
                  name='short_description'
                  label='Short Description'
                  required
                  type='text'
                  inputProps={{ maxLength: 50 }}
                  variant='outlined'
                  className='jotify-authtextfield'
                  value={taskShortDescription.value}
                  error={taskShortDescription.error}
                  helperText={
                    taskShortDescription.error && taskShortDescription.message
                  }
                  size={small ? 'small' : 'medium'}
                />
              </Box>
              <Stack
                direction={small ? 'column' : 'row'}
                // sx={{
                //   display: 'flex',
                //   justifyContent: 'space-between',
                //   flexDirection: small ? 'column' : 'row',
                //   alignItems: 'center',
                // }}
                spacing={small ? 1 : 2}
              >
                <FormControl
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: small ? 'min-content' : 'fit-content',
                    //marginBottom: small && '10px',
                  }}
                >
                  <FormLabel
                    sx={{
                      color: '#ffffff',
                      fontSize: small ? '1.0rem' : '1.2rem',
                      marginRight: '20px',
                      minWidth: 'max-content',
                    }}
                  >
                    Due Date:
                  </FormLabel>
                  {small ? (
                    <MobileDatePicker
                      name='due_date'
                      sx={{
                        ...JotifyTextFieldOutlinedStyling,
                        svg: { color: '#ffc000' },
                      }}
                      className='jotify-authtextfield'
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: taskDueDate.error,
                          helperText: taskDueDate.error && taskDueDate.message,
                          size: small ? 'small' : 'medium',
                        },
                      }}
                      {...(type === 'edit'
                        ? {
                            minDate: dayjs(new Date(`${taskDueDate.value}`)),
                            value: dayjs(new Date(`${taskDueDate.value}`)),
                          }
                        : {
                            disablePast: true,
                            value: dayjs(new Date(taskDueDate.value)),
                          })}
                      onChange={(newValue) => taskDueDateHandler(newValue)}
                    />
                  ) : (
                    <DesktopDatePicker
                      name='due_date'
                      sx={{
                        ...JotifyTextFieldOutlinedStyling,
                        svg: { color: '#ffc000' },
                      }}
                      data-cy='Due Date'
                      className='jotify-authtextfield'
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: taskDueDate.error,
                          helperText: taskDueDate.error && taskDueDate.message,
                        },
                      }}
                      {...(type === 'edit'
                        ? {
                            minDate: dayjs(new Date(`${taskDueDate.value}`)),
                            value: dayjs(new Date(`${taskDueDate.value}`)),
                          }
                        : {
                            disablePast: true,
                            value: dayjs(new Date(taskDueDate.value)),
                          })}
                      onChange={(newValue) => taskDueDateHandler(newValue)}
                    />
                  )}
                </FormControl>
                <FormControl
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 'fit-content',
                    marginBottom: small && '10px',
                  }}
                >
                  <FormLabel
                    sx={{
                      color: '#ffffff',
                      fontSize: small ? '1.0rem' : '1.2rem',
                      marginRight: '20px',
                      minWidth: 'max-content',
                    }}
                  >
                    Due Time:
                  </FormLabel>
                  {small ? (
                    <MobileTimePicker
                      name='due_time'
                      format='HH:mm:ss'
                      sx={{
                        ...JotifyTextFieldOutlinedStyling,
                        svg: { color: '#ffc000' },
                      }}
                      className='jotify-authtextfield'
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: taskDueTime.error,
                          helperText: taskDueTime.error && taskDueTime.message,
                          size: small ? 'small' : 'medium',
                        },
                      }}
                      value={dayjs(
                        new Date(`${taskDueDate.value} ${taskDueTime.value}`)
                      )}
                      onChange={(newValue) => taskDueTimeHandler(newValue)}
                    />
                  ) : (
                    <DesktopTimePicker
                      name='due_time'
                      format='HH:mm:ss'
                      ampm={false}
                      data-cy='Due Time'
                      sx={{
                        ...JotifyTextFieldOutlinedStyling,
                        svg: { color: '#ffc000' },
                      }}
                      className='jotify-authtextfield'
                      slotProps={{
                        textField: {
                          variant: 'outlined',
                          error: taskDueTime.error,
                          helperText: taskDueTime.error && taskDueTime.message,
                        },
                      }}
                      value={dayjs(
                        new Date(`${taskDueDate.value} ${taskDueTime.value}`)
                      )}
                      onChange={(newValue) => taskDueTimeHandler(newValue)}
                    />
                  )}
                </FormControl>
              </Stack>
              <Stack direction='row' spacing={small ? 1 : 5}>
                <FormControl
                  sx={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 'fit-content',
                    //marginBottom: small && '10px',
                  }}
                >
                  <FormLabel
                    sx={{
                      color: '#ffffff',
                      fontSize: small ? '1.0rem' : '1.2rem',
                      marginRight: '20px',
                    }}
                  >
                    Priority:
                  </FormLabel>

                  <Select
                    name='priority'
                    value={taskPriority.id}
                    onChange={(e) => handleTaskPrioritySelect(e.target.value)}
                    data-cy='Task Priority'
                    sx={{
                      fontSize: small ? '1.0rem' : 'initial',
                      height: small ? '2.0rem' : 'initial',
                      width: small ? '110px' : '250px',
                      color: '#ffffff',
                    }}
                  >
                    {taskPriorities.map((priority) => (
                      <MenuItem
                        key={priority.id}
                        value={priority.id}
                        data-cyvalue={`${priority.name}`}
                      >
                        {priority.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {type === 'edit' && (
                  <FormControl
                    sx={{
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      height: small ? '100%' : 'inherit',
                      //marginBottom: small && '10px',
                    }}
                  >
                    <FormControlLabel
                      control={
                        <Checkbox
                          name='is_completed'
                          sx={{
                            '& .MuiSvgIcon-root': { fontSize: 28 },
                            paddingTop: 0,
                            paddingBottom: 0,
                          }}
                          inputProps={{
                            'data-testid': 'task-completed',
                          }}
                          checked={taskCompleted}
                          value={taskCompleted}
                          data-cy='Task Completed'
                        />
                      }
                      slotProps={{
                        typography: {
                          fontSize: small ? '1.0rem' : '1.2rem',
                        },
                      }}
                      sx={{
                        height: '100%',
                      }}
                      label='Done:'
                      labelPlacement='start'
                    />
                  </FormControl>
                )}
              </Stack>
              <Box>
                <TextField
                  fullWidth
                  multiline
                  minRows={small ? 4 : 6}
                  name='description'
                  label='Description'
                  required
                  type='text'
                  variant='outlined'
                  inputProps={{ maxLength: 100 }}
                  className='jotify-authtextfield'
                  value={taskDescription.value}
                  error={taskDescription.error}
                  helperText={taskDescription.error && taskDescription.message}
                />
              </Box>
              <Button
                variant='contained'
                type='submit'
                component='button'
                sx={{ maxWidth: '200px', alignSelf: 'center' }}
                disabled={
                  !(
                    taskShortDescription.value &&
                    !taskShortDescription.error &&
                    taskDescription.value &&
                    !taskDescription.error
                  )
                }
              >
                Save Task
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
        </Grid>
      </TaskFormGrid>
    </TaskFormBoxContainer>
  );
};

export default TaskForm;
