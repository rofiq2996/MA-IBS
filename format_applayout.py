import re

with open('src/components/layout/AppLayout.tsx', 'r') as f:
    code = f.read()

# We need to replace the flex container and its children.
# Let's extract exactly from <div className="flex flex-col items-end text-right"> 
# until the end of that div (where avatar starts).

start_marker = '<div className="flex flex-col items-end text-right">'
# let's find where user.roles block ends.
# It's at 
#                 )}
#               </div>
#               <div 
#                 className="w-8 h-8 rounded-full

end_marker = '              <div \n                className="w-8 h-8 rounded-full'

if start_marker in code and end_marker in code:
    start_idx = code.find(start_marker)
    end_idx = code.find(end_marker)
    
    # We will replace this whole chunk.
    # We need to extract the raw activeTerm block and role block to keep their inner logic!
    chunk = code[start_idx:end_idx]
    
    activeTerm_block_match = re.search(r'\{activeTerm && \([\s\S]*?<\/AnimatePresence>\s*<\/div>\s*\)\}', chunk)
    activeTerm_block = activeTerm_block_match.group(0) if activeTerm_block_match else ""
    
    role_block_match = re.search(r'\{user\.roles && user\.roles\.length > 1 \? \([\s\S]*?\) : \([\s\S]*?<\/p>\s*\)\}', chunk)
    role_block = role_block_match.group(0) if role_block_match else ""
    
    # Modify role_block else part to hide on mobile if it's just text
    role_block = role_block.replace('<p className="text-[10px]', '<p className="hidden sm:block text-[10px]')
    
    new_chunk = f'''<div className="flex flex-col items-end gap-1.5 text-right">
                <p className="hidden sm:block text-xs font-bold text-slate-800">{{user.name}}</p>
                <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1.5 sm:gap-2">
                  {role_block}
                  {activeTerm_block}
                </div>
              </div>
'''
    
    code = code[:start_idx] + new_chunk + code[end_idx:]
    
    # Also we need to hide avatar on mobile
    code = code.replace(
        'className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative cursor-pointer group shrink-0"',
        'className="hidden sm:block w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative cursor-pointer group shrink-0"'
    )
    
    with open('src/components/layout/AppLayout.tsx', 'w') as f:
        f.write(code)
    print("Replaced successfully")
else:
    print("Markers not found")

