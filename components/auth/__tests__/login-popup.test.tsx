import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { LoginPopup } from '../login-popup';
import { AuthProvider } from '@/lib/store/auth-context';
import { mockRouter } from '../../../jest.setup';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock('jose');

describe('LoginPopup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders login button', () => {
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    expect(screen.getByTestId('login-button')).toBeTruthy();
  });

  it('opens popup when login button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    await act(async () => {
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);
    });

    await waitFor(() => {
      expect(screen.getByTestId('login-popup')).toBeTruthy();
      expect(screen.getByTestId('email-input')).toBeTruthy();
      expect(screen.getByTestId('password-input')).toBeTruthy();
    });
  });

  it('shows validation errors for invalid input', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    await act(async () => {
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);
    });

    await act(async () => {
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Email is required')).toBeTruthy();
    });
  });

  it('handles successful login', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    await act(async () => {
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);
    });

    await act(async () => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      await user.type(emailInput, 'admin@example.com');
      await user.type(passwordInput, 'Admin123!');

      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(mockRouter.push).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('validates email format', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    
    await act(async () => {
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);
    });
    
    await act(async () => {
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });

    await act(async () => {
      const emailInput = screen.getByTestId('email-input');
      await user.type(emailInput, 'invalid-email');
      await user.tab();
    });


    await waitFor(() => {
      expect(screen.getByText('Please enter a valid email address')).toBeTruthy();
    });
  });

  it('validates password requirements', async () => {
    const user = userEvent.setup();
    render(
      <AuthProvider>
        <LoginPopup />
      </AuthProvider>
    );
    
    await act(async () => {
      const loginButton = screen.getByTestId('login-button');
      await user.click(loginButton);
    });

    await act(async () => {
      const passwordInput = screen.getByTestId('password-input');
      await user.type(passwordInput, 'short');
      await user.tab();
    });

    await act(async () => {
      const submitButton = screen.getByTestId('submit-button');
      await user.click(submitButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Password must be at least 8 characters')).toBeTruthy();
    });
  });
});