import App from '../../App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
import apiClient from '../../apiClient';

jest.mock('../../apiClient.js');

describe('Registration and Login', () => {
  test('Register the user', async () => {
    apiClient.post.mockImplementationOnce(() => Promise.resolve());

    render(<App />);

    const registerButton = await screen.findByText('Register');
    await userEvent.click(registerButton);
    const nameInput = await screen.findByLabelText(/Name/);
    await userEvent.type(nameInput, 'TestUser');
    expect(await screen.findByDisplayValue('TestUser')).toBeInTheDocument();
    expect(nameInput.value).toBe('TestUser');
    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@jotify.com');
    expect(
      await screen.findByDisplayValue('testuser@jotify.com')
    ).toBeInTheDocument();
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    expect(password1Input.value).toBe('1qW@3eR$5tY^7u');
    const password2Input = await screen.findByLabelText(/^Confirm Password/);
    await userEvent.type(password2Input, '1qW@3eR$5tY^7u');

    const submitButtons = await screen.findAllByRole('button', {
      name: /Register/,
    });

    await userEvent.click(submitButtons[0]);

    expect(
      await screen.findByText(/^Don't have an account/)
    ).toBeInTheDocument();
  }, 15000);

  test('Login the user', async () => {
    const loginResponse = {
      status: 201,
      data: {
        token: 'token',
        name: 'testuser',
      },
    };

    const notesResponse = {
      status: 200,
      statusText: 'OK',
      data: {
        all_user_categories: [],
        author_notes: [],
      },
    };

    apiClient.post.mockImplementationOnce(() =>
      Promise.resolve({
        ...loginResponse,
      })
    );
    apiClient.get.mockImplementationOnce(() =>
      Promise.resolve({
        ...notesResponse,
      })
    );
    apiClient.get.mockImplementationOnce(() =>
      Promise.resolve({
        ...notesResponse,
      })
    );
    render(<App />);

    const loginButton = await screen.findByText('Login');
    await userEvent.click(loginButton);
    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@jotify.com');
    expect(
      await screen.findByDisplayValue('testuser@jotify.com')
    ).toBeInTheDocument();
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    expect(password1Input.value).toBe('1qW@3eR$5tY^7u');

    const submitButtons = await screen.findAllByRole('button', {
      name: /Login/,
    });
    await userEvent.click(submitButtons[0]);

    expect(await screen.findByText(/^No notes available./)).toBeInTheDocument();
  }, 10000);
});
