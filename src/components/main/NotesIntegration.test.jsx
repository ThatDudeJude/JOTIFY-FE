import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import apiClient from '../../apiClient';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Main from './Main';
import Note from './Note';

jest.mock('../../apiClient.js');
// jest.mock('react-router-dom', () => ({
//   ...jest.requireActual('react-router-dom'),
//   useParams: jest.fn(),
// }));

const setRedirectToAuth = jest.fn();
const setCurrentTab = jest.fn();
const setToken = jest.fn();
const setName = jest.fn();
const setAuthForm = jest.fn();
const deleteFunction = jest.fn();
const authForm = 'login';
const redirectToAuth = false;
const token = 'token';
const currentTab = 'notes';

describe('Notes Integration', () => {
  test('View and Update Quick Note to User Category, then Delete', async () => {
    const notesResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        author_notes: [
          {
            id: 1,
            note_category: {
              id: 1,
              name: 'Quick Note',
            },
            note_title: 'First Quick Note',
            note_body:
              'This is the first quick note. This is supposed to be clipped if it is too long in the notes tab.',
            time_modified: '2023-07-19T12:31:32.888502+03:00',
          },
          {
            id: 2,
            note_category: {
              id: 2,
              name: 'First Category',
            },
            note_title: 'First Categorized Note',
            note_body: 'This is the first categorized note.',
            time_modified: '2023-07-20T12:31:32.888502+03:00',
          },
        ],
        //   },
        // });

        // const noteCategoriesPromise = Promise.resolve({
        //   status: 200,
        //   statusText: 'OK',
        //   data: {
        all_user_categories: [
          {
            category: 'Quick Note',
            id: 1,
          },
          {
            category: 'First Category',
            id: 2,
          },
          {
            category: 'Second Category',
            id: 3,
          },
        ],
      },
    });

    const noteCategoriesPromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        all_user_note_types: [
          {
            category: 'Quick Note',
            id: 1,
          },
          {
            category: 'First Category',
            id: 2,
          },
          {
            category: 'Second Category',
            id: 3,
          },
        ],
      },
    });

    const noteResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 1,
        note_category: {
          id: 1,
          name: 'Quick Note',
        },
        note_title: 'First Quick Note',
        note_body:
          'This is the first quick note. This is supposed to be clipped if it is too long in the notes tab.',
        time_modified: '2023-07-19T12:31:32.888502+03:00',
      },
    });

    const noteCategoryAddedPromise = Promise.resolve({
      data: {
        id: 4,
        category: 'Third Category',
      },
    });

    const noteUpdateResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 3,
        note_category: {
          id: 4,
          name: 'Third Category',
        },
        note_title: 'First Quick Note Updated',
        note_body:
          'This is the first quick note. This is supposed to be clipped if it is too long in the notes tab.',
        time_modified: '2023-07-30T12:31:32.888502+03:00',
      },
    });

    apiClient.get.mockImplementationOnce(() => notesResponsePromise);
    apiClient.get.mockImplementationOnce(() => notesResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteCategoriesPromise);
    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteCategoriesPromise);
    apiClient.post.mockImplementationOnce(() => noteCategoryAddedPromise);
    apiClient.delete.mockImplementation(() => deleteFunction());
    apiClient.post.mockImplementationOnce(() => noteUpdateResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteUpdateResponsePromise);
    apiClient.delete.mockImplementation(() => deleteFunction());
    render(
      <BrowserRouter>
        <Routes>
          <Route
            path='/app/note/:action/:category/:id'
            element={<Note token={token} setToken={setToken} />}
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
    );

    // Fetch Note
    await act(() => notesResponsePromise);
    await act(() => notesResponsePromise);
    await act(() => noteCategoriesPromise);

    const viewNoteButtons = await screen.findAllByText(/View Note/);
    await userEvent.click(viewNoteButtons[0]);
    await act(() => noteResponsePromise);
    expect(
      await screen.findByText(
        /This is the first quick note. This is supposed to be clipped if it is too long in the notes tab./
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        // new RegExp(
        new Date('2023-07-19T12:31:32.888502+03:00').toLocaleString()
        // )
      )
    ).toBeInTheDocument();
    // Edit Note
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    await act(() => noteResponsePromise);
    await act(() => noteCategoriesPromise);
    expect(await screen.findByText(/Edit Note/)).toBeInTheDocument();

    const noteTitleTextarea = await screen.findByDisplayValue(
      'First Quick Note'
    );
    await userEvent.type(noteTitleTextarea, ' Updated');

    expect(
      await screen.findByDisplayValue('First Quick Note Updated')
    ).toBeInTheDocument();

    // New Category
    const addCategoryButton = await screen.findByRole('button', {
      name: /Add Category/,
    });
    await userEvent.click(addCategoryButton);
    expect(await screen.findByText(/Create New Category/)).toBeInTheDocument();
    const newCategoryInput = await screen.findByRole('textbox', {
      label: /Category Name/,
    });
    await userEvent.type(newCategoryInput, 'Third Category');

    expect(
      await screen.findByDisplayValue(/Third Category/)
    ).toBeInTheDocument();

    const createCategoryButton = await screen.findByRole('button', {
      name: /Create/,
    });

    await userEvent.click(createCategoryButton);
    await act(() => noteCategoryAddedPromise);

    // Save note

    const addButton = await screen.findByRole('button', { name: /Save Note/ });

    await userEvent.click(addButton);
    expect(deleteFunction).toHaveBeenCalledTimes(1);

    await act(() => noteUpdateResponsePromise);
    await act(() => noteUpdateResponsePromise);

    expect(
      await screen.findByText('First Quick Note Updated')
    ).toBeInTheDocument();
    expect(await screen.findByText('Third Category')).toBeInTheDocument();

    expect(
      await screen.findByRole('button', { name: /edit/i })
    ).toBeInTheDocument();
    const deleteButton = await screen.findByRole('button', { name: /delete/ });
    await userEvent.click(deleteButton);

    expect(await screen.findByText('Delete Note')).toBeInTheDocument();
    const deleteNoteButton = await screen.findByRole('button', {
      name: /Delete/,
    });
    await userEvent.click(deleteNoteButton);
    expect(deleteFunction).toHaveBeenCalledTimes(2);
    //screen.debug(deleteNoteButton);
    //screen.debug();
  }, 15000);
  test('View and Update User Category Note', async () => {
    const notesResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        author_notes: [
          {
            id: 1,
            note_category: {
              id: 1,
              name: 'Quick Note',
            },
            note_title: 'First Quick Note',
            note_body:
              'This is the first quick note. This is supposed to be clipped if it is too long in the notes tab.',
            time_modified: '2023-07-19T12:31:32.888502+03:00',
          },
          {
            id: 2,
            note_category: {
              id: 2,
              name: 'First Category',
            },
            note_title: 'First Categorized Note',
            note_body:
              'This is a first category note. This is supposed to be clipped if it is too long in the notes tab.',
            time_modified: '2023-07-20T12:31:32.888502+03:00',
          },
        ],
        //   },
        // });

        // const noteCategoriesPromise = Promise.resolve({
        //   status: 200,
        //   statusText: 'OK',
        //   data: {
        all_user_categories: [
          {
            category: 'Quick Note',
            id: 1,
          },
          {
            category: 'First Category',
            id: 2,
          },
          {
            category: 'Second Category',
            id: 3,
          },
        ],
      },
    });

    const noteCategoriesPromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        all_user_note_types: [
          {
            category: 'Quick Note',
            id: 1,
          },
          {
            category: 'First Category',
            id: 2,
          },
          {
            category: 'Second Category',
            id: 3,
          },
        ],
      },
    });

    const noteResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 2,
        note_category: {
          id: 2,
          name: 'First Category',
        },
        note_title: 'First Categorized Note',
        note_body:
          'This is a first category note. This is supposed to be clipped if it is too long in the notes tab.',
        time_modified: '2023-07-20T12:31:32.888502+03:00',
      },
    });

    const noteUpdateResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        id: 2,
        note_category: {
          id: 2,
          name: 'First Category',
        },
        note_title: 'First Categorized Note Updated',
        note_body:
          'This is a first category note. This is supposed to be clipped if it is too long in the notes tab.',
        time_modified: '2023-07-30T12:31:32.888502+03:00',
      },
    });

    apiClient.get.mockImplementationOnce(() => notesResponsePromise);
    apiClient.get.mockImplementationOnce(() => notesResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteCategoriesPromise);
    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteCategoriesPromise);
    apiClient.put.mockImplementationOnce(() => noteUpdateResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteUpdateResponsePromise);
    render(
      <BrowserRouter>
        <Routes>
          <Route
            path='/app/note/:action/:category/:id'
            element={<Note token={token} setToken={setToken} />}
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
    );

    // Fetch Note
    await act(() => notesResponsePromise);
    await act(() => notesResponsePromise);
    await act(() => noteCategoriesPromise);

    const viewNoteButtons = await screen.findAllByText(/View Note/);
    await userEvent.click(viewNoteButtons[1]);
    await act(() => noteResponsePromise);
    expect(
      await screen.findByText(
        /This is a first category note. This is supposed to be clipped if it is too long in the notes tab./
      )
    ).toBeInTheDocument();
    expect(
      await screen.findByText(
        // new RegExp(
        new Date('2023-07-20T12:31:32.888502+03:00').toLocaleString()
        // )
      )
    ).toBeInTheDocument();
    // Edit Note
    const editButton = await screen.findByRole('button', { name: /edit/i });
    await userEvent.click(editButton);
    await act(() => noteResponsePromise);
    await act(() => noteCategoriesPromise);
    expect(await screen.findByText(/Edit Note/)).toBeInTheDocument();

    const noteTitleTextarea = await screen.findByDisplayValue(
      'First Categorized Note'
    );
    await userEvent.type(noteTitleTextarea, ' Updated');

    expect(
      await screen.findByDisplayValue('First Categorized Note Updated')
    ).toBeInTheDocument();

    //const selectedCategory = await screen.findByTestId(/category_select/);
    //screen.debug(selectedCategory);

    // Save note

    const addButton = await screen.findByRole('button', { name: /Save Note/ });

    await userEvent.click(addButton);

    await act(() => noteUpdateResponsePromise);
    await act(() => noteUpdateResponsePromise);

    expect(
      await screen.findByText('First Categorized Note Updated')
    ).toBeInTheDocument();
    expect(await screen.findByText('First Category')).toBeInTheDocument();

    expect(
      await screen.findByRole('button', { name: /edit/i })
    ).toBeInTheDocument();

    //screen.debug(deleteNoteButton);
    //screen.debug();
  }, 15000);
});
