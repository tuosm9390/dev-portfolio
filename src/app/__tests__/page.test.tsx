import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../page';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// mock next/navigation
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    section: ({ children, ...props }: { children: React.ReactNode }) => <section {...props}>{children}</section>,
    article: ({ children, ...props }: { children: React.ReactNode }) => <article {...props}>{children}</article>,
    h2: ({ children, ...props }: { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
    span: ({ children, ...props }: { children: React.ReactNode }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  fadeInUp: {},
  staggerContainer: {},
}));

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
  it('updates URL when "자세히 보기" button is clicked', () => {
    render(<Page />);
    
    const detailButtons = screen.getAllByText(/자세히 보기/i);
    fireEvent.click(detailButtons[0]);
    
    expect(mockPush).toHaveBeenCalled();
  });
});
