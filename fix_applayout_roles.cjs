const fs = require('fs');
const path = './src/components/layout/AppLayout.tsx';
let content = fs.readFileSync(path, 'utf8');

// Replace the hidden sm:flex part with a responsive block
const oldBlock = `            <div className="hidden sm:flex items-center space-x-3 pl-2 sm:pl-4">
              <div className="flex flex-col items-end text-right">
                <p className="text-xs font-bold text-slate-800">{user.name}</p>
                {user.roles && user.roles.length > 1 ? (
                  <>
                    <div className="relative inline-block mt-0.5" ref={menuRef}>
                      <button
                        onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] text-emerald-700 font-black capitalize py-1 px-3 rounded-lg transition-all shadow-sm cursor-pointer select-none active:scale-95"
                      >
                        <span>Role: {user.role.replace('_', ' ')}</span>
                        <ChevronDown className={\`w-3 h-3 text-emerald-600 transition-transform duration-200 \${isRoleMenuOpen ? 'rotate-180' : ''}\`} />
                      </button>
                      <AnimatePresence>
                        {isRoleMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1 z-50 origin-top-right overflow-hidden"
                          >
                            {user.roles.map((r) => {
                              const isActive = user.role === r;
                              return (
                                <button
                                  key={r}
                                  onClick={() => {
                                    switchRole(r as Role);
                                    setIsRoleMenuOpen(false);
                                    navigate('/');
                                  }}
                                  className={\`w-full text-left px-3.5 py-2 text-[10px] font-bold capitalize transition-colors flex items-center justify-between \${
                                    isActive
                                       ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                                       : 'text-slate-600 hover:bg-slate-50'
                                  }\`}
                                >
                                  <span>{r.replace('_', ' ')}</span>
                                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] text-slate-500 capitalize">{user.role.replace('_', ' ')}</p>
                )}
              </div>
              <div 
                className="w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative cursor-pointer group shrink-0"
                onClick={() => document.getElementById('desktop-avatar-upload')?.click()}
                title="Ganti Foto Profil"
              > 
                 <UserAvatar src={user.avatar} name={user.name} className="w-full h-full" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] text-white font-bold">Edit</span>
                 </div>
              </div>
              <input 
                 type="file"
                 id="desktop-avatar-upload"
                 accept="image/*"
                 className="hidden"
                 onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        updateUser({ avatar: reader.result });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>`;

const newBlock = `            <div className="flex items-center space-x-3 pl-2 sm:pl-4">
              <div className="flex flex-col items-end text-right">
                <p className="hidden sm:block text-xs font-bold text-slate-800">{user.name}</p>
                {user.roles && user.roles.length > 1 ? (
                  <>
                    <div className="relative inline-block mt-0.5" ref={menuRef}>
                      <button
                        onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                        className="flex items-center gap-1.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-[10px] text-emerald-700 font-black capitalize py-1 px-2 sm:px-3 rounded-lg transition-all shadow-sm cursor-pointer select-none active:scale-95"
                      >
                        <span className="hidden sm:inline">Role: {user.role.replace('_', ' ')}</span>
                        <span className="sm:hidden">{user.role.replace('_', ' ')}</span>
                        <ChevronDown className={\`w-3 h-3 text-emerald-600 transition-transform duration-200 \${isRoleMenuOpen ? 'rotate-180' : ''}\`} />
                      </button>
                      <AnimatePresence>
                        {isRoleMenuOpen && (
                          <motion.div
                            initial={{ opacity: 0, y: -6, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -6, scale: 0.95 }}
                            transition={{ duration: 0.15, ease: "easeOut" }}
                            className="absolute right-0 mt-1.5 w-40 bg-white border border-slate-200/80 rounded-xl shadow-lg py-1 z-50 origin-top-right overflow-hidden"
                          >
                            {user.roles.map((r) => {
                              const isActive = user.role === r;
                              return (
                                <button
                                  key={r}
                                  onClick={() => {
                                    switchRole(r as Role);
                                    setIsRoleMenuOpen(false);
                                    navigate('/');
                                  }}
                                  className={\`w-full text-left px-3.5 py-2 text-[10px] font-bold capitalize transition-colors flex items-center justify-between \${
                                    isActive
                                       ? 'bg-emerald-50 text-emerald-700 font-extrabold'
                                       : 'text-slate-600 hover:bg-slate-50'
                                  }\`}
                                >
                                  <span>{r.replace('_', ' ')}</span>
                                  {isActive && <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />}
                                </button>
                              );
                            })}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </>
                ) : (
                  <p className="text-[10px] text-slate-500 capitalize bg-slate-100 px-2 py-0.5 rounded-md">{user.role.replace('_', ' ')}</p>
                )}
              </div>
              <div 
                className="hidden sm:block w-8 h-8 rounded-full bg-slate-200 border border-slate-300 overflow-hidden relative cursor-pointer group shrink-0"
                onClick={() => document.getElementById('desktop-avatar-upload')?.click()}
                title="Ganti Foto Profil"
              > 
                 <UserAvatar src={user.avatar} name={user.name} className="w-full h-full" />
                 <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="text-[8px] text-white font-bold">Edit</span>
                 </div>
              </div>
              <input 
                 type="file"
                 id="desktop-avatar-upload"
                 accept="image/*"
                 className="hidden"
                 onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      if (typeof reader.result === 'string') {
                        updateUser({ avatar: reader.result });
                      }
                    };
                    reader.readAsDataURL(file);
                  }
                }}
              />
            </div>`;

content = content.replace(oldBlock, newBlock);
fs.writeFileSync(path, content, 'utf8');
console.log('AppLayout roles done');
