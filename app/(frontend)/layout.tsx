import React, { ReactNode } from 'react';
import SiteHeader from '@/components/frontend/site-header';
import { HeroSection } from '@/components/frontend/hero-section';
import SiteFooter from '@/components/frontend/site-footer';
export default function FrontLayout({children}: {
  children: ReactNode;
}) {
  return (
    <div>
      <SiteHeader/>
      
      {children}

      <SiteFooter/>
    </div>
  );
}
