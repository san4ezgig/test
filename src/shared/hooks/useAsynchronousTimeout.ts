import { useEffect } from 'react';

export const useAsynchronousTimeout = (clb: () => Promise<void>, delay: number = 50000, dependencies: any[] = []) => {
  useEffect(() => {
    let timeoutId = setTimeout(async function tick() {
      await clb();

      timeoutId = setTimeout(tick, delay);
    }, delay);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clb, delay, ...dependencies]);
};
