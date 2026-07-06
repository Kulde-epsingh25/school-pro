const fs = require('fs');
const path = require('path');
const targetFiles = [
  'app/(saas)/saas-admin/account/page.tsx',
  'app/(saas)/saas-admin/audit/page.tsx',
  'app/(saas)/saas-admin/page.tsx',
  'app/(saas)/saas-admin/settings/page.tsx',
  'app/(saas)/saas-admin/tenants/new/page.tsx',
  'app/(saas)/saas-admin/tenants/page.tsx',
  'app/(saas)/saas-admin/tenants/[id]/page.tsx',
  'app/(saas)/saas-admin/users/page.tsx'
];

targetFiles.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  if (!content.includes('import { useAuthStore }')) {
    content = content.replace(/import React/, 'import { useAuthStore } from "@/store/authStore";\nimport React');
    fs.writeFileSync(file, content);
    console.log('Fixed import in ' + file);
  }
});
