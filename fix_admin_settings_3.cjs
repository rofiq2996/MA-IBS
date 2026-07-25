const fs = require('fs');
let content = fs.readFileSync('src/pages/AdminSettings.tsx', 'utf8');

// The string in question:
/*
      // Update in localStorage
      if (typeof window !== 'undefined') {
        
        
              
            }
          } catch(e) {}
        }
      }
*/

content = content.replace(/\/\/ Update in localStorage\s*if \(typeof window !== 'undefined'\) \{\s*\}\s*catch\(e\) \{\}\s*\}\s*\}/g, '');
content = content.replace(/if \(typeof window !== 'undefined'\) \{\s*\}\s*catch\(e\) \{\}\s*\}\s*\}/g, '');

fs.writeFileSync('src/pages/AdminSettings.tsx', content);
