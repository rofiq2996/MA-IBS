const fs = require('fs');
let code = fs.readFileSync('src/pages/Login.tsx', 'utf8');

// 1. Add imports
code = code.replace(
  "import { KeyRound, User as UserIcon, Eye, EyeOff } from 'lucide-react';",
  "import { KeyRound, User as UserIcon, Eye, EyeOff, X } from 'lucide-react';"
);

// 2. Add states
code = code.replace(
  "  const [loading, setLoading] = useState(false);",
  `  const [loading, setLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);
  const [forgotUsername, setForgotUsername] = useState('');
  const [forgotStatus, setForgotStatus] = useState<'idle' | 'loading' | 'success'>('idle');`
);

// 3. Add handleForgotPassword
code = code.replace(
  "  if (user) {",
  `  const handleForgotPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setForgotStatus('loading');
    
    // Simulasi pengiriman request reset password
    setTimeout(() => {
      setForgotStatus('success');
    }, 1200);
  };

  const closeForgotModal = () => {
    setShowForgotModal(false);
    setTimeout(() => {
      setForgotStatus('idle');
      setForgotUsername('');
    }, 300);
  };

  if (user) {`
);

// 4. Update the Lupa Password link
code = code.replace(
  '<a href="#" onClick={(e) => { e.preventDefault(); alert("Silahkan hubungi administrator madrasah untuk mereset password Anda."); }} className="text-[10px] md:text-xs font-bold text-[#b49021] hover:text-[#d4aa27] transition-colors">Lupa Password?</a>',
  '<a href="#" onClick={(e) => { e.preventDefault(); setShowForgotModal(true); }} className="text-[10px] md:text-xs font-bold text-[#b49021] hover:text-[#d4aa27] transition-colors">Lupa Password?</a>'
);

// 5. Add the Modal JSX at the end, right before the last </div>  );
code = code.replace(
  '    </div>\n  );\n}',
  `    </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
            <div className="p-4 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <h3 className="font-bold text-slate-800 text-lg">Reset Password</h3>
              <button onClick={closeForgotModal} className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-4 md:p-6">
              {forgotStatus === 'success' ? (
                <div className="text-center py-4">
                  <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h4 className="font-bold text-slate-800 text-lg mb-2">Permintaan Terkirim!</h4>
                  <p className="text-sm text-slate-600 mb-6">
                    Permintaan reset password untuk <span className="font-semibold text-slate-800">{forgotUsername}</span> telah diteruskan ke administrator madrasah.
                  </p>
                  <div className="flex flex-col gap-3">
                    <a 
                      href={"https://wa.me/6281234567890?text=Halo%20Admin%2C%20saya%20ingin%20mereset%20password%20untuk%20akun%20dengan%20username/NIS%3A%20" + forgotUsername} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-full bg-[#25D366] hover:bg-[#128C7E] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md text-sm flex items-center justify-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                      Hubungi via WhatsApp
                    </a>
                    <button onClick={closeForgotModal} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 px-4 rounded-xl transition-all text-sm">
                      Tutup
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <p className="text-sm text-slate-600 mb-2">
                    Masukkan Username atau NIS Anda. Sistem akan mengirimkan notifikasi permintaan reset password ke administrator madrasah.
                  </p>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Username / NIS</label>
                    <input
                      type="text"
                      value={forgotUsername}
                      onChange={(e) => setForgotUsername(e.target.value)}
                      className="block w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 bg-white outline-none transition-all placeholder:text-slate-400"
                      placeholder="Masukkan Username / NIS Anda"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={forgotStatus === 'loading' || !forgotUsername.trim()}
                    className="w-full bg-[#126442] hover:bg-[#0e4e33] text-white font-bold py-2.5 px-4 rounded-xl transition-all shadow-md flex items-center justify-center disabled:opacity-70 text-sm mt-4"
                  >
                    {forgotStatus === 'loading' ? 'Memproses...' : 'Kirim Permintaan Reset'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}`
);

fs.writeFileSync('src/pages/Login.tsx', code);
console.log("Patched successfully");
