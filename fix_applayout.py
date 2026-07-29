import re

with open('src/components/layout/AppLayout.tsx', 'r') as f:
    code = f.read()

# I need to find the `activeTerm` block inside the user profile section.
# The code currently looks like:
#                 <div className="flex flex-col items-end text-right">
#                 <div className="flex items-center gap-2 mt-0.5">
#                   {activeTerm && (
#                     <div className="relative inline-block" ref={termMenuRef}>
#                       ...
#                     </div>
#                   )}
#                 <p className="text-xs font-bold text-slate-800">{user.name}</p>

# wait, I forgot to close the `<div className="flex items-center gap-2 mt-0.5">` completely. I actually probably shouldn't have added it if I just wanted the term and the role menu to be side-by-side.
# But wait, the role menu is BELOW the user name.
# It is:
# <p>{user.name}</p>
# {user.roles ... ? ( <> <div role menu> ... </> ) : ...}
# If I just wanted to add the term menu next to the role menu, I should just wrap them together.
# Let's fix the syntax error right now by adding `</div>` after `                  )}`.
# Let's check exactly what the text is.

text_to_find = """                    </div>
                  )}"""
text_to_replace = """                    </div>
                  )}
                </div>"""

code = code.replace(text_to_find, text_to_replace, 1)

with open('src/components/layout/AppLayout.tsx', 'w') as f:
    f.write(code)

