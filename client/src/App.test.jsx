import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the public recipe navigation', () => {
  render(<App />);

  // Verifies the real app shell instead of the default Create React App text.
  expect(screen.getAllByText(/כל המתכונים/).length).toBeGreaterThan(0);
});

test('renders the not found page for unknown client routes', () => {
  window.history.pushState({}, '', '/fssdasd');
  render(<App />);

  // The static host rewrite should let React Router decide which fallback page to show.
  expect(screen.getByText(/Sorry This Page Can't Be Found/i)).toBeInTheDocument();
});
