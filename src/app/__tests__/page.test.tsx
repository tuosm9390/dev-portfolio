import { render, screen } from '@testing-library/react';
import Page from '../page';
import { describe, it, expect, vi } from 'vitest';

// mock sub-components
vi.mock('@/components/HeroSection', () => ({
  default: () => <div data-testid="hero">Hero</div>
}));
vi.mock('@/components/AboutSection', () => ({
  default: () => <div data-testid="about">About</div>
}));
vi.mock('@/components/ContactSection', () => ({
  default: () => <div data-testid="contact">Contact</div>
}));
vi.mock('@/components/Header', () => ({
  default: () => <header>Header</header>
}));
vi.mock('@/components/Footer', () => ({
  default: () => <footer>Footer</footer>
}));

describe('Portfolio Home Page Integration', () => {
  it('renders the home layout sections', () => {
    render(<Page />);

    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByTestId('hero')).toBeInTheDocument();
    expect(screen.getByTestId('about')).toBeInTheDocument();
    expect(screen.getByTestId('contact')).toBeInTheDocument();
    expect(screen.getByText('Footer')).toBeInTheDocument();
  });
});
