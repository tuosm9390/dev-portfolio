import { render, screen } from '@testing-library/react';
import Page from '../page';
import { describe, it, expect, vi } from 'vitest';

vi.mock('@/components/PortfolioStage', () => ({
  default: () => <main data-testid="portfolio-stage">Portfolio Stage</main>
}));

describe('Portfolio Home Page Integration', () => {
  it('renders the rebuilt portfolio stage as the home view', () => {
    render(<Page />);

    expect(screen.getByTestId('portfolio-stage')).toBeInTheDocument();
  });
});
