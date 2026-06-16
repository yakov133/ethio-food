import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the public recipe navigation', () => {
  render(<App />);

  // Verifies the real app shell instead of the default Create React App text.
  expect(screen.getAllByText(/כל המתכונים/).length).toBeGreaterThan(0);
});
