/* eslint-disable no-undef */

let quickNotes;

let categorizedNotes;

let allNotes;
let allCategories;

describe('Update and Delete Note Test', () => {
  beforeEach(() => {
    quickNotes = [
      {
        id: 1,
        note_title: 'First Quick Note',
        note_category: { id: 1, name: 'Quick Note' },
        note_body: 'This is the first Quick Note of the end-to-end test.',
        time_modified: new Date().toISOString(),
      },
    ];
    categorizedNotes = [
      {
        id: 2,
        note_title: 'First Categorized Note',
        note_category: { id: 2, name: 'Note Category 1' },
        note_body: 'This is the first Categorized Note of the end-to-end test.',
        time_modified: new Date().toISOString(),
      },
    ];
    allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
    allCategories = {
      all_user_note_types: [
        { id: 1, category: 'Quick Note' },
        { id: 2, category: 'Note Category 1' },
      ], // Existing note types
      all_user_categories: [
        { id: 1, category: 'Quick Note' },
        { id: 2, category: 'Note Category 1' },
      ], // Types for existing notes
    };
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

    cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
    cy.writeFile('cypress/fixtures/all_categories.json', allCategories);
  });
  it('Update Note', () => {
    // Get Current Note
    let currentNote = allNotes.author_notes[1];
    cy.writeFile('cypress/fixtures/second_note.json', currentNote);

    // Fetch All Notes, Note Type, and User Note Type Categories
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

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/user-note-types/`, // ALl user's note types
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

    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@successfulSignIn');
    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories');
    cy.wait('@fetchNoteTypes', { timeout: 10000 });
    cy.findAllByRole('link', { name: /View Note/ }, { timeout: 8000 })
      .last()
      .should('be.visible');

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/categorized-note/2`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'second_note.json',
        delayMs: 300,
      }
    ).as('fetchNote');
    cy.findAllByRole('link', { name: /View Note/ })
      .last()
      .click();
    cy.wait('@fetchNote');
    cy.contains('First Categorized Note').should('be.visible');
    cy.contains('Note Category 1').should('be.visible');
    cy.contains(
      'This is the first Categorized Note of the end-to-end test.'
    ).should('be.visible');

    cy.findByRole('button', { name: 'edit' }).should('be.visible');
    cy.findByRole('button', { name: 'edit' }).click();

    cy.wait('@fetchNote');
    cy.wait('@fetchNoteTypes', { timeout: 10000 });
    cy.findByRole('button', { name: /Save Note/ }).should('not.be.disabled');
    cy.findByLabelText(/Note Title/)
      .should('be.visible')
      .type(' Updated')
      .should('have.value', 'First Categorized Note Updated');
    cy.findByLabelText(/Note Body/)
      .should('be.visible')
      .type(' It is now updated.')
      .should(
        'have.value',
        'This is the first Categorized Note of the end-to-end test. It is now updated.'
      );

    cy.intercept(
      {
        method: 'PUT',
        url: `/notes/categorized-note/update/2/`,
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: { note_category: { id: 2 }, id: 2 },
        delayMs: 100,
      }
    ).as('saveUpdatedNote');
    cy.intercept(
      {
        method: 'GET',
        url: `/notes/categorized-note/2`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'updated_second_note.json',
        delayMs: 300,
      }
    ).as('fetchUpdatedNote');
    cy.findByRole('button', { name: /Save Note/ }).click();
    cy.wait('@saveUpdatedNote').then((interception) => {
      let formData = interception.request.body;
      expect(formData['note_title']).to.eq('First Categorized Note Updated');
      expect(formData['note_category']).to.eq(2);
      expect(formData['note_body']).to.eq(
        'This is the first Categorized Note of the end-to-end test. It is now updated.'
      );
      categorizedNotes[0].note_title = 'First Categorized Note Updated';
      categorizedNotes[0].note_body =
        'This is the first Categorized Note of the end-to-end test. It is now updated.';
      allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
      cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
      currentNote = allNotes.author_notes[1];
      cy.writeFile('cypress/fixtures/updated_second_note.json', currentNote);
      cy.wait('@fetchUpdatedNote');
    });

    cy.contains('First Categorized Note Updated').should('be.visible');
    cy.contains(
      'This is the first Categorized Note of the end-to-end test. It is now updated.'
    ).should('be.visible');

    // Fetch All Notes

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

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/user-note-types/`, // ALl user's note types
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

    cy.findByRole('button', { name: 'back' }).should('be.visible');
    cy.findByRole('button', { name: 'back' }).click();
    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories');
    cy.wait('@fetchNoteTypes', { timeout: 10000 });

    cy.contains('First Categorized Note Updated').should('be.visible');
  });

  it('Delete Note', () => {
    // Get Current Note
    let currentNote = allNotes.author_notes[1];
    cy.writeFile('cypress/fixtures/second_note.json', currentNote);

    // Fetch All Notes, Note Type, and User Note Type Categories
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

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/user-note-types/`, // ALl user's note types
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

    cy.findByRole('button', { name: /Sign In/i }).click();
    cy.wait('@successfulSignIn');
    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories');
    cy.wait('@fetchNoteTypes', { timeout: 10000 });
    cy.findAllByRole('link', { name: /View Note/ }, { timeout: 8000 })
      .last()
      .should('be.visible');

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/categorized-note/2`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'second_note.json',
        delayMs: 300,
      }
    ).as('fetchNote');
    cy.findAllByRole('link', { name: /View Note/ })
      .last()
      .click();
    cy.wait('@fetchNote');
    cy.contains('First Categorized Note').should('be.visible');
    cy.contains('Note Category 1').should('be.visible');
    cy.contains(
      'This is the first Categorized Note of the end-to-end test.'
    ).should('be.visible');

    cy.findByRole('button', { name: 'delete' }).should('be.visible');
    cy.findByRole('button', { name: 'delete' }).click();
    cy.contains('Delete Note').should('be.visible');
    cy.contains('Delete "First Categorized Note"').should('be.visible');
    cy.findByRole('button', { name: /Delete/ }).should('be.visible');
    let allNotesUpdated = { author_notes: [...quickNotes] };
    let allCategoriesUpdated = {
      ...allCategories,
      all_user_categories: [allCategories.all_user_categories[0]],
    };
    cy.writeFile('cypress/fixtures/all_notes.json', allNotesUpdated);
    cy.writeFile('cypress/fixtures/all_categories.json', allCategoriesUpdated);
    cy.intercept(
      {
        method: 'DELETE',
        url: `/notes/categorized-note/delete/2/`,
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
    cy.findByRole('button', { name: /Delete/ }).click();
    cy.wait('@deleteNote');
    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories');
  });
});
