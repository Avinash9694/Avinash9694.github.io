import { useEffect, useMemo, useState } from 'react';
import { navItems, site } from '../data/site';
import { useActiveSection } from '../hooks/use-active-section';
import type { Theme } from '../hooks/use-theme';
import { CloseIcon, MenuIcon } from './icons';
import { ThemeToggle } from './theme-toggle';
import styles from './nav.module.css';

interface NavProps {
  theme: Theme;
  onToggleTheme: () => void;
}

export function Nav({ theme, onToggleTheme }: NavProps) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const ids = useMemo(() => navItems.map((item) => item.id), []);
  const active = useActiveSection(ids);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const close = () => setOpen(false);

  return (
    <header className={`${styles.header} ${scrolled || open ? styles.scrolled : ''}`}>
      <nav className={`${styles.nav} container`} aria-label="Primary">
        <a href="#top" className={`${styles.brand} mono`} onClick={close}>
          <span className={styles.brandMark} aria-hidden="true" />
          {site.name.toLowerCase().replace(' ', '.')}
        </a>

        <ul className={styles.links}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.link} ${active === item.id ? styles.linkActive : ''}`}
                aria-current={active === item.id ? 'location' : undefined}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <a href={site.resume} className={styles.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
          <ThemeToggle theme={theme} onToggle={onToggleTheme} />
          <button
            type="button"
            className={styles.menuButton}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((value) => !value)}
          >
            {open ? <CloseIcon size={20} /> : <MenuIcon size={20} />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        className={`${styles.mobile} ${open ? styles.mobileOpen : ''}`}
        hidden={!open}
      >
        <ul className={`${styles.mobileList} container`}>
          {navItems.map((item) => (
            <li key={item.id}>
              <a
                href={`#${item.id}`}
                className={`${styles.mobileLink} ${active === item.id ? styles.linkActive : ''}`}
                onClick={close}
              >
                {item.label}
              </a>
            </li>
          ))}
          <li>
            <a
              href={site.resume}
              className={styles.mobileLink}
              target="_blank"
              rel="noreferrer"
              onClick={close}
            >
              Resume
            </a>
          </li>
        </ul>
      </div>
    </header>
  );
}
