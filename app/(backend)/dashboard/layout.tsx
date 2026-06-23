import { HeroSection } from '@/components/frontend/hero-section';
import React, { ReactNode } from 'react';

export default function DashboardLayout({children}: {
  children: ReactNode;
}) {
  return (
    <div>
      
        {children}
    </div>
  );
}
