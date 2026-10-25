import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { CurrentYear } from '../current-year';

describe('CurrentYear', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows the visitor's year, not the year the site was built", () => {
    vi.useFakeTimers({ toFake: ['Date'] });
    vi.setSystemTime(new Date('2031-03-01T00:00:00Z'));
    render(<CurrentYear />);
    expect(screen.getByText('2031')).toBeInTheDocument();
  });
});
