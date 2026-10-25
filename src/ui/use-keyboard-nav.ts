import { useEffect } from 'react';
import { SECTION_COUNT } from '../data/site';
import { PROJECT_COUNT } from '../data/projects';
import { roles } from '../data/experience';
import {
  EXPERIENCE_SECTION,
  PROJECTS_SECTION,
  activeProject,
  activeRole,
  sectionFromProgress,
} from '../lib/progress-map';
import { openProject } from '../lib/open-project';
import { goToProject, goToRole, goToSection } from '../lib/scroll-controller';
import { useSceneStore } from '../store/scene-store';

function isTyping(target: EventTarget | null): boolean {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(input|textarea|select)$/i.test(target.tagName);
}

function focusedProjectCard(target: EventTarget | null): number | null {
  if (!(target instanceof HTMLElement)) return null;
  const value = target.dataset.projectCard;
  return value === undefined ? null : Number(value);
}

/** Up/Down step sections; Left/Right step roles or projects; Enter opens a focused project card. */
export function useKeyboardNav(): void {
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey || isTyping(event.target)) return;
      const progress = useSceneStore.getState().progress;
      const section = sectionFromProgress(progress);
      switch (event.key) {
        case 'ArrowDown':
        case 'PageDown':
          goToSection(Math.min(SECTION_COUNT - 1, section + 1));
          break;
        case 'ArrowUp':
        case 'PageUp':
          goToSection(Math.max(0, section - 1));
          break;
        case 'Home':
          goToSection(0);
          break;
        case 'End':
          goToSection(SECTION_COUNT - 1);
          break;
        case 'Enter': {
          const card = focusedProjectCard(event.target);
          if (card === null) return;
          openProject(card);
          break;
        }
        case 'ArrowRight':
          if (section === PROJECTS_SECTION)
            goToProject((activeProject(progress) + 1) % PROJECT_COUNT);
          else if (section === EXPERIENCE_SECTION)
            goToRole((activeRole(progress) + 1) % roles.length);
          else return;
          break;
        case 'ArrowLeft':
          if (section === PROJECTS_SECTION)
            goToProject((activeProject(progress) - 1 + PROJECT_COUNT) % PROJECT_COUNT);
          else if (section === EXPERIENCE_SECTION)
            goToRole((activeRole(progress) - 1 + roles.length) % roles.length);
          else return;
          break;
        default:
          return;
      }
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
}
