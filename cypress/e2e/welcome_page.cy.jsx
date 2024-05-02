/* eslint-disable no-undef */

describe('Welcome Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('load welcome page', () => {
    cy.contains('Keep Track', { timeout: 9000 }).should('be.visible');
    cy.contains('Keep Notes', { timeout: 9000 }).should('be.visible');
    cy.contains('Stay Organized', { timeout: 9000 }).should('be.visible');
    cy.contains('Save short notes and to-do lists with Jotify', {
      timeout: 9000,
    }).should('be.visible');
    cy.findByRole('button', { name: /Learn More/i }, { timeout: 9000 }).click();
    cy.contains('The Goodies', {
      timeout: 9000,
    }).should('be.visible');
    cy.findByRole('button', { name: /Create Account/i })
      .scrollIntoView()
      .should('be.visible');
    cy.get('[data-testid="KeyboardDoubleArrowUpIcon"]').click();
    cy.findByRole('button', { name: /Login/i }, { timeout: 5000 }).should(
      'be.visible'
    );
    cy.findByRole('button', { name: /Register/i }).should('be.visible');
  });
  it('Register new user', () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/auth/signup/`,
      },
      {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          error: 'Email already exists!',
        },
        delayMs: 500,
      }
    ).as('failedSignup');

    cy.findByRole('button', { name: /Register/i }, { timeout: 10000 }).click();
    cy.findByRole('button', { name: /Register Account/i }).should(
      'be.disabled'
    );
    cy.findByLabelText(/Name/)
      .should('be.visible')
      .type('testuser')
      .should('have.value', 'testuser');
    cy.findByLabelText(/Email/)
      .should('be.visible')
      .type('testuser@emailcom')
      .should('have.value', 'testuser@emailcom');
    cy.contains('Please provide a valid email!').should('be.visible');
    cy.findByLabelText(/Email/)
      .should('be.visible')
      .clear()
      .type('testuser@email.com')
      .should('have.value', 'testuser@email.com');
    cy.contains('Please provide a valid email!').should('not.exist');
    cy.findAllByLabelText(/Password/)
      .first()
      .should('be.visible')
      .type('33333333333')
      .should('have.value', '33333333333');
    cy.contains(
      'Please provide a password with between 7 to 15 characters containing at least one numeric digit and a special character!'
    ).should('be.visible');
    cy.findAllByLabelText(/Password/)
      .first()
      .should('be.visible')
      .clear()
      .type('qp10QP!)wo')
      .should('have.value', 'qp10QP!)wo');
    cy.contains(
      'Please provide a password with between 7 to 15 characters containing at least one numeric digit and a special character!'
    ).should('not.exist');
    cy.findAllByLabelText(/Password/)
      .last()
      .should('be.visible')
      .type('qp10QP!)')
      .should('have.value', 'qp10QP!)');
    cy.contains("Passwords don't match!").should('be.visible');
    cy.findAllByLabelText(/Password/)
      .last()
      .should('be.visible')
      .type('wo')
      .should('have.value', 'qp10QP!)wo');
    cy.contains("Passwords don't match!").should('not.exist');
    cy.findByRole('button', { name: /Register Account/i })
      .should('not.be.disabled')
      .click();
    cy.wait('@failedSignup');
    cy.contains('Email already exists!').should('be.visible');
    cy.intercept(
      {
        method: 'POST',
        url: `/auth/signup/`,
      },
      {
        statusCode: 201,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          token: 'token1234567',
        },
      }
    ).as('successfulSignup');

    cy.findByLabelText(/Email/)
      .should('be.visible')
      .clear()
      .type('testuser@email.com')
      .should('have.value', 'testuser@email.com');
    cy.contains('Email already exists!').should('not.exist');
    cy.findByRole('button', { name: /Register Account/i })
      .should('not.be.disabled')
      .click();
    cy.wait('@successfulSignup');
    cy.findByRole('button', { name: /Sign In/i }, { timeout: 5000 }).should(
      'be.visible'
    );
  });
  it('Login User', () => {
    cy.intercept(
      {
        method: 'POST',
        url: `/auth/login/`,
      },
      {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: {
          error: 'Unable to login. Incorrect username and/or password.',
        },
        delayMs: 500,
      }
    ).as('failedSignIn');

    cy.findByRole('button', { name: /Login/i }, { timeout: 10000 }).click();
    cy.findByRole('button', { name: /Sign In/i }).should('be.disabled');
    cy.findByLabelText(/Email/)
      .should('be.visible')
      .type('testuser@emailcom')
      .should('have.value', 'testuser@emailcom');
    cy.findAllByLabelText(/Password/)
      .should('be.visible')
      .type('qp10QP!)wo')
      .should('have.value', 'qp10QP!)wo');
    cy.contains('Unable to login. Incorrect username and/or password.').should(
      'not.exist'
    );
    cy.findByRole('button', { name: /Sign In/i }).should('not.be.disabled');
    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@failedSignIn');
    cy.contains('Unable to login. Incorrect username and/or password.').should(
      'be.visible'
    );
    cy.findByRole('button', { name: /Sign In/i }).should('be.disabled');

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

    cy.findByLabelText(/Email/)
      .should('be.visible')
      .clear()
      .type('testuser@emailcom')
      .should('have.value', 'testuser@emailcom');
    cy.contains('Unable to login. Incorrect username and/or password.').should(
      'not.exist'
    );
    cy.findByRole('button', { name: /Sign In/i }).should('not.be.disabled');
    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@successfulSignIn');
    cy.wait(8000);
  });
});
