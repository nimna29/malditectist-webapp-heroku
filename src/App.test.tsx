import React from 'react';
import { render, screen, act, waitFor } from '@testing-library/react';
import App from './App';

jest.useFakeTimers();

describe('App', () => {

  window.scrollTo = jest.fn();
  
  test('renders the Preloader component initially', () => {
    render(<App />);
    expect(screen.getByTestId('preloader')).toBeInTheDocument();
  });

  test('removes the Preloader component after 2 seconds', async () => {
    render(<App />);
    act(() => {
      jest.advanceTimersByTime(2000);
    });
    await waitFor(() => {
      expect(screen.queryByTestId('preloader')).not.toBeInTheDocument();
    });
});

  test('renders the FileUpload component', () => {
    render(<App />);
    expect(screen.getByTestId('file-upload')).toBeInTheDocument();
  });
});
