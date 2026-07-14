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

// Function to recursively find all page.tsx files
function getAllPages(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getAllPages(filePath, fileList);
    } else if (file === 'page.tsx') {
      fileList.push(filePath);
    }
  }
  return fileList;
}

const allPages = getAllPages(path.join(__dirname, 'app'));

// Map physical paths to URLs by stripping (group) folders
const urlToPageMap = {};
for (const pagePath of allPages) {
  // e.g. C:\...\app\(tenant)\dashboard\academics\page.tsx
  let relativePath = path.relative(path.join(__dirname, 'app'), pagePath);
  // remove page.tsx
  relativePath = relativePath.replace(/\\page\.tsx$/, '').replace(/\/page\.tsx$/, '');
  // replace backslashes
  relativePath = relativePath.replace(/\\/g, '/');
  // remove (folder) segments
  const parts = relativePath.split('/');
  const cleanParts = parts.filter(p => !p.startsWith('(') && !p.endsWith(')'));
  
  const finalUrl = '/' + cleanParts.join('/');
  urlToPageMap[finalUrl] = pagePath;
  
  // also map with trailing slash just in case
  if (finalUrl === '/') {
    urlToPageMap[''] = pagePath;
  }
}

const missing = [];
for (const url of urls) {
  if (!urlToPageMap[url]) {
    missing.push(url);
  }
}

console.log("Actually missing pages based on Next.js routing:");
missing.forEach(m => console.log(m));
