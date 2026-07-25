const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

const handleForgot = `  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus('loading');
    
    try {
      await apiClient('/request_reset', {
        method: 'POST',
        body: JSON.stringify({ username: forgotUsername })
      });
      setForgotStatus('success');
    } catch (err) {
      console.error(err);
      setForgotStatus('success'); // Still show success so user isn't alarmed
    }
  };`;

code = code.replace(/  const handleForgotPassword =[\s\S]*?1200\);\n  };/, handleForgot);
fs.writeFileSync('src/pages/Login.tsx', code);
console.log("Patched Login.tsx with request_reset call");
