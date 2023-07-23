import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import apiClient from '../../apiClient';
import { BrowserRouter, useParams } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Body from './Body';
import Task from './Task';

jest.mock('../../apiClient.js');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const setRedirectToAuth = jest.fn();
const token = 'token';
const currentTab = 'tasks';
const setCurrentTab = jest.fn();
const setToken = jest.fn();

function setISODate(date, days) {
  const dateSet = new Date().setDate(date.getDate() + days);
  return new Date(dateSet).toISOString().split('T')[0];
}

function setTimeString(date, hours) {
  const newHours = date.setHours(date.getHours() + hours);
  return new Date(newHours).toTimeString().split(' ')[0];
}

describe('Display Tasks', () => {
  test('Fetch tasks for tasks tab', async () => {
    const tasksResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: [
        {
          id: 1,
          short_description: 'New Task One',
          task_description: 'Task One Description',
          due_date: setISODate(new Date(), -10),
          due_time: '17:12:33',
          task_completed: true,
          task_priority: 'Low',
        },
        {
          id: 2,
          short_description: 'New Task Two',
          task_description: 'Task Two Description',
          due_date: setISODate(new Date(), -1),
          due_time: '11:12:33',
          task_completed: false,
          task_priority: 'Medium',
        },
        {
          id: 3,
          short_description: 'New Task Three',
          task_description: 'Task Three Description',
          due_date: setISODate(new Date(), 1),
          due_time: '16:12:33',
          task_completed: false,
          task_priority: 'High',
        },
        {
          id: 4,
          short_description: 'New Task Four',
          task_description: 'Task Four Description',
          due_date: setISODate(new Date(), 0),
          due_time: setTimeString(new Date(), 1),
          task_completed: false,
          task_priority: 'Low',
        },
      ],
    });
    apiClient.get.mockImplementationOnce(() => tasksResponsePromise);

    render(
      <BrowserRouter>
        <Body
          setRedirectToAuth={setRedirectToAuth}
          token={token}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
          setToken={setToken}
        />
      </BrowserRouter>
    );

    await act(() => tasksResponsePromise);
    // Scheduled Task
    expect(await screen.findByText(/New Task Three/)).toBeInTheDocument();

    // Today's Tasks
    const toggleTodayButton = await screen.findByRole('button', {
      name: /Today/,
    });
    await userEvent.click(toggleTodayButton);

    expect(await screen.findByText(/New Task Four/)).toBeInTheDocument();

    // Overdue Tasks
    const toggleOverdueButton = await screen.findByRole('button', {
      name: /Overdue/,
    });
    await userEvent.click(toggleOverdueButton);

    expect(await screen.findByText(/New Task Two/)).toBeInTheDocument();

    // Done Tasks
    const toggleDoneButton = await screen.findByRole('button', {
      name: /Done/,
    });
    await userEvent.click(toggleDoneButton);
    expect(await screen.findByText(/New Task One/)).toBeInTheDocument();
    //screen.debug();
  }, 15000);

  test('View task', async () => {
    const taskResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 1,
        short_description: 'New Task One',
        task_description: 'Task One Description',
        due_date: setISODate(new Date(), -10),
        due_time: '17:12:33',
        task_completed: true,
        task_priority: 'Low',
      },
    });

    apiClient.get.mockImplementation(() => taskResponsePromise);
    useParams.mockImplementation(() => {
      return {
        action: 'view',
        id: 1,
      };
    });
    render(
      <BrowserRouter>
        <Task token={token} setToken={setToken} />
      </BrowserRouter>
    );
    await act(() => taskResponsePromise);
    expect(await screen.findByText(/New Task One/)).toBeInTheDocument();
    expect(await screen.findByText(/Task One Description/)).toBeInTheDocument();
    expect(await screen.findByText(/17:12:33/)).toBeInTheDocument();
    expect(await screen.findByText(/Low/)).toBeInTheDocument();
  }, 15000);
  test('Edit task', async () => {
    const taskResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 1,
        short_description: 'New Task One',
        task_description: 'Task One Description',
        due_date: setISODate(new Date(), -10),
        due_time: '17:12:33',
        task_completed: true,
        task_priority: 'Low',
      },
    });

    apiClient.get.mockImplementation(() => taskResponsePromise);
    useParams.mockImplementation(() => {
      return {
        action: 'edit',
        id: 1,
      };
    });
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Task token={token} setToken={setToken} />
        </BrowserRouter>
      </LocalizationProvider>
    );
    await act(() => taskResponsePromise);
    expect(await screen.findByText(/Edit Task/)).toBeInTheDocument();
    expect(await screen.findByDisplayValue(/New Task One/)).toBeInTheDocument();
    expect(
      await screen.findByDisplayValue(/Task One Description/)
    ).toBeInTheDocument();
  }, 15000);
});
