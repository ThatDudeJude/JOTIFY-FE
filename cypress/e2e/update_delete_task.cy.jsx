/* eslint-disable no-undef */

// Fetch tasks
// View task
// Update task
// View Updated task
// View in main tab

let savedTask;

const taskPriorities = [
  { id: 'LOW', name: 'Low' },
  { id: 'MEDIUM', name: 'Medium' },
  { id: 'HIGH', name: 'High' },
];
let allTasks = [];

describe('Update and Delete Task', () => {
  beforeEach(() => {
    // Login
    cy.intercept(
      {
        method: 'POST',
        url: `/auth/login/`,
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
        url: `/notes/all-notes-categories/`,
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
        url: `/notes/all/`,
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

    cy.readFile('cypress/fixtures/first_task.json').then((task) => {
      savedTask = {
        id: task.id,
        short_description: task.short_description,
        task_description: task.task_description,
        due_date: task.due_date,
        due_time: task.due_time,
        task_completed: task.task_completed,
        task_priority: task.task_priority,
      };
      //   allTasks.push(savedTask);
      //   cy.writeFile('cypress/fixtures/all_new_tasks.json', allTasks);
    });
    // cy.writeFile('cypress/fixtures/all_new_tasks.json', allTasks);
  });
  it('Update Task', () => {
    cy.wait(4000);
    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_new_tasks.json',
        delayMs: 100,
      }
    ).as('fetchNewTasks');

    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/task/1`,
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

    cy.findByRole('tab', { name: /My Tasks/ }, { timeout: 8000 })
      .should('be.visible')
      .click();
    cy.wait('@fetchNewTasks');

    cy.findByRole('link', { name: /View/ }, { timeout: 8000 })
      .should('be.visible')
      .click();
    cy.wait('@fetchTask');

    cy.contains(savedTask.short_description).should('be.visible');
    cy.contains(savedTask.task_completed ? 'DONE' : 'Pending').should(
      'be.visible'
    );
    cy.contains(savedTask.task_description).should('be.visible');
    cy.contains(new Date(savedTask.due_date).toLocaleDateString()).should(
      'be.visible'
    );
    cy.contains(savedTask.due_time).should('be.visible');

    cy.findByRole('button', { name: 'edit' }).should('be.visible');

    cy.findByRole('button', { name: 'edit' }).click();

    cy.wait('@fetchTask');

    cy.findByLabelText(/Short Description/)
      .should('be.visible')
      .type(' (Updated)')
      .should('have.value', `${savedTask.short_description} (Updated)`)
      .then(() => {
        savedTask.short_description = `${savedTask.short_description} (Updated)`;
      });

    cy.findByLabelText(/^Description/)
      .should('be.visible')
      .type(' updated to Done.')
      .should('have.value', `${savedTask.task_description} updated to Done.`)
      .then(() => {
        savedTask.task_description = `${savedTask.task_description} updated to Done.`;
      });

    cy.get("[data-testid='CalendarIcon']").click();
    cy.findByRole('gridcell', { name: /27/ }).click();

    cy.get("[type='text']")
      .first()
      .invoke('val')
      .then((text) => {
        let [month, day, year] = text.split('/');
        savedTask.due_date = `${year}-${month}-${day}`;
      });

    cy.get("[type='text']")
      .last()
      .invoke('val')
      .then((text) => {
        savedTask.due_time = text;
      });

    cy.get('[data-cy="Task Priority"]')
      .should('contain', savedTask.task_priority)
      .click();
    cy.get('[data-cyvalue="High"]').should('be.visible').click();
    cy.get('input[name="priority"]')
      .invoke('val')
      .then((text) => {
        savedTask.task_priority = taskPriorities.filter(
          (task) => task.id === text
        )[0].name;
      });

    cy.get('[data-testid="task-completed"]')
      .click()
      .invoke('val')
      .then((val) => {
        savedTask.task_completed = val === 'true';
      });

    cy.findByRole('button', { name: /Save Task/ })
      .should('not.be.disabled')
      .then(() => {
        allTasks.pop();
        allTasks.push(savedTask);
        cy.writeFile('cypress/fixtures/updated_first_task.json', savedTask);
        cy.writeFile('cypress/fixtures/all_new_tasks.json', allTasks);
      });

    cy.intercept(
      {
        method: 'PUT',
        url: `/tasks/task/${savedTask.id}`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: { id: savedTask.id },
        delayMs: 100,
      }
    ).as('updateTask');

    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/task/${savedTask.id}`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'updated_first_task.json',
        delayMs: 100,
      }
    ).as('fetchTask');

    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_new_tasks.json',
        delayMs: 100,
      }
    ).as('fetchUpdatedTasks');

    cy.findByRole('button', { name: /Save Task/ }).click();
    cy.wait('@updateTask');
    cy.wait('@fetchTask').then(() => {
      cy.contains(savedTask.short_description).should('be.visible');
      cy.contains(savedTask.task_completed ? 'Done' : 'Pending').should(
        'be.visible'
      );
      cy.contains(savedTask.task_description).should('be.visible');
      cy.contains(new Date(savedTask.due_date).toLocaleDateString()).should(
        'be.visible'
      );
      cy.contains(savedTask.due_time).should('be.visible');
      cy.contains(savedTask.task_priority).should('be.visible');
    });

    // cy.intercept(
    //   {
    //     method: 'GET',
    //     url: `/tasks/`,
    //   },
    //   {
    //     statusCode: 200,
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     fixture: 'all_new_tasks.json',
    //     delayMs: 100,
    //   }
    // ).as('fetchUpdatedTasks');

    cy.findByRole('button', { name: 'back' }).should('be.visible');
    cy.findByRole('button', { name: 'back' }).click();
    cy.wait('@fetchUpdatedTasks');

    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');
    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.get("[data-testid='KeyboardArrowDownIcon']")
      .should('be.visible')
      .click()
      .then(() => {
        cy.contains(savedTask.short_description).should('be.visible');
        cy.contains(savedTask.task_completed ? 'Done' : 'Pending').should(
          'be.visible'
        );
        cy.contains(savedTask.task_description).should('be.visible');
        cy.contains(new Date(savedTask.due_date).toLocaleDateString()).should(
          'be.visible'
        );
        cy.contains(savedTask.due_time).should('be.visible');
      });
  });
  it('Delete Task', () => {
    cy.wait(4000);
    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_new_tasks.json',
        delayMs: 100,
      }
    ).as('fetchNewTasks');

    cy.intercept(
      {
        method: 'GET',
        url: `/tasks/task/1`,
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

    cy.findByRole('tab', { name: /My Tasks/ }, { timeout: 8000 }).should(
      'be.visible'
    );
    cy.findByRole('tab', { name: /My Tasks/ }).click();
    cy.wait('@fetchNewTasks');

    cy.findByRole('link', { name: /View/ }, { timeout: 8000 }).should(
      'be.visible'
    );
    cy.findByRole('link', { name: /View/ }).click();
    cy.wait('@fetchTask');

    cy.contains(savedTask.short_description).should('be.visible');
    cy.contains(savedTask.task_completed ? 'DONE' : 'Pending').should(
      'be.visible'
    );
    cy.contains(savedTask.task_description).should('be.visible');
    cy.contains(new Date(savedTask.due_date).toLocaleDateString()).should(
      'be.visible'
    );
    cy.contains(savedTask.due_time).should('be.visible');

    cy.findByRole('button', { name: 'delete' }).should('be.visible');

    cy.findByRole('button', { name: 'delete' }).click();

    cy.contains('Delete Task').should('be.visible');
    cy.contains(`Delete "${savedTask.short_description}"`).should('be.visible');
    cy.findByRole('button', { name: /Confirm Delete/ }).should('be.visible');

    cy.intercept(
      {
        method: 'DELETE',
        url: `/tasks/task/${savedTask.id}`,
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        delayMs: 100,
      }
    ).as('deleteNote');

    cy.intercept(
      {
        method: 'GET',
        url: '/tasks/',
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: [],
        delayMs: 100,
      }
    ).as('fetchNewTasks');

    cy.findByRole('button', { name: /Confirm Delete/ }).click();
    cy.wait('@deleteNote');
    cy.wait('@fetchNewTasks');

    cy.get('button[data-cy="today"]').should('be.visible').click();
    cy.contains('No tasks due today.').should('be.visible');
    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');

    cy.get('button[data-cy="scheduled"]').should('be.visible').click();
    cy.contains('No scheduled tasks.').should('be.visible');
    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');

    cy.get('button[data-cy="overdue"]').should('be.visible').click();
    cy.contains('No overdue tasks.').should('be.visible');
    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');

    cy.get('button[data-cy="done"]').should('be.visible').click();
    cy.contains('No done tasks.').should('be.visible');
    cy.findByRole('link', { name: /Add Task/ }).should('be.visible');
  });
});
