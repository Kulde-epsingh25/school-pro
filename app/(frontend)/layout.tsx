import React, { ReactNode } from 'react';
import SiteHeader from '@/components/site-header';
import { HeroSection } from '@/components/frontend/hero-section';
export default function FrontLayout({children}: {
  children: ReactNode;
}) {
  return (
    <div>
      <SiteHeader/>
      
      {children}
    </div>
  );
}
