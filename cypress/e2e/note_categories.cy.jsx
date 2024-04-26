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
      {
        id: 3,
        note_title: 'Second Categorized Note',
        note_category: { id: 2, name: 'Note Category 1' },
        note_body:
          'This is the second Categorized Note of the end-to-end test.',
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
    cy.writeFile('cypress/fixtures/quick_notes.json', quickNotes);
    cy.writeFile(
      'cypress/fixtures/first_category_notes.json',
      categorizedNotes
    );
  });
  it('View according to category', () => {
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

    cy.get('[data-cy="category"]').should('contain', 'All');
    cy.contains('First Quick Note').should('be.visible');
    cy.contains('First Categorized Note').should('be.visible');
    cy.contains('Second Categorized Note').should('be.visible');

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/all/quick/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'quick_notes.json',
        delayMs: 100,
      }
    ).as('fetchQuickNotes');

    cy.get('[data-cy="category"]').click();
    cy.get('[data-cyvalue="Quick Note"]').click();
    cy.wait('@fetchQuickNotes');
    cy.contains('First Quick Note').should('be.visible');
    cy.contains('First Categorized Note').should('not.exist');
    cy.contains('Second Categorized Note').should('not.exist');

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/all/categorized/2/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'first_category_notes.json',
        delayMs: 100,
      }
    ).as('fetchCategorizedNotes');

    cy.get('[data-cy="category"]').click();
    cy.get('[data-cyvalue="Note Category 1"]').click();
    cy.wait('@fetchCategorizedNotes');

    cy.contains('First Quick Note').should('not.exist');
    cy.contains('First Categorized Note').should('be.visible');
    cy.contains('Second Categorized Note').should('be.visible');
  });

  it('Change Note Category', () => {
    let singleCategorizedNote = categorizedNotes[1];
    cy.writeFile(
      'cypress/fixtures/single_categorized_note.json',
      singleCategorizedNote
    );
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

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/categorized-note/3`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'single_categorized_note.json',
        delayMs: 300,
      }
    ).as('fetchCategorizedNote');
    cy.findAllByRole('link', { name: /View Note/ }, { timeout: 8000 })
      .last()
      .should('not.be.visible');
    cy.findAllByRole('link', { name: /View Note/ }, { timeout: 8000 })
      .last()
      .scrollIntoView()
      .should('be.visible')
      .click();
    cy.wait('@fetchCategorizedNote');
    cy.contains('Second Categorized Note').should('be.visible');
    cy.contains('Note Category 1').should('be.visible');
    cy.contains(
      'This is the second Categorized Note of the end-to-end test.'
    ).should('be.visible');

    cy.findByRole('button', { name: 'edit' }).should('be.visible');
    cy.findByRole('button', { name: 'edit' }).click();
    cy.wait('@fetchCategorizedNote');
    cy.wait('@fetchNoteTypes');

    cy.findByRole('button', { name: /Save Note/ }).should('not.be.disabled');
    cy.findByLabelText(/Note Title/)
      .should('be.visible')
      .type(' Updated to Quick Note')
      .should('have.value', 'Second Categorized Note Updated to Quick Note');
    cy.findByLabelText(/Note Body/)
      .should('be.visible')
      .clear()
      .type(
        'This was the second Categorized Note of the end-to-end test now updated to a Quick Note.'
      )
      .should(
        'have.value',
        'This was the second Categorized Note of the end-to-end test now updated to a Quick Note.'
      );

    cy.get('[data-testid="category_select"]')
      .should('contain', 'Note Category 1')
      .click();
    cy.get('[data-cyvalue="Quick Note"]').click();

    cy.intercept(
      {
        method: 'DELETE',
        url: `/notes/categorized-note/delete/3/`,
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        delayMs: 100,
      }
    ).as('deleteCategorizedNote');

    cy.intercept(
      {
        method: 'POST',
        url: `/notes/create/new/`,
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: { note_category: { id: 1 }, id: 4 },
        delayMs: 100,
      }
    ).as('createNote');

    categorizedNotes.pop();
    let updatedNote = {
      id: 4,
      note_category: { id: 1, name: 'Quick Note' },
      note_title: 'Second Categorized Note Updated to Quick Note',
      note_body:
        'This was the second Categorized Note of the end-to-end test now updated to a Quick Note.',
      time_modified: new Date().toISOString(),
    };
    quickNotes.push(updatedNote);
    cy.writeFile(
      'cypress/fixtures/first_category_notes.json',
      categorizedNotes
    );
    allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
    cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
    cy.writeFile('cypress/fixtures/quick_notes.json', quickNotes);
    cy.writeFile('cypress/fixtures/single_categorized_note.json', updatedNote);

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/quick-note/4`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'single_categorized_note.json',
        delayMs: 300,
      }
    ).as('fetchUpdatedNote');

    cy.findByRole('button', { name: /Save Note/ }).click();

    cy.wait('@deleteCategorizedNote');
    cy.wait('@createNote');
    cy.wait('@fetchUpdatedNote');

    cy.contains('Second Categorized Note Updated to Quick Note').should(
      'be.visible'
    );
    cy.contains('Quick Note').should('be.visible');
    cy.contains(
      'This was the second Categorized Note of the end-to-end test now updated to a Quick Note.'
    ).should('be.visible');

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

    cy.contains('Second Categorized Note Updated to Quick Note').should(
      'be.visible'
    );
  });

  it('Create Note Category and add note', () => {
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

    cy.get("[data-cy='Add Note']", { timeout: 8000 }).click();
    cy.findByRole('link', { name: /Add Note/ }).should('be.visible');

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
    // Type
    cy.findByRole('link', { name: /Add Note/ }).click();
    cy.wait('@fetchNoteTypes');

    cy.findByRole('button', { name: /Add Category/ }).should('be.visible');
    cy.findByRole('button', { name: /Add Category/ }).click();

    cy.contains('Create New Category').should('be.visible');
    cy.findByRole('button', { name: /Create/ }).should('be.disabled');
    cy.findByLabelText(/Category Name/)
      .should('be.visible')
      .type('Note Category 2')
      .should('have.value', 'Note Category 2');
    cy.findByRole('button', { name: /Create/ }).should('not.be.disabled');

    allCategories.all_user_note_types.push({
      id: 3,
      category: 'Note Category 2',
    });
    cy.intercept(
      {
        method: 'POST',
        url: `/notes/note-categories/`, // ALl user's note types
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: allCategories.all_user_note_types[2],
        delayMs: 100,
      }
    ).as('createNoteType');

    cy.findByRole('button', { name: /Create/ }).click();
    cy.wait('@createNoteType');

    cy.findByRole('button', { name: /Save Note/ }).should('be.disabled');
    cy.findByLabelText(/Note Title/)
      .should('be.visible')
      .clear()
      .type('Note For Note Category 2')
      .should('have.value', 'Note For Note Category 2');

    cy.findByLabelText(/Note Body/)
      .should('be.visible')
      .clear()
      .type('This is the first note in Note Category 2.')
      .should('have.value', 'This is the first note in Note Category 2.');
    cy.findByRole('button', { name: /Save Note/ }).should('not.be.disabled');

    allCategories.all_user_categories.push(
      allCategories.all_user_note_types[2]
    );

    let newNote = {
      id: 4,
      note_category: { id: 3, name: 'Note Category 2' },
      note_title: 'Note For Note Category 2',
      note_body: 'This is the first note in Note Category 2.',
      time_modified: new Date().toISOString(),
    };
    categorizedNotes.push(newNote);

    allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
    cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
    cy.writeFile('cypress/fixtures/all_categories.json', allCategories);
    cy.writeFile('cypress/fixtures/single_categorized_note.json', newNote);
    cy.intercept(
      {
        method: 'POST',
        url: `/notes/create/new/`,
      },
      {
        statusCode: 200,
        // headers: {
        //   'Content-Type': 'application/json',
        // },
        body: { note_category: { id: 3 }, id: 4 },
        delayMs: 100,
      }
    ).as('saveNote');
    cy.intercept(
      {
        method: 'GET',
        url: `/notes/categorized-note/4`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        fixture: 'single_categorized_note.json',
        delayMs: 300,
      }
    ).as('fetchNewNote');
    cy.findByRole('button', { name: /Save Note/ }).click();
    cy.wait('@saveNote');
    cy.wait('@fetchNewNote');
    cy.contains(newNote.note_title).should('be.visible');
    cy.contains(newNote.note_body).should('be.visible');
    cy.contains(newNote.note_category.name).should('be.visible');

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

    cy.contains(newNote.note_title).should('be.visible');

    cy.intercept(
      {
        method: 'GET',
        url: `/notes/all/categorized/3/`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        body: [newNote],
        delayMs: 100,
      }
    ).as('fetchNotesInCategory2');

    cy.get('[data-cy="category"]').click();
    cy.get('[data-cyvalue="Note Category 2"]').click();
    cy.wait('@fetchNotesInCategory2');
    cy.contains('First Quick Note').should('not.exist');
    cy.contains('First Categorized Note').should('not.exist');
    cy.contains('Second Categorized Note').should('not.exist');
    cy.contains(newNote.note_title).should('be.visible');
  });
  it('Delete Note Category', () => {
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

    cy.contains('Quick Note').should('be.visible');
    cy.contains('First Quick Note').should('be.visible');
    cy.contains('First Categorized Note').should('be.visible');
    cy.contains('Note Category 1').should('be.visible');

    cy.get("[data-cy='Delete Category']", { timeout: 8000 }).click();
    cy.findByRole('button', { name: /Delete Category/ }).should('be.visible');
    cy.findByRole('button', { name: /Delete Category/ }).click();

    cy.contains('Delete Note Category').should('be.visible');

    cy.get('[data-cy="pick category"]').click();
    cy.get('[data-cyvalue="delete Note Category 1"]').click();

    cy.get("[data-cy='Delete Category Icon']").should('be.visible');
    cy.get("[data-cy='Delete Category Icon']").click();

    cy.contains('Confirm delete category:').should('be.visible');

    cy.findByRole('button', { name: /Confirm Delete/ }).should('be.visible');

    cy.intercept(
      {
        method: 'DELETE',
        url: `/notes/note-categories/2`,
      },
      {
        statusCode: 200,
        headers: {
          'Content-Type': 'application/json',
        },
        delayMs: 100,
      }
    ).as('fetchNoteTypes');

    allCategories.all_user_categories.pop();
    allCategories.all_user_note_types.pop();

    categorizedNotes = [];
    allNotes = { author_notes: [...quickNotes, ...categorizedNotes] };
    cy.writeFile('cypress/fixtures/all_notes.json', allNotes);
    cy.writeFile('cypress/fixtures/all_categories.json', allCategories);
    cy.writeFile(
      'cypress/fixtures/first_category_notes.json',
      categorizedNotes
    );

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

    cy.findByRole('button', { name: /Confirm Delete/ }).click();

    cy.wait('@fetchNotes');
    cy.wait('@fetchCategories');
    cy.wait('@fetchNoteTypes', { timeout: 10000 });

    cy.contains('Quick Note').should('be.visible');
    cy.contains('First Quick Note').should('be.visible');
    cy.contains('First Categorized Note').should('not.exist');
    cy.contains('Note Category 1').should('not.exist');

    cy.get('[data-cy="category"]').click();
    cy.get('[data-cyvalue="Quick Note"]').should('be.visible');
    cy.get('[data-cyvalue="Note Category 1"]').should('not.exist');
  });
});

// Delete Note Category
