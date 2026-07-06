const fs = require('fs');
const path = require('path');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // Add import if needed
  if (!content.includes('useAuthStore')) {
    content = content.replace(/import .* from ['"]@\/store\/schoolStore['"];/, match => match + '\nimport { useAuthStore } from "@/store/authStore";');
  }

  // Add const user if needed
  if (!content.includes('const user = useAuthStore(')) {
    content = content.replace(/const school = useSchoolStore\(.*\);/, match => match + '\n  const user = useAuthStore((state) => state.user);');
  }

  // Replace fetch(...) without options
  const fetchRegexNoOpts = /fetch\(([^,\n]+)\)/g;
  content = content.replace(fetchRegexNoOpts, (match, urlArg) => {
    return 'fetch(' + urlArg + ', { headers: { "x-user-id": user?.id || "" } })';
  });

  // Replace fetch(..., { ... }) by injecting the header
  const fetchRegexWithOpts = /fetch\(([^,\n]+),\s*\{([\s\S]*?)\}\)/g;
  content = content.replace(fetchRegexWithOpts, (match, urlArg, opts) => {
    if (opts.includes('x-user-id')) return match;
    
    if (opts.includes('headers: {')) {
       return match.replace(/headers:\s*\{/, 'headers: { "x-user-id": user?.id || "",');
    } else {
       return 'fetch(' + urlArg + ', {' + opts + ', headers: { "x-user-id": user?.id || "" } })';
    }
  });

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    console.log('Updated ' + filePath);
  }
}

const targetFiles = [
  'app/(tenant)/admin/audit/page.tsx',
  'app/(tenant)/admin/contacts/page.tsx',
  'app/(tenant)/admin/settings/security/page.tsx',
  'app/(tenant)/admin/users/page.tsx',
  'app/(tenant)/dashboard/academics/classes/page.tsx',
  'app/(tenant)/dashboard/academics/terms/page.tsx',
  'app/(tenant)/dashboard/finance/fees/new/page.tsx',
  'app/(tenant)/dashboard/finance/fees/page.tsx',
  'app/(tenant)/dashboard/finance/payments/page.tsx',
  'app/(tenant)/dashboard/students/new/page.tsx',
  'app/(tenant)/dashboard/students/page.tsx',
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
  try {
     const fullPath = path.join(__dirname, file);
     if (fs.existsSync(fullPath)) {
       processFile(fullPath);
     }
  } catch (e) {
     console.error('Error on ' + file + ':', e.message);
  }
});
