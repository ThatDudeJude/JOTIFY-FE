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
import { Link, useNavigate } from 'react-router-dom';
import useMediaQuery from '@mui/material/useMediaQuery';

// Styling
let taskTableSmallStyle = {
  backgroundColor: 'transparent',
  color: '#ffffff',
  maxHeight: `calc((${window.innerHeight}px * ${
    window.innerHeight < 741 ? 0.0021 : 0.0024
  }) * 220)`,
  overflowY: 'auto',
};

const taskTableRow = {
  '&.MuiTableRow-hover:hover': {
    backgroundColor: '#ffc00055',
    color: '#777777',
    cursor: 'pointer',
  },
};

const TaskTableSmall = ({ allTasks, priority }) => {
  const navigate = useNavigate();

  return (
    <>
      <TableContainer component={Paper} sx={taskTableSmallStyle}>
        <Table stickyHeader={true}>
          <TableHead>
            <TableRow>
              <TableCell scope='header'>Name</TableCell>
              <TableCell scope='header' align='center'>
                {priority === 'ALL' ? 'Priority' : 'Description'}
              </TableCell>
              <TableCell
                scope='header'
                align={priority === 'ALL' ? 'center' : 'right'}
              >
                Due
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {allTasks.map((task) => (
              <React.Fragment key={task.id}>
                <TableRow
                  key={task.id}
                  sx={taskTableRow}
                  hover={true}
                  onClick={() => navigate(`/app/task/view/${task.id}`)}
                >
                  <TableCell scope='row' align='left'>
                    {task.short_description}
                  </TableCell>
                  <TableCell
                    scope='row'
                    align={priority === 'ALL' ? 'center' : 'left'}
                  >
                    {priority === 'ALL'
                      ? task.task_priority
                      : task.task_description}
                  </TableCell>
                  <TableCell
                    scope='row'
                    align={priority === 'ALL' ? 'center' : 'right'}
                  >
                    {new Date(task.due_date).toLocaleDateString()}
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

export default TaskTableSmall;
