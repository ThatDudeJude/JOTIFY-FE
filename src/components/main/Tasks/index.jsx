import React from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import { styled as muistyled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import TaskTableLarge from '../TaskTableLarge';
import TaskTableSmall from '../TaskTableSmall';
import { PlaylistAdd, PlaylistAddCircle } from '@mui/icons-material';
import { Link } from 'react-router-dom';

// Style

const TasksBox = muistyled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  padding: '0.5rem',
  maxHeight: `calc((${window.innerHeight}px * ${
    window.innerHeight < 741 ? 0.0021 : 0.0024
  }) * 220)`,
  width: '100%',
  overflowY: 'hidden',
  overflowX: 'hidden',
  flexWrap: 'wrap',
  justifyContent: 'space-evenly',
  //   '&::-webkit-scrollbar': {
  //     display: 'none',
  //   },
}));

const AddTaskBox = muistyled(Box)(({ theme }) => ({
  position: 'fixed',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  bottom: '30px',
  right: '20px',
  width: 'fit-content',
  height: '60px',
  padding: '0.5rem 4px',
  borderRadius: '30px',
  backgroundColor: '#2d0132',
}));

// Utilities

const allTaskPriorities = { LOW: 'Low', MEDIUM: 'Medium', HIGH: 'High' };

const countTasks = (allTasks, priority) => {
  if (priority !== 'ALL')
    allTasks = allTasks.filter(
      (task) => task.task_priority === allTaskPriorities[priority]
    );
  const counts = { done: 0, today: 0, scheduled: 0, overdue: 0 };
  const groups = {
    doneTasks: [],
    todaysTasks: [],
    scheduledTasks: [],
    overdueTasks: [],
  };

  allTasks.forEach((task) => {
    if (task.task_completed) {
      counts.done += 1;
      groups.doneTasks.push(task);
    } else {
      const dueDate = task.due_date.split('-');
      const dueTime = task.due_time.split(':');
      const taskDue = new Date(
        dueDate[0],
        dueDate[1] - 1,
        dueDate[2],
        dueTime[0],
        dueTime[1],
        dueTime[2]
      );
      const taskDueDate = taskDue.toLocaleDateString();
      const taskDueTime = taskDue.toLocaleTimeString();
      if (taskDueDate === new Date().toLocaleDateString()) {
        counts.today += 1;
        groups.todaysTasks.push(task);

        if (taskDueTime < new Date().toLocaleTimeString()) {
          counts.overdue += 1;
          groups.overdueTasks.push(task);
        }
      } else if (taskDue > new Date()) {
        counts.scheduled += 1;
        groups.scheduledTasks.push(task);
      } else {
        counts.overdue += 1;
        groups.overdueTasks.push(task);
      }
    }
  });
  return [counts, groups];
};

const Tasks = ({ allTasks, taskPriorities }) => {
  const allTasksRef = React.useRef(allTasks);
  const [filteredTasks, setFilteredTasks] = React.useState([]);
  const small = useMediaQuery('(max-width: 600px)');
  const [counts, setCounts] = React.useState({
    done: 0,
    today: 0,
    scheduled: 0,
    overdue: 0,
  });
  const [toggleValue, setToggleValue] = React.useState('scheduled');
  const [priority, setPriority] = React.useState('ALL');
  const [hideAddTaskButton, setHideAddTaskButton] = React.useState(true);

  React.useEffect(() => {
    let tasks = allTasksRef.current;
    let [counted, grouped] = countTasks(tasks, priority);
    setCounts({ ...counts, ...counted });
    if (toggleValue === 'scheduled') {
      // console.log('scheduled', counted);
      setFilteredTasks(grouped.scheduledTasks);
    } else if (toggleValue === 'today') {
      setFilteredTasks(grouped.todaysTasks);
    } else if (toggleValue === 'overdue') {
      setFilteredTasks(grouped.overdueTasks);
    } else if (toggleValue === 'done') {
      setFilteredTasks(grouped.doneTasks);
    }
    allTasksRef.current = allTasks;
  }, [toggleValue, priority]);

  //   handlers
  const handleToggleButtonClick = (e) => {
    setToggleValue(e.target.value);
  };
  const taskPrioritySelectHandler = (e) => {
    setPriority(e.target.value);
  };

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              alignItems: 'center',
            }}
          >
            <FormControl
              sx={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: '10px',
              }}
            >
              <FormLabel
                sx={{
                  color: '#ffffff',
                  fontSize: small ? '1.0rem' : '1.5rem',
                  marginRight: '20px',
                }}
              >
                Task Priority:
              </FormLabel>
              <Select
                value={priority}
                sx={{ fontSize: small && '1.0rem', height: '2.5rem' }}
                onChange={(e) => taskPrioritySelectHandler(e)}
              >
                {taskPriorities.map((priority) => (
                  <MenuItem key={priority.id} value={priority.id}>
                    {priority.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ width: 'min-content' }}>
              <ToggleButtonGroup
                color='primary'
                value={toggleValue}
                exclusive
                fullWidth={!small}
                size={small ? 'small' : 'medium'}
                // orientation={small ? 'vertical' : 'horizontal'}
                //</Box>{...(small
                // ? { sx: { flexWrap: 'wrap', flexDirection: 'row' } }
                // : {})}
                // onChange={}
                aria-label='Task Updates'
              >
                <ToggleButton
                  value='today'
                  //disabled={counts.today === 0}
                  onClick={(e) => handleToggleButtonClick(e)}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  Today ({counts.today})
                </ToggleButton>
                <ToggleButton
                  value='scheduled'
                  //disabled={counts.scheduled === 0}
                  onClick={(e) => handleToggleButtonClick(e)}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  Scheduled ({counts.scheduled})
                </ToggleButton>
                <ToggleButton
                  value='overdue'
                  //disabled={counts.overdue === 0}
                  onClick={(e) => handleToggleButtonClick(e)}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  Overdue ({counts.overdue})
                </ToggleButton>
                <ToggleButton
                  value='done'
                  //disabled={counts.done === 0}
                  onClick={(e) => handleToggleButtonClick(e)}
                  sx={{
                    whiteSpace: 'nowrap',
                  }}
                >
                  Done ({counts.done})
                </ToggleButton>
              </ToggleButtonGroup>
            </Box>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <TasksBox>
            {filteredTasks.length ? (
              small ? (
                <TaskTableSmall allTasks={filteredTasks} priority={priority} />
              ) : (
                <TaskTableLarge allTasks={filteredTasks} />
              )
            ) : (
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
                      {toggleValue === 'today' && 'No tasks due today.'}
                      {toggleValue === 'scheduled' && 'No scheduled tasks.'}
                      {toggleValue === 'overdue' && 'No overdue tasks.'}
                      {toggleValue === 'done' && 'No done tasks.'}
                    </Typography>
                  </Box>
                  <Box>
                    <Button
                      variant='contained'
                      component={Link}
                      to={`/app/task/new`}
                    >
                      Add Task
                    </Button>
                  </Box>
                </Stack>
              </Box>
            )}
          </TasksBox>
        </Grid>
      </Grid>
      {filteredTasks && (
        <AddTaskBox
          onMouseEnter={() => setHideAddTaskButton(false)}
          onMouseLeave={() => setHideAddTaskButton(true)}
        >
          {hideAddTaskButton ? (
            <PlaylistAddCircle
              sx={{ fontSize: '50px', color: '#ffc000', width: '50px' }}
            />
          ) : (
            <Button
              variant='text'
              sx={{ fontWeight: '800', margin: '0px 10px' }}
              component={Link}
              to={`/app/task/new`}
            >
              <PlaylistAdd
                sx={{ fontSize: '3rem', color: '#ffc000', width: '50px' }}
              />
              Add Task{' '}
            </Button>
          )}
        </AddTaskBox>
      )}
    </>
  );
};

export default Tasks;
