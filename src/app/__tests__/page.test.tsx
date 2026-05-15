import { render, screen } from '@testing-library/react';
import Page from '../page';
import { describe, it, expect } from 'vitest';

describe('Portfolio Home Page Integration', () => {
  it('renders the reset portfolio baseline', () => {
    render(<Page />);

    expect(screen.getByRole('main', { name: 'portfolio' })).toBeInTheDocument();
  });
});
