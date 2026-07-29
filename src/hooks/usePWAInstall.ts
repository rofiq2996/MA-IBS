import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string
  }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone) {
        setIsInstalled(true);
      }

      const handleBeforeInstallPrompt = (e: Event) => {
        e.preventDefault();
        setInstallPrompt(e as BeforeInstallPromptEvent);
        setIsInstallable(true);
      };

      const handleAppInstalled = () => {
        setIsInstallable(false);
        setIsInstalled(true);
        setInstallPrompt(null);
      };

      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.addEventListener('appinstalled', handleAppInstalled);

      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
        window.removeEventListener('appinstalled', handleAppInstalled);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (installPrompt) {
      try {
        await installPrompt.prompt();
        const { outcome } = await installPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstallable(false);
          setInstallPrompt(null);
        }
      } catch (err) {
        console.error('PWA Installation failed', err);
        setShowGuideModal(true);
      }
    } else {
      setShowGuideModal(true);
    }
  };

  return {
    isInstallable,
    isInstalled,
    installPrompt,
    promptInstall: handleInstallClick,
    showGuideModal,
    setShowGuideModal
  };
}
