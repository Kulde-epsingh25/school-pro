const fs = require('fs');
let content = fs.readFileSync('app/(tenant)/dashboard/students/new/page.tsx', 'utf8');
content = content.replace('`).catch(() => null, { headers: { "x-user-id": user?.id || "" } }),', '`, { headers: { "x-user-id": user?.id || "" } }).catch(() => null),');
content = content.replace('`).catch(() => null, { headers: { "x-user-id": user?.id || "" } })', '`, { headers: { "x-user-id": user?.id || "" } }).catch(() => null)');
fs.writeFileSync('app/(tenant)/dashboard/students/new/page.tsx', content);
