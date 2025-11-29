'use client';

import AuthLayout from './AuthLayout';
import Providers from './Providers';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <AuthLayout>
        {children}
      </AuthLayout>
    </Providers>
  );
}
