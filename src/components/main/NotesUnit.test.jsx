import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import apiClient from '../../apiClient';
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
import Body from './Body';
import Note from './Note';

jest.mock('../../apiClient.js');
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

const setRedirectToAuth = jest.fn();
const token = 'token';
const currentTab = 'notes';
const setCurrentTab = jest.fn();
const setToken = jest.fn();

describe('Display Notes', () => {
  test('Fetch notes for my notes tab', async () => {
    const notesResponsePromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
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
        author_notes: [
          {
            id: 1,
            note_category: {
              id: 1,
              name: 'Quick Note',
            },
            note_title: 'First Quick Note',
            note_body: 'This is the first quick note.',
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
      },
    });

    apiClient.get.mockImplementationOnce(() => notesResponsePromise);
    apiClient.get.mockImplementationOnce(() => notesResponsePromise);

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
    await act(() => notesResponsePromise);
    await act(() => notesResponsePromise);
    //screen.debug();
    expect(
      await screen.findByText(/First Categorized Note/)
    ).toBeInTheDocument();
  }, 10000);
  test('Display single note', async () => {
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
        note_body: 'This is the first quick note.',
        time_modified: '2023-07-19T12:31:32.888502+03:00',
      },
    });

    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    useParams.mockImplementation(() => {
      return {
        action: 'view',
        category: 1,
        id: 1,
      };
    });

    render(
      <BrowserRouter>
        <Note token={token} setToken={setToken} />
      </BrowserRouter>
    );

    await act(() => noteResponsePromise);

    expect(await screen.findByText(/First Quick Note/)).toBeInTheDocument();
    expect(
      await screen.findByText(/This is the first quick note./)
    ).toBeInTheDocument();
    // screen.debug();
  });
  test('edit note', async () => {
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
        note_body: 'This is the first quick note.',
        time_modified: '2023-07-19T12:31:32.888502+03:00',
      },
    });
    const noteCategoriesPromise = Promise.resolve({
      status: 200,
      statusText: 'OK',
      data: {
        all_user_note_types: [
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

    apiClient.get.mockImplementationOnce(() => noteResponsePromise);
    apiClient.get.mockImplementationOnce(() => noteCategoriesPromise);

    useParams.mockImplementation(() => {
      return {
        action: 'edit',
        category: 1,
        id: 1,
      };
    });

    render(
      <BrowserRouter>
        <Note token={token} setToken={setToken} />
      </BrowserRouter>
    );

    await act(() => noteResponsePromise);
    await act(() => noteCategoriesPromise);

    expect(await screen.findByText(/First Quick Note/)).toBeInTheDocument();
    expect(
      await screen.findByText(/This is the first quick note./)
    ).toBeInTheDocument();
    // screen.debug();
  });
});
