'use client';

import { ReactNode } from 'react';
import { useAuth } from '@/lib/auth';

interface ProvidersProps {
  children: ReactNode;
}

export default function Providers({ children }: ProvidersProps) {
  // Just render children - the useAuth hook will initialize the auth state
  // This ensures the auth context is available throughout the app
  useAuth();

  return <>{children}</>;
}
