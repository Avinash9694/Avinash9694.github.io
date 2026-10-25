import { projects } from '../data/projects';

export function openProject(index: number): void {
  const project = projects[index];
  if (project) window.open(project.live, '_blank', 'noopener,noreferrer');
}
