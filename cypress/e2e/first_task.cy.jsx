/* eslint-disable no-undef */
// First Task
// Create Task
// View Task
//  View in table

let allTasks = [];
const taskPriorities = [
  { id: 'LOW', name: 'Low' },
  { id: 'MEDIUM', name: 'Medium' },
  { id: 'HIGH', name: 'High' },
];

describe('New Note Test', () => {
  beforeEach(() => {
    // Login
    cy.intercept(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/auth/login/',
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
  });
  it('Create and View Task', () => {
    // Fetch Notes
    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/notes/all-notes-categories/',
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
        url: 'http://127.0.0.1:8000/api/v1/notes/all/',
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

    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/tasks/',
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: [],
        delayMs: 100,
      }
    ).as('fetchTasks');
    cy.findByRole('tab', { name: /My Tasks/ }, { timeout: 8000 })
      .should('be.visible')
      .click();
    cy.wait('@fetchTasks');

    // Add Task
    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');
    cy.findByRole('link', { name: /Add Task/ }).click();
    // View Form

    cy.contains('New Task').should('be.visible');
    cy.findByRole('button', { name: /Save Task/ }).should('be.disabled');

    let firstTask = {
      id: 1,
      short_description: 'First Test Task',
      task_description: 'First Test Task Description',
      due_date: undefined,
      due_time: undefined,
      task_completed: false,
      task_priority: undefined,
    };
    cy.findByLabelText(/Short Description/)
      .should('be.visible')
      .clear()
      .type(firstTask.short_description)
      .should('have.value', firstTask.short_description);

    cy.findByLabelText(/^Description/)
      .should('be.visible')
      .clear()
      .type(firstTask.task_description)
      .should('have.value', firstTask.task_description);

    cy.get("[data-testid='CalendarIcon']").click();
    cy.get("[data-testid='ArrowRightIcon").click();
    cy.findByRole('gridcell', { name: /25/ }).click();
    cy.get("[data-testid='ClockIcon']").click();
    cy.findByRole('button', { name: /OK/ }).click();

    cy.get("[type='text']")
      .first()
      .invoke('val')
      .then((text) => {
        let [month, day, year] = text.split('/');
        firstTask.due_date = `${year}-${month}-${day}`;
      });

    cy.get("[type='text']")
      .last()
      .invoke('val')
      .then((text) => {
        firstTask.due_time = text;
      });

    cy.get('[data-cy="Task Priority"]').should('contain', 'Low').click();
    cy.get('[data-cyvalue="Medium"]').should('be.visible').click();
    cy.get('input[name="priority"]')
      .invoke('val')
      .then((text) => {
        firstTask.task_priority = taskPriorities.filter(
          (task) => task.id === text
        )[0].name;
      });

    cy.findByRole('button', { name: /Save Task/ })
      .should('not.be.disabled')
      .then(() => {
        cy.writeFile('cypress/fixtures/first_task.json', firstTask);
      });

    cy.intercept(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/tasks/',
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { id: firstTask.id },
        delayMs: 100,
      }
    ).as('createTask');

    cy.intercept(
      {
        method: 'GET',
        url: `http://127.0.0.1:8000/api/v1/tasks/task/${firstTask.id}`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'first_task.json',
        delayMs: 100,
      }
    ).as('fetchTask');

    cy.findByRole('button', { name: /Save Task/ }).click();
    cy.wait('@createTask');
    cy.wait('@fetchTask').then(() => {
      cy.contains(firstTask.short_description).should('be.visible');
      cy.contains(firstTask.task_completed ? 'Done' : 'Pending').should(
        'be.visible'
      );
      cy.contains(firstTask.task_description).should('be.visible');
      cy.contains(new Date(firstTask.due_date).toLocaleDateString()).should(
        'be.visible'
      );
      cy.contains(firstTask.due_time).should('be.visible');
      cy.contains(firstTask.task_priority).should('be.visible');

      allTasks.push(firstTask);
      cy.writeFile('cypress/fixtures/all_tasks.json', allTasks);
    });

    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/tasks/',
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_tasks.json',
        delayMs: 100,
      }
    ).as('fetchUpdatedTasks');

    cy.findByRole('button', { name: 'back' }).should('be.visible');
    cy.findByRole('button', { name: 'back' }).click();
    cy.wait('@fetchUpdatedTasks');
    cy.wait(10000);

    cy.get("[data-testid='KeyboardArrowDownIcon']")
      .should('be.visible')
      .click()
      .then(() => {
        cy.contains(firstTask.short_description).should('be.visible');
        cy.contains(firstTask.task_completed ? 'Done' : 'Pending').should(
          'be.visible'
        );
        cy.contains(firstTask.task_description).should('be.visible');
        cy.contains(new Date(firstTask.due_date).toLocaleDateString()).should(
          'be.visible'
        );
        cy.contains(firstTask.due_time).should('be.visible');
      });
  });
});
