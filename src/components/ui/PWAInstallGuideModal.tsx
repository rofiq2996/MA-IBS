import React from 'react';
import { Download, Smartphone, CheckCircle, X, ExternalLink, Share } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onNativePrompt?: () => void;
  hasNativePrompt?: boolean;
}

export function PWAInstallGuideModal({ isOpen, onClose, onNativePrompt, hasNativePrompt }: Props) {
  if (!isOpen) return null;

  const isIOS = typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden my-8"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-700 to-teal-800 p-5 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur border border-white/20 flex items-center justify-center shrink-0">
                <Smartphone className="w-6 h-6 text-emerald-200" />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-wide">Instal SIKAT di HP</h3>
                <p className="text-xs text-emerald-100 font-medium">Pasang sebagai aplikasi Android / PWA</p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-5 space-y-4">
            {hasNativePrompt && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                <button
                  onClick={() => {
                    onClose();
                    if (onNativePrompt) onNativePrompt();
                  }}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm transition-all shadow-md active:scale-95 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  Instal Sekarang (Satu Klik)
                </button>
              </div>
            )}

            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {isIOS ? 'Petunjuk Instalasi iOS (Safari)' : 'Petunjuk Instalasi Android (Chrome / Browser)'}
              </h4>

              {!isIOS ? (
                <ol className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-900">Buka di Browser Chrome</p>
                      <p className="text-[11px] text-slate-500">Pastikan Anda membuka website ini menggunakan browser Google Chrome di HP Android.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-900">Ketuk Tombol Menu (Titik Tiga)</p>
                      <p className="text-[11px] text-slate-500">Ketuk ikon tiga titik <span className="font-bold text-slate-800">⋮</span> di pojok kanan atas browser Chrome.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">3</span>
                    <div>
                      <p className="font-bold text-slate-900">Pilih "Instal aplikasi" atau "Tambahkan ke Layar Utama"</p>
                      <p className="text-[11px] text-slate-500">Pilih menu <span className="font-bold text-emerald-700">"Instal aplikasi"</span> / <span className="font-bold text-emerald-700">"Add to Home screen"</span>.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2.5 bg-emerald-50 rounded-xl border border-emerald-100">
                    <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold text-emerald-900">Selesai!</p>
                      <p className="text-[11px] text-emerald-700">Aplikasi SIKAT akan muncul di layar utama HP seperti aplikasi dari Play Store.</p>
                    </div>
                  </li>
                </ol>
              ) : (
                <ol className="space-y-2.5 text-xs text-slate-700">
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">1</span>
                    <div>
                      <p className="font-bold text-slate-900">Buka di Safari</p>
                      <p className="text-[11px] text-slate-500">Pastikan Anda mengakses tautan ini melalui browser Safari di iPhone/iPad.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">2</span>
                    <div>
                      <p className="font-bold text-slate-900 flex items-center gap-1">Ketuk Tombol Bagikan <Share className="w-3.5 h-3.5 text-blue-600" /></p>
                      <p className="text-[11px] text-slate-500">Ketuk ikon 'Bagikan' di bagian bawah layar Safari.</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3 p-2.5 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-xs shrink-0">3</span>
                    <div>
                      <p className="font-bold text-slate-900">Pilih "Tambahkan ke Layar Utama"</p>
                      <p className="text-[11px] text-slate-500">Gulir ke bawah dan pilih opsi <span className="font-bold text-emerald-700">"Add to Home Screen"</span>.</p>
                    </div>
                  </li>
                </ol>
              )}
            </div>

            <div className="pt-2 text-center">
              <button
                onClick={onClose}
                className="w-full py-2 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs transition-colors cursor-pointer"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
