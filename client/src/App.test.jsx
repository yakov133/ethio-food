import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';
import AdminRecipeDeleteButton from './components/AdminRecipeDeleteButton';

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

test('hides admin delete controls from regular users', () => {
  render(<AdminRecipeDeleteButton userLogedIn={{ email: 'user@example.com' }} recipeId="recipe-1" />);

  // The client UI should not expose admin-only actions to regular users.
  expect(screen.queryByLabelText(/מחיקת מתכון/)).not.toBeInTheDocument();
});

test('shows admin delete controls to admin users', () => {
  render(<AdminRecipeDeleteButton userLogedIn={{ email: 'yakov133@walla.com' }} recipeId="recipe-1" />);

  // Server authorization is still enforced, but admins should see the management action.
  expect(screen.getByLabelText(/מחיקת מתכון/)).toBeInTheDocument();
});
