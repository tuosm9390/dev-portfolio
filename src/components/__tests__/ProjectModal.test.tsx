import { render, screen } from '@testing-library/react';
import ProjectModal from '../ProjectModal';
import { projects } from '@/data/projects';
import { describe, it, expect } from 'vitest';

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
