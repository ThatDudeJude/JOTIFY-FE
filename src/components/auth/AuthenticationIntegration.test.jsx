import App from '../../App';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import 'intersection-observer';
//import axios from 'axios'
import * as m from '../../App';

// jest.mock('axios', () => {
//   return {
//     create: () => {
//       return {
//         post: () => Promise.resolve(),
//         defaults: {
//           headers: {
//             common: {
//               Authorization: 'token',
//             },
//           },
//         },
//       };
//     },
//     post: jest.fn(),
//   };
// });

// m.client = axios.create();

const axios = jest.createMockFromModule('axios');
m.client = axios.describe('Registration and Login', () => {
  test('Register the user', async () => {
    axios.post.mockImplementationOnce(() => Promise.resolve());

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
    // expect(submitButtons[0].hasAttribute('disabled')).toBe(false);
    await userEvent.click(submitButtons[0]);
    //console.log(submitButtons);
    expect(
      await screen.findByText(/^Don't have an account/)
    ).toBeInTheDocument();
  }, 15000);
  test('Login the user', async () => {
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
  }, 10000);
});
