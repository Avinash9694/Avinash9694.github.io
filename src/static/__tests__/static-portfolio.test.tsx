import { render, screen, within } from '@testing-library/react';
import { roles } from '../../data/experience';
import { projects } from '../../data/projects';
import { site } from '../../data/site';
import { StaticPortfolio } from '../static-portfolio';
import { renderStatic } from '../render-static';

describe('StaticPortfolio', () => {
  it('renders every section with its heading', () => {
    render(<StaticPortfolio />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(site.name);
    ['About', 'Experience', 'Projects', 'Contact'].forEach((label) => {
      expect(screen.getByRole('heading', { level: 2, name: label })).toBeInTheDocument();
    });
  });

  it('lists every role bullet and the hackathon line', () => {
    render(<StaticPortfolio />);
    roles.forEach((role) => {
      role.points.forEach((point) => expect(screen.getByText(point)).toBeInTheDocument());
    });
    expect(screen.getByText(/placed first overall/)).toBeInTheDocument();
  });

  it('renders a card per project with its screenshot and links', () => {
    render(<StaticPortfolio />);
    projects.forEach((project) => {
      const card = screen.getByRole('article', { name: project.title });
      expect(within(card).getByRole('img')).toHaveAttribute('src', project.screenshot);
      expect(within(card).getByRole('link', { name: /live/i })).toHaveAttribute(
        'href',
        project.live,
      );
      expect(within(card).getByRole('link', { name: /source/i })).toHaveAttribute(
        'href',
        project.source,
      );
    });
  });

  it('links the resume at its fixed path and the contact addresses', () => {
    render(<StaticPortfolio />);
    const resumes = screen.getAllByRole('link', { name: /resume/i });
    resumes.forEach((link) => expect(link).toHaveAttribute('href', '/Avinash_Sahu_Resume.pdf'));
    expect(screen.getAllByRole('link', { name: new RegExp(site.email) })[0]).toHaveAttribute(
      'href',
      `mailto:${site.email}`,
    );
  });

  it('renders to a string for prerendering, without em dashes', () => {
    const html = renderStatic();
    expect(html).toContain('<h1');
    expect(html).toContain(site.name);
    expect(html).not.toMatch(/—/);
  });
});
