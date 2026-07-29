const fs = require('fs');
let code = fs.readFileSync('src/components/layout/AppLayout.tsx', 'utf8');

if (!code.includes('usePWAInstall')) {
  code = code.replace(
    "import { UserAvatar } from '../ui/UserAvatar';",
    "import { UserAvatar } from '../ui/UserAvatar';\nimport { usePWAInstall } from '../../hooks/usePWAInstall';\nimport { Download } from 'lucide-react';"
  );

  code = code.replace(
    "const navigate = useNavigate();",
    "const navigate = useNavigate();\n  const { isInstallable, promptInstall } = usePWAInstall();"
  );

  const installButton = `
            <div className="flex items-center space-x-2 sm:pl-4 sm:border-l border-slate-200">
              {isInstallable && (
                <button
                  onClick={promptInstall}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full text-xs font-bold transition-colors mr-2 cursor-pointer"
                  title="Install Aplikasi"
                >
                  <Download className="w-3.5 h-3.5" />
                  Install App
                </button>
              )}
              {isInstallable && (
                <button
                  onClick={promptInstall}
                  className="sm:hidden flex items-center justify-center w-8 h-8 bg-emerald-100 hover:bg-emerald-200 text-emerald-800 rounded-full transition-colors mr-1 cursor-pointer"
                  title="Install Aplikasi"
                >
                  <Download className="w-4 h-4" />
                </button>
              )}
              <button onClick={() => navigate('/notifications')} className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">`;

  code = code.replace(
    `<div className="flex items-center space-x-2 sm:pl-4 sm:border-l border-slate-200">
              <button onClick={() => navigate('/notifications')} className="relative flex items-center justify-center w-8 h-8 rounded-full hover:bg-slate-100 cursor-pointer text-slate-600 transition-colors">`,
    installButton
  );

  fs.writeFileSync('src/components/layout/AppLayout.tsx', code);
}
