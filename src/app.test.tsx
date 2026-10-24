import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { App } from './app';
import { projects } from './data/projects';
import { roles } from './data/experience';
import { site } from './data/site';

describe('App', () => {
  it('renders the hero with name, role and primary actions', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: site.name })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /view projects/i })).toHaveAttribute('href', '#work');
    expect(screen.getByRole('link', { name: /download resume/i })).toHaveAttribute(
      'href',
      site.resume,
    );
  });

  it('exposes the main landmarks and a primary navigation', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
    expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    const nav = screen.getByRole('navigation', { name: /primary/i });
    for (const label of ['Work', 'Experience', 'Skills', 'About', 'Contact']) {
      expect(within(nav).getByRole('link', { name: label })).toBeInTheDocument();
    }
  });

  it('renders a card for every project with its source link', () => {
    render(<App />);
    for (const project of projects) {
      const card = screen.getByRole('article', { name: project.title });
      expect(within(card).getByRole('link', { name: /^source/i })).toHaveAttribute(
        'href',
        project.source,
      );
      if (project.live) {
        expect(within(card).getByRole('link', { name: /^live/i })).toHaveAttribute(
          'href',
          project.live,
        );
      } else {
        expect(within(card).queryByRole('link', { name: /^live/i })).toBeNull();
        expect(within(card).getByText(/source only/i)).toBeInTheDocument();
      }
    }
  });

  it('renders the experience timeline with every role', () => {
    render(<App />);
    for (const role of roles) {
      expect(screen.getByRole('heading', { level: 3, name: role.company })).toBeInTheDocument();
    }
  });

  it('credits the author in the footer and links the profiles', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(within(footer).getByText(/built by/i)).toBeInTheDocument();
    expect(within(footer).getByRole('link', { name: 'Avinash Sahu' })).toHaveAttribute(
      'href',
      site.url,
    );
    expect(within(footer).getByRole('link', { name: site.email })).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
  });

  it('toggles the theme and persists the choice', () => {
    render(<App />);
    const before = document.documentElement.dataset.theme;
    fireEvent.click(screen.getByRole('button', { name: /switch to (light|dark) theme/i }));
    const after = document.documentElement.dataset.theme;
    expect(after).not.toBe(before);
    expect(localStorage.getItem('theme')).toBe(after);
  });
});
