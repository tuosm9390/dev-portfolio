import { render, screen } from '@testing-library/react';
import Page from '../page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/FolderPortfolio', () => ({
  default: () => <main aria-label="portfolio">Folder Portfolio</main>,
}));

describe('Portfolio Home Page Integration', () => {
  it('renders the folder portfolio experience', () => {
    render(<Page />);

    expect(screen.getByRole('main', { name: 'portfolio' })).toBeInTheDocument();
  });
});
