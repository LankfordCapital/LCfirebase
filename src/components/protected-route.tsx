'use client';

import { ReactNode } from 'react';

export const ProtectedRoute = ({
  children,
}: {
  children: ReactNode;
}) => {
  // This component is now a pass-through, allowing direct access to all dashboards.
  return <>{children}</>;
};
