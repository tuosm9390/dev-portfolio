import { render, screen } from '@testing-library/react';
import ProjectModal from '../ProjectModal';
import { projects } from '@/data/projects';
import { describe, it, expect, vi } from 'vitest';
import React from 'react';

// mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
  useSearchParams: () => new URLSearchParams(),
  usePathname: () => '/',
}));

// mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: { children: React.ReactNode }) => <div {...props}>{children}</div>,
    article: ({ children, ...props }: { children: React.ReactNode }) => <article {...props}>{children}</article>,
    h2: ({ children, ...props }: { children: React.ReactNode }) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: { children: React.ReactNode }) => <p {...props}>{children}</p>,
  },
  AnimatePresence: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

describe('ProjectModal', () => {
  const mockProject = projects[0];

  it('renders correctly when project data is provided', () => {
    render(
      <ProjectModal 
        project={mockProject} 
        isOpen={true} 
        onClose={() => {}} 
      />
    );

    expect(screen.getByText(mockProject.title)).toBeInTheDocument();
    expect(screen.getByText(mockProject.summary)).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    const { container } = render(
      <ProjectModal 
        project={mockProject} 
        isOpen={false} 
        onClose={() => {}} 
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
