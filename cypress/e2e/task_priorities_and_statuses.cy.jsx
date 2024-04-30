/* eslint-disable no-undef */

// Add task for all priorities and statuses
// View all statuses and priorities
// Update status and change priorities

function setISODate(date, days) {
  const dateSet = new Date().setDate(date.getDate() + days);
  return new Date(dateSet).toISOString().split('T')[0];
}

function setTimeString(date, hours) {
  const newHours = date.setHours(date.getHours() + hours);
  return new Date(newHours).toTimeString().split(' ')[0];
}

let allTasks = [
  {
    id: 1,
    short_description: 'New Task One Today',
    task_description: 'Task One Description',
    due_date: setISODate(new Date(), 0),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'Low',
  },
  {
    id: 2,
    short_description: 'New Task Two Today',
    task_description: 'Task Two Description',
    due_date: setISODate(new Date(), 0),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'Medium',
  },
  {
    id: 3,
    short_description: 'New Task Three Today',
    task_description: 'Task Three Description',
    due_date: setISODate(new Date(), 0),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'High',
  },
  {
    id: 4,
    short_description: 'New Task Four Overdue',
    task_description: 'Task Four Description',
    due_date: setISODate(new Date(), -1),
    due_time: '11:12:33',
    task_completed: false,
    task_priority: 'Low',
  },
  {
    id: 5,
    short_description: 'New Task Five Overdue',
    task_description: 'Task Five Description',
    due_date: setISODate(new Date(), -2),
    due_time: '12:12:33',
    task_completed: false,
    task_priority: 'Medium',
  },
  {
    id: 6,
    short_description: 'New Task Six Overdue',
    task_description: 'Task Six Description',
    due_date: setISODate(new Date(), -1),
    due_time: '10:12:33',
    task_completed: false,
    task_priority: 'High',
  },
  {
    id: 7,
    short_description: 'New Task Seven Done',
    task_description: 'Task Seven Description',
    due_date: setISODate(new Date(), 1),
    due_time: '16:12:33',
    task_completed: true,
    task_priority: 'Low',
  },
  {
    id: 8,
    short_description: 'New Task Eight Done',
    task_description: 'Task Eight Description',
    due_date: setISODate(new Date(), -5),
    due_time: setTimeString(new Date(), 1),
    task_completed: true,
    task_priority: 'Medium',
  },
  {
    id: 9,
    short_description: 'New Task Nine Done',
    task_description: 'Task Nine Description',
    due_date: setISODate(new Date(), -5),
    due_time: setTimeString(new Date(), 1),
    task_completed: true,
    task_priority: 'High',
  },
  {
    id: 10,
    short_description: 'New Task Ten Scheduled',
    task_description: 'Task Ten Description',
    due_date: setISODate(new Date(), 5),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'Low',
  },
  {
    id: 11,
    short_description: 'New Task Eleven Scheduled',
    task_description: 'Task Eleven Description',
    due_date: setISODate(new Date(), 1),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'Medium',
  },
  {
    id: 12,
    short_description: 'New Task Twelve Scheduled',
    task_description: 'Task Twelve Description',
    due_date: setISODate(new Date(), 2),
    due_time: setTimeString(new Date(), 1),
    task_completed: false,
    task_priority: 'High',
  },
];

describe('Task Priorities and Statuses', () => {
  beforeEach(() => {
    // Login
    cy.intercept(
      {
        method: 'POST',
        url: `${process.env.REACT_APP_API_BASE_URL}/auth/login/`,
      },
      {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          token: 'token1234567',
          name: 'testuser',
        },
        delayMs: 500,
      }
    ).as('successfulSignIn');
    cy.visit('/');
    cy.findByRole('button', { name: /Login/i }, { timeout: 14000 }).click();

    cy.findByLabelText(/Email/)
      .should('be.visible')
      .type('testuser@emailcom')
      .should('have.value', 'testuser@emailcom');
    cy.findAllByLabelText(/Password/)
      .should('be.visible')
      .type('qp10QP!)wo')
      .should('have.value', 'qp10QP!)wo');

    cy.intercept(
      {
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/notes/all-notes-categories/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_categories.json',
        delayMs: 100,
      }
    ).as('fetchCategories');

    cy.intercept(
      {
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/notes/all/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_notes.json',
        delayMs: 100,
      }
    ).as('fetchNotes');
    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@successfulSignIn');
    cy.writeFile('cypress/fixtures/all_tasks.json', allTasks);

    cy.intercept(
      {
        method: 'GET',
        url: `${process.env.REACT_APP_API_BASE_URL}/tasks/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_tasks.json',
        delayMs: 100,
      }
    ).as('fetchTasks');

    cy.findByRole('tab', { name: /My Tasks/ }, { timeout: 8000 })
      .should('be.visible')
      .click()
      .then(() => {
        cy.wait('@fetchTasks');
      });
  });
  it('Check all Statuses', () => {
    cy.wait(4000);
    cy.get('button[data-cy="today"]').should('be.visible').click();
    cy.contains('No tasks due today.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task One Today').should('be.visible');
    cy.contains('New Task Two Today').should('be.visible');
    cy.contains('New Task Three Today').should('be.visible');

    cy.get('button[data-cy="scheduled"]').should('be.visible').click();
    cy.contains('No scheduled tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Ten Scheduled').should('be.visible');
    cy.contains('New Task Eleven Scheduled').should('be.visible');
    cy.contains('New Task Twelve Scheduled').should('be.visible');

    cy.get('button[data-cy="overdue"]').should('be.visible').click();
    cy.contains('No overdue tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Four Overdue').should('be.visible');
    cy.contains('New Task Five Overdue').should('be.visible');
    cy.contains('New Task Six Overdue').should('be.visible');

    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.contains('No done tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Seven Done').should('be.visible');
    cy.contains('New Task Eight Done').should('be.visible');
    cy.contains('New Task Nine Done').should('be.visible');
  });
  it('View tasks based on priorities', () => {
    cy.wait(4000);

    // Low
    cy.get('[data-cy="tasks-priority"]').click();
    cy.get('[data-cyvalue="Low"]').should('be.visible').click();

    cy.get('button[data-cy="today"]').should('be.visible').click();
    cy.contains('No tasks due today.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task One Today').should('be.visible');
    cy.contains('New Task Two Today').should('not.exist');
    cy.contains('New Task Three Today').should('not.exist');

    cy.get('button[data-cy="scheduled"]').should('be.visible').click();
    cy.contains('No scheduled tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Ten Scheduled').should('be.visible');
    cy.contains('New Task Eleven Scheduled').should('not.exist');
    cy.contains('New Task Twelve Scheduled').should('not.exist');

    cy.get('button[data-cy="overdue"]').should('be.visible').click();
    cy.contains('No overdue tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Four Overdue').should('be.visible');
    cy.contains('New Task Five Overdue').should('not.exist');
    cy.contains('New Task Six Overdue').should('not.exist');

    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.contains('No done tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Seven Done').should('be.visible');
    cy.contains('New Task Eight Done').should('not.exist');
    cy.contains('New Task Nine Done').should('not.exist');

    // Medium
    cy.get('[data-cy="tasks-priority"]').click();
    cy.get('[data-cyvalue="Medium"]').should('be.visible').click();

    cy.get('button[data-cy="today"]').should('be.visible').click();
    cy.contains('No tasks due today.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task One Today').should('not.exist');
    cy.contains('New Task Two Today').should('be.visible');
    cy.contains('New Task Three Today').should('not.exist');

    cy.get('button[data-cy="scheduled"]').should('be.visible').click();
    cy.contains('No scheduled tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Ten Scheduled').should('not.exist');
    cy.contains('New Task Eleven Scheduled').should('be.visible');
    cy.contains('New Task Twelve Scheduled').should('not.exist');

    cy.get('button[data-cy="overdue"]').should('be.visible').click();
    cy.contains('No overdue tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Four Overdue').should('not.exist');
    cy.contains('New Task Five Overdue').should('be.visible');
    cy.contains('New Task Six Overdue').should('not.exist');

    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.contains('No done tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Seven Done').should('not.exist');
    cy.contains('New Task Eight Done').should('be.visible');
    cy.contains('New Task Nine Done').should('not.exist');

    // High
    cy.get('[data-cy="tasks-priority"]').click();
    cy.get('[data-cyvalue="High"]').should('be.visible').click();

    cy.get('button[data-cy="today"]').should('be.visible').click();
    cy.contains('No tasks due today.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task One Today').should('not.exist');
    cy.contains('New Task Two Today').should('not.exist');
    cy.contains('New Task Three Today').should('be.visible');

    cy.get('button[data-cy="scheduled"]').should('be.visible').click();
    cy.contains('No scheduled tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Ten Scheduled').should('not.exist');
    cy.contains('New Task Eleven Scheduled').should('not.exist');
    cy.contains('New Task Twelve Scheduled').should('be.visible');

    cy.get('button[data-cy="overdue"]').should('be.visible').click();
    cy.contains('No overdue tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Four Overdue').should('not.exist');
    cy.contains('New Task Five Overdue').should('not.exist');
    cy.contains('New Task Six Overdue').should('be.visible');

    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.contains('No done tasks.').should('not.exist');
    cy.findByRole('link', { name: /Add Task/ }).should('not.exist');
    cy.contains('New Task Seven Done').should('not.exist');
    cy.contains('New Task Eight Done').should('not.exist');
    cy.contains('New Task Nine Done').should('be.visible');
  });
});
