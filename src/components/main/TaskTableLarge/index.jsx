import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import Paper from '@mui/material/Paper';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';

// Styling
let taskTableLarge = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  maxHeight: `calc((${window.innerHeight}px * ${
    window.innerHeight < 741 ? 0.0021 : 0.0024
  }) * 220)`,
  overflowY: 'auto',
};

const TaskTableLarge = ({ allTasks }) => {
  const mid = useMediaQuery('(max-width: 1100px)');

  taskTableLarge = {
    ...taskTableLarge,
    width: mid ? '100%' : '75%',
  };
  const [openRow, setOpenRow] = React.useState(-1);
  return (
    <>
      <TableContainer component={Paper} sx={taskTableLarge}>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell
                scope='header'
                sx={{ width: '30px', padding: '10px' }}
              ></TableCell>
              <TableCell scope='header'>Task Name</TableCell>
              <TableCell scope='header' align='center'>
                Task Priority
              </TableCell>
              <TableCell scope='header' align='center'>
                Task Status
              </TableCell>
              <TableCell
                scope='header'
                sx={{ width: '100px', padding: '10px' }}
              ></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTasks.map((task) => (
              <React.Fragment key={task.id}>
                <TableRow key={task.id}>
                  <TableCell scope='row' align='left'>
                    <IconButton
                      aria-label='expand-row'
                      size='small'
                      onClick={() =>
                        setOpenRow(openRow === task.id ? -1 : task.id)
                      }
                      sx={{ color: '#ffc000' }}
                    >
                      {openRow === task.id ? (
                        <KeyboardArrowUp />
                      ) : (
                        <KeyboardArrowDown />
                      )}
                    </IconButton>
                  </TableCell>
                  <TableCell scope='row' align='left'>
                    {task.short_description}
                  </TableCell>
                  <TableCell scope='row' align='center'>
                    {task.task_priority}
                  </TableCell>
                  <TableCell scope='row' align='center'>
                    {task.task_completed === false ? 'Pending' : 'Done'}
                  </TableCell>
                  <TableCell scope='row'>
                    <Button
                      variant='transparent'
                      sx={{ fontSize: '0.7rem' }}
                      component={Link}
                      to={`/app/task/view/${task.id}`}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow key={`${task.id}${task.id}`}>
                  <TableCell
                    colSpan={5}
                    sx={{ paddingBottom: 0, paddingTop: 0, border: '0px' }}
                  >
                    <Collapse
                      in={openRow === task.id}
                      timeout='auto'
                      unmountOnExit
                    >
                      <Table sx={{ background: '#222222' }}>
                        <TableHead>
                          <TableRow>
                            <TableCell scope='inner-header'>
                              Task Description
                            </TableCell>
                            <TableCell scope='inner-header'>Due Date</TableCell>
                            <TableCell scope='inner-header'>Due Time</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          <TableRow>
                            <TableCell scope='row'>
                              {task.task_description}
                            </TableCell>
                            <TableCell scope='row'>
                              {new Date(task.due_date).toLocaleDateString()}
                            </TableCell>
                            <TableCell scope='row'>{task.due_time}</TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default TaskTableLarge;
