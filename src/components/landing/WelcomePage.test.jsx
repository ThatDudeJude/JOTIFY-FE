/* eslint-disable testing-library/no-debugging-utils */
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import WelcomePage from './WelcomePage';
import 'intersection-observer';
import { BrowserRouter } from 'react-router-dom';

async function getHeaderTextContent(text) {
  return await screen.findByText((content, element) => {
    return (
      element.tagName.toLowerCase() === 'h1' &&
      element.textContent === text &&
      element.children[0].tagName.toLowerCase() === 'span'
    );
  });
}

async function findLearnMoreContent(text) {
  return await screen.findByText((content, element) => {
    return (
      element.tagName.toLowerCase() === 'span' && element.textContent === text
    );
  });
}

describe('Test Components', () => {
  test('render welcome page', async () => {
    render(<WelcomePage />);
    // screen.debug();
    const header1 = await getHeaderTextContent('Keep Track,');
    const header2 = await getHeaderTextContent('Keep Notes,');
    const header3 = await getHeaderTextContent('Stay Organized.');
    expect(header1).toBeInTheDocument();
    expect(header2).toBeInTheDocument();
    expect(header3).toBeInTheDocument();
    expect(
      await screen.findByText('Save short notes and to-do lists with Jotify.')
    ).toBeInTheDocument();
  });

  test('click learn more button', async () => {
    render(<WelcomePage />);
    const moreButton = screen.getByRole('button', { name: /Learn More/ });
    userEvent.click(moreButton);

    expect(await findLearnMoreContent('Notes')).toBeInTheDocument();
    expect(await findLearnMoreContent('To-Dos')).toBeInTheDocument();
    expect(await findLearnMoreContent('Organize')).toBeInTheDocument();
  });
});

describe('Test Buttons', () => {
  test('authentication button', async () => {
    render(<WelcomePage />);
    const loginButton = await screen.findByText('Login');
    const registerButton = await screen.findByText('Register');
    expect(loginButton).toBeInTheDocument();
    expect(registerButton).toBeInTheDocument();
  });
  test('login authentication form', async () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
    const loginButton = await screen.findByText('Login');
    // const registerButton = await screen.findByText('Register');
    userEvent.click(loginButton);
    expect(await screen.findByLabelText(/Email/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Password/)).toBeInTheDocument();
  });
  test('register authentication form', async () => {
    render(
      <BrowserRouter>
        <WelcomePage />
      </BrowserRouter>
    );
    const registerButton = await screen.findByText('Register');
    userEvent.click(registerButton);
    expect(await screen.findByLabelText(/Name/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/Email/)).toBeInTheDocument();
    expect(await screen.findByLabelText(/^Password/)).toBeInTheDocument();
    expect(
      await screen.findByLabelText(/Confirm Password/)
    ).toBeInTheDocument();
  });
});
