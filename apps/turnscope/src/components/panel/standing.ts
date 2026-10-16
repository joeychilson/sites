import type { Standing } from '@/lib/demo';

// Grayscale until something needs the person: amber while a limit runs out, red once it's used up.
export const ink: Record<Standing, string> = {
  lasts: '',
  runningOut: 'text-warning',
  usedUp: 'text-error',
};

export const fill: Record<Standing, string> = {
  lasts: 'bg-label-secondary',
  runningOut: 'bg-warning',
  usedUp: 'bg-error',
};
