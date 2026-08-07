const fs = require('fs');
let content = fs.readFileSync('src/pages/Perizinan.tsx', 'utf8');

const oldBlock = `  const fetchRequests = () => {
    setLoading(true);
    apiClient('/query.php', {
      method: 'POST',
      body: JSON.stringify({
        query: \`
          SELECT * FROM leave_requests 
          WHERE user_id = \${user?.id}
          ORDER BY created_at DESC
        \`
      })
    })
    .then(data => {
      if (Array.isArray(data)) setRequests(data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };`;

const newBlock = `  const fetchRequests = () => {
    setLoading(true);
    apiClient('/crud.php?table=leave_requests')
      .then(data => {
        if (Array.isArray(data)) {
          const myRequests = data.filter(r => String(r.user_id) === String(user?.id));
          myRequests.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          setRequests(myRequests);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };`;

if (content.includes("apiClient('/query.php'")) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/pages/Perizinan.tsx', content);
    console.log('Patched fetchRequests in Perizinan');
} else {
    console.log('Block not found');
}
