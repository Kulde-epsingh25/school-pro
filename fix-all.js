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
       if (content.includes('x-user-id') && !content.includes('const user = useAuthStore(')) {
          console.log('Fixing ' + full);
          
          if (!content.includes('import { useAuthStore }')) {
            content = content.replace(/import React/, 'import { useAuthStore } from "@/store/authStore";\nimport React');
          }
          
          content = content.replace(/export default function\s+\w+\([^)]*\)\s*\{/, match => match + '\n  const user = useAuthStore((state) => state.user);');
          
          fs.writeFileSync(full, content);
       }
    }
  }
}
search('app');
