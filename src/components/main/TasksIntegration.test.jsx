import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import apiClient from '../../apiClient';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Main from './Main';
import Task from './Task';

jest.mock('../../apiClient.js');

const setRedirectToAuth = jest.fn();
const setCurrentTab = jest.fn();
const setToken = jest.fn();
const setName = jest.fn();
const setAuthForm = jest.fn();
const deleteFunction = jest.fn();
const authForm = 'login';
const redirectToAuth = false;
const token = 'token';
const currentTab = 'tasks';

function setISODate(date, days) {
  const dateSet = new Date().setDate(date.getDate() + days);
  return new Date(dateSet).toISOString().split('T')[0];
}

function setTimeString(date, hours) {
  const newHours = date.setHours(date.getHours() + hours);
  return new Date(newHours).toTimeString().split(' ')[0];
}

describe('Tasks Integration', () => {
  test('View and Update Task, then Delete', async () => {
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
    const taskResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 3,
        short_description: 'New Task Three',
        task_description: 'Task Three Description',
        due_date: setISODate(new Date(), 1),
        due_time: '16:12:33',
        task_completed: false,
        task_priority: 'High',
      },
    });
    const taskUpdatedResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 3,
        short_description: 'New Task Three',
        task_description: 'Task Three Description',
        due_date: setISODate(new Date(), 1),
        due_time: '16:12:33',
        task_completed: true,
        task_priority: 'High',
      },
    });
    const tasksUpdatedResponsePromise = Promise.resolve({
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
          task_completed: true,
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
    const overdueTaskResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 2,
        short_description: 'New Task Two',
        task_description: 'Task Two Description',
        due_date: setISODate(new Date(), -1),
        due_time: '11:12:33',
        task_completed: false,
        task_priority: 'Medium',
      },
    });
    const overdueTaskRemovedFromTasksPromise = Promise.resolve({
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
          id: 3,
          short_description: 'New Task Three',
          task_description: 'Task Three Description',
          due_date: setISODate(new Date(), 1),
          due_time: '16:12:33',
          task_completed: true,
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
    apiClient.get.mockImplementationOnce(() => taskResponsePromise);
    apiClient.get.mockImplementationOnce(() => taskResponsePromise);
    apiClient.put.mockImplementationOnce(() => taskUpdatedResponsePromise);
    apiClient.get.mockImplementationOnce(() => taskUpdatedResponsePromise);
    apiClient.get.mockImplementationOnce(() => tasksUpdatedResponsePromise);
    apiClient.get.mockImplementationOnce(() => overdueTaskResponsePromise);
    apiClient.delete.mockImplementation(() => deleteFunction());
    apiClient.get.mockImplementationOnce(
      () => overdueTaskRemovedFromTasksPromise
    );
    apiClient.get.mockImplementationOnce(
      () => overdueTaskRemovedFromTasksPromise
    );
    render(
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <BrowserRouter>
          <Routes>
            <Route
              path='/app/task/:action/:id'
              element={<Task token={token} setToken={setToken} />}
            />
            <Route
              path='/app'
              element={
                <Main
                  token={token}
                  currentTab={currentTab}
                  setName={setName}
                  setToken={setToken}
                  setCurrentTab={setCurrentTab}
                  redirectToAuth={redirectToAuth}
                  setRedirectToAuth={setRedirectToAuth}
                  authForm={authForm}
                  setAuthForm={setAuthForm}
                />
              }
            />
          </Routes>
          <Main
            token={token}
            setToken={setToken}
            setName={setName}
            currentTab={currentTab}
            setCurrentTab={setCurrentTab}
            redirectAuth={redirectToAuth}
            setRedirectToAuth={setRedirectToAuth}
            authForm={authForm}
            setAuthForm={setAuthForm}
          />
        </BrowserRouter>
      </LocalizationProvider>
    );

    await act(() => tasksResponsePromise);
    // Scheduled Task
    await waitFor(() => {
      expect(screen.getByText(/New Task Three/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/New Task One/)).not.toBeInTheDocument();
    });

    //Done Task
    let toggleDoneButton = screen.getByRole('button', {
      name: /Done/,
    });
    await userEvent.click(toggleDoneButton);
    await waitFor(() => {
      expect(screen.getByText(/New Task One/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/New Task Three/)).not.toBeInTheDocument();
    });

    // Scheduled
    let toggleScheduledButton = screen.getByRole('button', {
      name: /Scheduled/,
    });
    await userEvent.click(toggleScheduledButton);

    await waitFor(() => {
      expect(screen.getByText(/New Task Three/)).toBeInTheDocument();
    });
    await waitFor(() => {
      expect(screen.queryByText(/No scheduled tasks/)).not.toBeInTheDocument();
    });
    const viewScheduledTask = screen.getByText(/View/);

    await userEvent.click(viewScheduledTask);
    await act(() => taskResponsePromise);

    let shortDescription = screen.getAllByText(/New Task Three/);
    screen.debug(shortDescription[0]);
    await waitFor(() => {
      expect(shortDescription[0]).toBeVisible();
    });
    let taskPending = await screen.findAllByText(/Pending/);
    screen.debug(taskPending[0]);
    expect(taskPending[0]).toBeInTheDocument();

    // Edit task
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    await act(() => taskResponsePromise);

    await waitFor(() => {
      expect(screen.getByDisplayValue(/New Task Three/)).toBeInTheDocument();
    });

    const completedCheckBox = await screen.findByTestId(/task-completed/);
    expect(completedCheckBox).toHaveProperty('checked', false);

    await userEvent.click(completedCheckBox);
    expect(completedCheckBox).toHaveProperty('checked', true);

    // Save Edited Task
    const saveTaskButton = await screen.findByRole('button', {
      name: /Save Task/,
    });
    await userEvent.click(saveTaskButton);
    await act(() => taskUpdatedResponsePromise);
    await act(() => taskUpdatedResponsePromise);

    // View Tasks
    const backButton = await screen.findByRole('button', { name: /back/ });
    await userEvent.click(backButton);
    await act(() => tasksUpdatedResponsePromise);

    await waitFor(() => {
      expect(screen.getByText(/No scheduled tasks/)).toBeInTheDocument();
    });

    let toggleDoneButtons = await screen.findAllByRole('button', {
      name: /Done/,
    });
    await userEvent.click(toggleDoneButtons[0]);

    await waitFor(() => {
      expect(screen.getByText(/New Task One/)).toBeInTheDocument();
    });
    let tables = await screen.findAllByRole('table');
    screen.debug(tables[0]);
    // await waitFor(() => {
    //   expect(screen.getByText(/New Task Three/))
    // });

    let toggleScheduledButtons = await screen.findAllByRole('button', {
      name: /Scheduled/,
    });
    await userEvent.click(toggleScheduledButtons[0]);
    // let heading = await screen.findByRole('heading', {
    //   name: /No scheduled tasks/,
    // });
    // screen.debug(heading);

    expect(await screen.findByText(/No scheduled tasks/)).toBeVisible();

    // Overdue Task
    let overdueButtons = screen.getAllByRole('button', { name: /Overdue/ });

    await userEvent.click(overdueButtons[0]);

    expect(screen.getByText(/New Task Two/)).toBeInTheDocument();
    let viewButtons = screen.getAllByText(/View/);
    await userEvent.click(viewButtons[0]);
    await act(() => overdueTaskResponsePromise);

    expect(screen.getByText(/New Task Two/)).toBeInTheDocument();
    const deleteButton = await screen.findByRole('button', { name: /delete/ });
    await userEvent.click(deleteButton);

    // Delete Overdue Task
    expect(await screen.findByText('Delete Task')).toBeInTheDocument();
    const deleteNoteButton = await screen.findByRole('button', {
      name: /Delete/,
    });
    await userEvent.click(deleteNoteButton);
    expect(deleteFunction).toHaveBeenCalledTimes(1);

    await act(() => overdueTaskRemovedFromTasksPromise);
    await act(() => overdueTaskRemovedFromTasksPromise);

    overdueButtons = await screen.findAllByRole('button', { name: /Overdue/ });

    await userEvent.click(overdueButtons[0]);
    // let tables = await screen.findAllByRole('table');
    // screen.debug(tables[1]);
    await waitFor(() => {
      expect(screen.getByText(/No overdue tasks/)).toBeInTheDocument();
    });
    //screen.debug();
  }, 40000);
});
