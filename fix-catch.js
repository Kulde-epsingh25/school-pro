const fs = require('fs');
const path = require('path');
function search(d) {
  const files = fs.readdirSync(d);
  for (const f of files) {
    const full = path.join(d, f);
    if (fs.statSync(full).isDirectory()) {
       if (f !== 'node_modules' && f !== '.next' && f !== 'backend') search(full);
    } else if (full.endsWith('.tsx')) {
       let content = fs.readFileSync(full, 'utf8');
       if (content.includes('.catch(() => null, { headers')) {
          console.log('Fixing catch in ' + full);
          content = content.replace(/\.catch\(\(\) => null, \{ headers: \{ "x-user-id": user\?\.id \|\| "" \} \}\)/g, ', { headers: { "x-user-id": user?.id || "" } }).catch(() => null)');
          fs.writeFileSync(full, content);
       }
    }
  }
}
search('app');
