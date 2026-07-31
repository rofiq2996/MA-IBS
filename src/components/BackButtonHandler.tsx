import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { App as CapacitorApp } from '@capacitor/app';
import { Capacitor } from '@capacitor/core';

export default function BackButtonHandler() {
  const location = useLocation();
  const navigate = useNavigate();

  const isNative = Capacitor.isNativePlatform();

  // Capacitor Native Back Button Handling
  useEffect(() => {
    let backListener: any;
    
    if (isNative) {
      const initListener = async () => {
        try {
          // Remove existing listeners to prevent duplicates
          await CapacitorApp.removeAllListeners();
          
          backListener = await CapacitorApp.addListener('backButton', ({ canGoBack }) => {
            if (location.pathname === '/') {
              const confirmExit = window.confirm('Apakah Anda yakin ingin keluar dari aplikasi?');
              if (confirmExit) {
                CapacitorApp.exitApp();
              }
            } else {
              // Mengarah ke menu beranda (home)
              navigate('/');
            }
          });
        } catch (e) {
          // Ignore if Capacitor is not working
        }
      };
      initListener();
    }

    return () => {
      if (backListener && backListener.remove) {
        backListener.remove();
      }
    };
  }, [location.pathname, navigate, isNative]);

  // PWA / Browser Back Button Handling
  useEffect(() => {
    if (isNative) return; // Skip PWA handling if Capacitor is active

    if (location.pathname === '/') {
      // For web/PWA, we push a state to intercept the back button
      window.history.pushState({ pwaHome: true }, '');

      const handlePopState = (event: PopStateEvent) => {
        const confirmExit = window.confirm('Apakah Anda yakin ingin keluar dari aplikasi?');
        if (confirmExit) {
          // They want to exit, go back
          window.history.back();
        } else {
          // Push state again so they stay on the home page
          window.history.pushState({ pwaHome: true }, '');
        }
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    } else {
      const handlePopState = (event: PopStateEvent) => {
        // Mengarah ke menu beranda (home) jika menekan tombol back di halaman selain home
        navigate('/', { replace: true });
      };

      window.addEventListener('popstate', handlePopState);
      return () => {
        window.removeEventListener('popstate', handlePopState);
      };
    }
  }, [location.pathname, isNative, navigate]);

  return null;
}
