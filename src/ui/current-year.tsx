import { useEffect, useState } from 'react';

/** The build year at first render (matches the prerendered HTML), then the visitor's current year. */
export function CurrentYear() {
  const [year, setYear] = useState<number>(__BUILD_YEAR__);
  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);
  return <>{year}</>;
}
