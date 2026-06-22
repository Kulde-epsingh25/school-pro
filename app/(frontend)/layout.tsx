import React, { ReactNode } from 'react';
import SiteHeader from '@/components/site-header';
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
