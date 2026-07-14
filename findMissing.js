const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, 'components', 'dashboard', 'data.tsx');
const dataContent = fs.readFileSync(dataFile, 'utf8');

const regex = /url:\s*"([^"]+)"/g;
let match;
const urls = new Set();

while ((match = regex.exec(dataContent)) !== null) {
  urls.add(match[1]);
}

const baseAppDir = path.join(__dirname, 'app');
const tenantAppDir = path.join(__dirname, 'app', '(tenant)');
const saasAppDir = path.join(__dirname, 'app', '(saas)');
const portalAppDir = path.join(__dirname, 'app', '(portal)');

const missing = [];

for (const url of urls) {
  let pagePath = '';
  
  if (url.startsWith('/saas-admin')) {
    pagePath = path.join(saasAppDir, url, 'page.tsx');
  } else if (url.startsWith('/portal')) {
    pagePath = path.join(portalAppDir, url, 'page.tsx');
  } else if (url.startsWith('/dashboard') || url.startsWith('/admin') || url.startsWith('/settings') || url.startsWith('/finance')) {
    pagePath = path.join(tenantAppDir, url, 'page.tsx');
  } else {
    pagePath = path.join(baseAppDir, url, 'page.tsx');
  }
  
  // if url is exact '/dashboard', it's mapped to app/(tenant)/dashboard/page.tsx
  if (url === '/dashboard') pagePath = path.join(tenantAppDir, 'dashboard', 'page.tsx');
  
  if (!fs.existsSync(pagePath)) {
    missing.push(url);
  }
}

console.log("Missing pages:", missing);
