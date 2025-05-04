import type { ReactNode } from 'react';

import useDevMode from '@/ui/hooks/useDevMode';

type DebugOnlyProps = {
  children: ReactNode;
};

export default function DebugOnly({ children }: DebugOnlyProps) {
  const isDevMode = useDevMode();

  if (!isDevMode) {
    return null;
  }

  return children;
}
