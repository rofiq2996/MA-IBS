import re

with open('src/components/layout/AppLayout.tsx', 'r') as f:
    code = f.read()

# 1. Extract the activeTerm block
term_block_pattern = r'(\s*<div className="flex items-center gap-2 mt-0\.5">\s*\{activeTerm && \(\s*<div className="relative inline-block" ref=\{termMenuRef\}>[\s\S]*?<\/AnimatePresence>\s*<\/div>\s*\)\}\s*<\/div>)'

match = re.search(term_block_pattern, code)
if match:
    term_block = match.group(1)
    code = code.replace(term_block, '')
    
    # We want just the {activeTerm && ( ... )} part, without the outer flex div
    # Wait, the outer flex div was added by me. I'll just keep the inner part.
    inner_term_block = re.search(r'(\s*\{activeTerm && \([\s\S]*?<\/div>\s*\)\})', term_block).group(1)
    
    # 2. Insert it next to the role menu
    # The role menu is inside:
    # {user.roles && user.roles.length > 1 ? (
    #   <>
    #     <div className="relative inline-block" ref={menuRef}>
    
    # We want to change the <> to <div className="flex items-center gap-2 mt-0.5">
    # and insert inner_term_block there.
    
    # Wait, what if the user has ONLY ONE role? (e.g. Ortu or Siswa).
    # Then `user.roles && user.roles.length > 1` is false!
    # If it's false, they wouldn't see the term menu if I put it inside that condition!
    # So I must put it OUTSIDE the condition, but grouped with it.
    
    # Let's wrap the role menu block and the term menu in a flex row.
    # Replace:
    # <p className="text-xs font-bold text-slate-800">{user.name}</p>
    # {user.roles ...}
    # With:
    # <p className="text-xs font-bold text-slate-800">{user.name}</p>
    # <div className="flex items-center gap-2 mt-0.5">
    #   {inner_term_block}
    #   {user.roles ...}
    # </div>
    
    target = r'(<p className="text-xs font-bold text-slate-800">\{user\.name\}<\/p>\s*)(\{user\.roles && user\.roles\.length > 1 \? \([\s\S]*?<\/AnimatePresence>\s*<\/div>\s*<\/>\s*\) : null\})'
    
    match2 = re.search(target, code)
    if match2:
        p_tag = match2.group(1)
        role_block = match2.group(2)
        
        # fix the fragment in role_block to not be fragment if we wrap in div?
        # Fragment is fine.
        new_block = p_tag + '                <div className="flex items-center gap-2 mt-0.5">\n' + inner_term_block + '\n                  ' + role_block + '\n                </div>'
        
        code = code[:match2.start()] + new_block + code[match2.end():]
        
        with open('src/components/layout/AppLayout.tsx', 'w') as f:
            f.write(code)
            
