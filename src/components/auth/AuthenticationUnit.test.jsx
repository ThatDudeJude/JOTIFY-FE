/* eslint-disable testing-library/no-debugging-utils */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AuthModal from './AuthModal';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { createMemoryHistory } from 'history';
import * as m from '../../apiClient';

jest.mock('axios', () => {
  return {
    create: () => {
      return {
        post: jest.fn(),
        get: jest.fn(),
        defaults: {
          headers: {
            common: {
              Authorization: 'token',
            },
          },
        },
      };
    },
    post: jest.fn(),
  };
});

m.default = axios.create();
const setAuthModal = jest.fn();
const setAuthForm = jest.fn();
const setToken = jest.fn();
const setName = jest.fn();
const token = 'token';

describe('Signup Authentication Form', () => {
  test('signup form input', async () => {
    render(
      <BrowserRouter>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'register'}
        />
      </BrowserRouter>
    );

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

    const submitButton = await screen.findByRole('button', {
      name: /Register/,
    });
    expect(submitButton.hasAttribute('disabled')).toBe(false);
    //
  }, 7000);
  test('signup form submit', async () => {
    const registerResponse = Promise.resolve({
      data: {},
      status: 200,
      statusText: 'Ok',
      headers: {},
      config: {},
      request: {},
    });

    m.default.post.mockImplementationOnce(() => registerResponse);

    render(
      <BrowserRouter>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'register'}
        />
      </BrowserRouter>
    );

    const nameInput = await screen.findByLabelText(/Name/);
    await userEvent.type(nameInput, 'TestUser');
    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@domain.com');
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    const password2Input = await screen.findByLabelText(/Confirm Password/);
    await userEvent.type(password2Input, '1qW@3eR$5tY^7u');

    const submitButton = await screen.findByRole('button', {
      name: /Register/,
    });

    await userEvent.click(submitButton);

    expect(setAuthForm).toBeCalledTimes(1);
  }, 7000);
  test('signup form submit failure', async () => {
    const response = {
      response: {
        data: { error: 'Email already exists!' },
        status: 400,
        statusText: 'Ok',
        headers: {},
        config: {},
        request: {},
      },
    };

    m.default.post.mockRejectedValueOnce(response);

    render(
      <BrowserRouter>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'register'}
        />
      </BrowserRouter>
    );

    const nameInput = await screen.findByLabelText(/Name/);
    await userEvent.type(nameInput, 'TestUser');
    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@domain.com');
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    const password2Input = await screen.findByLabelText(/Confirm Password/);
    await userEvent.type(password2Input, '1qW@3eR$5tY^7u');
    const submitButton = await screen.findByRole('button', {
      name: /Register/,
    });

    await userEvent.click(submitButton);

    expect(setAuthForm).not.toHaveBeenCalled();

    expect(
      await screen.findByText('Email already exists!')
    ).toBeInTheDocument();
  }, 7000);
});

describe('Login Authentication Form', () => {
  test('login form input', async () => {
    render(
      <BrowserRouter>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'login'}
        />
      </BrowserRouter>
    );

    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@jotify.com');
    expect(
      await screen.findByDisplayValue('testuser@jotify.com')
    ).toBeInTheDocument();
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    expect(password1Input.value).toBe('1qW@3eR$5tY^7u');

    const submitButton = await screen.findByRole('button', {
      name: /Login/,
    });
    expect(submitButton.hasAttribute('disabled')).toBe(false);
  }, 7000);
  test('login form submit', async () => {
    const history = createMemoryHistory();
    const loginResponse = Promise.resolve({
      data: { token: 'token example' },
      status: 201,
      statusText: 'Ok',
      headers: {},
      config: {},
      request: {},
    });

    m.default.post.mockImplementationOnce(() => loginResponse);

    render(
      <BrowserRouter history={history}>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'login'}
        />
      </BrowserRouter>
    );

    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@domain.com');
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');

    const submitButton = await screen.findByRole('button', {
      name: /Login/,
    });

    await userEvent.click(submitButton);

    expect(setToken).toHaveBeenCalledTimes(1);
  }, 7000);
  test('signup form submit failure', async () => {
    const response = {
      response: {
        data: { error: "Email doesn't exist!" },
        status: 400,
        statusText: 'Ok',
        headers: {},
        config: {},
        request: {},
      },
    };

    m.default.post.mockRejectedValueOnce(response);

    render(
      <BrowserRouter>
        <AuthModal
          setAuthModal={setAuthModal}
          setAuthForm={setAuthForm}
          setToken={setToken}
          setName={setName}
          token={token}
          currentAuthForm={'login'}
        />
      </BrowserRouter>
    );

    const emailInput = await screen.findByLabelText(/Email/);
    await userEvent.type(emailInput, 'testuser@domain.com');
    const password1Input = await screen.findByLabelText(/^Password/);
    await userEvent.type(password1Input, '1qW@3eR$5tY^7u');
    const submitButton = await screen.findByRole('button', {
      name: /Login/,
    });
    await userEvent.click(submitButton);

    expect(await screen.findByText("Email doesn't exist!")).toBeInTheDocument();
  }, 7000);
});
