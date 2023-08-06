/* eslint-disable no-undef */

// No Notes
// Create Note  {new_note}
// Save, View  {user_notes}

describe('New Note Test', () => {
  it('Create First Note', () => {
    let currentNote = {
      id: 1,
      note_title: 'First Quick Note',
      note_category: { id: 1, name: 'Quick Note' },
      note_body: 'This is the first Quick Note of the end-to-end test.',
      time_modified: new Date().toISOString(),
    };
    const quickNotes = [];
    const categorizedNotes = [];
    let allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
    const allCategories = {
      all_user_note_types: [{ id: 1, category: 'Quick Note' }], // Existing note types
      all_user_categories: [{ id: 1, category: 'Quick Note' }], // Types for existing notes
    };
    cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
    cy.writeFile('cypress/fixtures/all_categories.json', allCategories);
    cy.writeFile('cypress/fixtures/first_note.json', currentNote);

    // Log In

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

    // Fetch Notes
    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/notes/all-notes-categories/', // Existing Notes
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
    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories', { timeout: 10000 });
    //cy.wait(['@fetchCategories', '@fetchNotes']);

    cy.contains('No notes available').should('be.visible');
    cy.findByRole('link', { name: /Add Note/ }).should('be.visible');

    // Create new note
    // Fetch Note Types
    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/notes/user-note-types/', // ALl user's note types
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'all_categories.json',
        delayMs: 100,
      }
    ).as('fetchNoteTypes');
    // Type
    cy.findByRole('link', { name: /Add Note/ }).click();
    cy.wait('@fetchNoteTypes');
    cy.contains('New Note').should('be.visible');
    cy.findByRole('button', { name: /Save Note/ }).should('be.disabled');
    cy.findByLabelText(/Note Title/)
      .should('be.visible')
      .clear()
      .type('First Quick Note')
      .should('have.value', 'First Quick Note');

    cy.findByLabelText(/Note Body/)
      .should('be.visible')
      .clear()
      .type('This is the first Quick Note of the end-to-end test.')
      .should(
        'have.value',
        'This is the first Quick Note of the end-to-end test.'
      );
    // Post
    cy.intercept(
      {
        method: 'POST',
        url: 'http://127.0.0.1:8000/api/v1/notes/create/new/',
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: { note_category: { id: 1 }, id: 1 },
        delayMs: 100,
      }
    ).as('saveNoteTypes');
    cy.intercept(
      {
        method: 'GET',
        url: 'http://127.0.0.1:8000/api/v1/notes/quick-note/1',
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'first_note.json',
        // body: {
        //   note_title: 'First Quick Note',
        //   note_category: {
        //     id: 1,
        //     name: 'Quick Note',
        //   },
        //   note_body: 'This is the first Quick Note of the end-to-end test.',
        //   time_modified: '2023-07-29T03:17:08.425Z',
        // },
        delayMs: 300,
      }
    ).as('fetchNewNote');
    cy.findByRole('button', { name: /Save Note/ }).should('not.be.disabled');
    cy.findByRole('button', { name: /Save Note/ }).click();
    cy.wait('@saveNoteTypes').then((interception) => {
      let formData = interception.request.body;
      expect(formData['note_title']).to.eq(currentNote.note_title);
      expect(formData['note_category']).to.eq(currentNote.note_category.id);
      expect(formData['note_body']).to.eq(currentNote.note_body);
      quickNotes.push(currentNote);
      allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
      cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
      cy.wait('@fetchNewNote');
      //.then((interception) => {
      //console.log(interception);
      //});
    });
    cy.wait(3000);
    cy.contains('First Quick Note').should('be.visible');

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

    cy.findByRole('button', { name: 'back' }).should('be.visible');
    cy.findByRole('button', { name: 'back' }).click();
    cy.wait('@fetchCategories');
    cy.wait('@fetchNotes');
    cy.contains('First Quick Note').should('be.visible');
    cy.findByRole('link', { name: /View Note/ }).should('be.visible');
    cy.findByRole('link', { name: /View Note/ }).click();
    cy.wait('@fetchNewNote');
    cy.contains('First Quick Note').should('be.visible');
    cy.contains('This is the first Quick Note of the end-to-end test.').should(
      'be.visible'
    );
  });
});

// Load existing Notes {user_notes}
// Update note, save   {updated_note}
// View updated note   {updated_user_notes}

// View notes     {user_notes}
// Delete Note    {updated_user_notes}
