const fs = require('fs');
let content = fs.readFileSync('src/pages/KamadPages.tsx', 'utf8');

const oldBlock = `  const fetchRequests = () => {
    setLoading(true);
    apiClient('/query.php', {
      method: 'POST',
      body: JSON.stringify({
        query: \`
          SELECT lr.*, u.name as user_name, u.role as user_role 
          FROM leave_requests lr
          JOIN users u ON lr.user_id = u.id
          ORDER BY lr.created_at DESC
        \`
      })
    })
    .then(data => {
      if (Array.isArray(data)) setRequests(data);
    })
    .catch(console.error)
    .finally(() => setLoading(false));
  };`;

const newBlock = `  const fetchRequests = async () => {
    setLoading(true);
    try {
      const [leaves, users] = await Promise.all([
        apiClient('/crud.php?table=leave_requests').catch(() => []),
        apiClient('/crud.php?table=users').catch(() => [])
      ]);
      
      if (Array.isArray(leaves) && Array.isArray(users)) {
        const enriched = leaves.map(l => {
          const user = users.find(u => String(u.id) === String(l.user_id));
          return {
            ...l,
            user_name: user ? user.name : 'Unknown User',
            user_role: user ? user.role : 'Staf'
          };
        });
        
        // Sort by created_at DESC
        enriched.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        setRequests(enriched);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };`;

if (content.includes("apiClient('/query.php'")) {
    content = content.replace(oldBlock, newBlock);
    fs.writeFileSync('src/pages/KamadPages.tsx', content);
    console.log('Patched fetchRequests');
} else {
    console.log('Block not found');
}
