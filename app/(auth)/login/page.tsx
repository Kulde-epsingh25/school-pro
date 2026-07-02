import LoginV2 from '@/components/frontend/login';
import React from 'react';
import { getServerUser } from '@/actions/auth';
import { redirect } from 'next/navigation';

export default async function page() {
    const user = await getServerUser();
    
    if (user) {
        if (user.role === 'super_admin') {
            redirect('/school-onboarding');
        } else {
            redirect('/dashboard');
        }
    }

    return (
        <div>
            <LoginV2 />
        </div>
    );
}