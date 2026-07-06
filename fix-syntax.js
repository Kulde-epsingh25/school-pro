const fs = require('fs');
let content = fs.readFileSync('app/(saas)/saas-admin/account/page.tsx', 'utf8');
content = content.replace('encodeURIComponent(email, { headers: { "x-user-id": user?.id || "" } })', 'encodeURIComponent(email)');
fs.writeFileSync('app/(saas)/saas-admin/account/page.tsx', content);
console.log('Fixed syntax error in account/page.tsx');
