import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { LandingPage } from './components/LandingPage';
import { ProcessingStudio } from './components/ProcessingStudio';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { BillingPage } from './components/BillingPage';
import { X } from 'lucide-react';
import { useAuth } from './hooks/useAuth';


interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

type Theme = 'light' | 'dark';
type CurrentView = 'landing' | 'studio' | 'profile' | 'settings' | 'billing';

function App() {
  const { user, loading, signOut, deductCredits, logProcessing } = useAuth();
  
  // Theme state
  const [theme, setTheme] = useState<Theme>(() => {
    const saved = localStorage.getItem('photocraft-theme');
    return (saved as Theme) || 'light';
  });

  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentView, setCurrentView] = useState<CurrentView>('landing');

  // UI state
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Theme toggle effect
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('photocraft-theme', theme);
  }, [theme]);


  // Toast management
  const addToast = (message: string, type: Toast['type'] = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };


  const handleSignOut = async () => {
    await signOut();
    setCurrentView('landing');
    addToast('You have been signed out successfully.', 'info');
  };

  const handleGetStarted = () => {
    if (user) {
      setCurrentView('studio');
    } else {
      setShowAuthModal(true);
    }
  };

  // Navigation handlers
  const handleLogoClick = () => {
    setCurrentView('landing');
  };

  const handleNavigateToSection = (sectionId: string) => {
    if (currentView !== 'landing') {
      setCurrentView('landing');
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleModeSelect = (mode: string) => {
    if (user) {
      setCurrentView('studio');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleSaveProject = () => {
    addToast('Project saved successfully!', 'success');
    // No credit deduction for saving - only for downloads
  };

  const handleDownloadImage = () => {
    if (user && !user.is_admin) {
      deductCredits(4);
      logProcessing('download', 4);
      addToast('Image downloaded! 4 credits used.', 'info');
    } else if (user?.is_admin) {
      addToast('Image downloaded! (Admin - Free Download)', 'success');
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  // Page navigation handlers
  const handleShowProfile = () => {
    setCurrentView('profile');
  };

  const handleShowSettings = () => {
    setCurrentView('settings');
  };

  const handleShowBilling = () => {
    setCurrentView('billing');
  };

  const handleUpdateUser = (updatedUser: Partial<User>) => {
    // This will be handled by the useAuth hook
    addToast('Profile updated successfully!', 'success');
  };

  const handleUpdateSettings = (settings: any) => {
    addToast('Settings updated successfully!', 'success');
  };

  const handleUpgrade = (plan: string) => {
    // This will be implemented with real payment processing
    addToast(`🎉 Payment integration coming soon! You selected ${plan} plan.`, 'info');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading PhotoCraft AI...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-colors duration-300">
        {/* Header */}
        <Header
          theme={theme}
          onThemeToggle={toggleTheme}
          user={user}
          onSignOut={handleSignOut}
          onShowAuth={() => setShowAuthModal(true)}
          onLogoClick={handleLogoClick}
          onNavigateToSection={handleNavigateToSection}
          currentView={currentView}
          onShowProfile={handleShowProfile}
          onShowSettings={handleShowSettings}
          onShowBilling={handleShowBilling}
        />

        {/* Main Content */}
        <main>
          <AnimatePresence mode="wait">
            {currentView === 'landing' && (
              <motion.div
                key="landing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <LandingPage onGetStarted={handleGetStarted} onModeSelect={handleModeSelect} />
              </motion.div>
            )}
            
            {currentView === 'studio' && (
              <motion.div
                key="studio"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProcessingStudio 
                  user={user} 
                  onSaveProject={handleSaveProject}
                  onDownloadImage={handleDownloadImage}
                />
              </motion.div>
            )}

            {currentView === 'profile' && (
              <motion.div
                key="profile"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <ProfilePage 
                  user={user} 
                  onUpdateUser={handleUpdateUser}
                  onBack={() => setCurrentView('studio')}
                />
              </motion.div>
            )}

            {currentView === 'settings' && (
              <motion.div
                key="settings"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsPage 
                  theme={theme}
                  onThemeToggle={toggleTheme}
                  onUpdateSettings={handleUpdateSettings}
                  onBack={() => setCurrentView('studio')}
                />
              </motion.div>
            )}

            {currentView === 'billing' && (
              <motion.div
                key="billing"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <BillingPage 
                  user={user}
                  onUpgrade={handleUpgrade}
                  onBack={() => setCurrentView('studio')}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        {/* Auth Modal */}
        <AuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />

        {/* Toast Notifications */}
        <div className="fixed top-20 right-4 space-y-3 z-50">
          <AnimatePresence>
            {toasts.map(toast => (
              <motion.div
                key={toast.id}
                initial={{ opacity: 0, x: 300, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 300, scale: 0.8 }}
                className={`max-w-sm p-4 rounded-xl shadow-2xl backdrop-blur-sm border ${
                  toast.type === 'success' 
                    ? 'bg-green-50/90 dark:bg-green-900/90 text-green-800 dark:text-green-200 border-green-200 dark:border-green-700' :
                  toast.type === 'error' 
                    ? 'bg-red-50/90 dark:bg-red-900/90 text-red-800 dark:text-red-200 border-red-200 dark:border-red-700' :
                  toast.type === 'warning'
                    ? 'bg-yellow-50/90 dark:bg-yellow-900/90 text-yellow-800 dark:text-yellow-200 border-yellow-200 dark:border-yellow-700' :
                    'bg-blue-50/90 dark:bg-blue-900/90 text-blue-800 dark:text-blue-200 border-blue-200 dark:border-blue-700'
                }`}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-medium pr-2">{toast.message}</p>
                  <button
                    onClick={() => removeToast(toast.id)}
                    className="flex-shrink-0 ml-2 hover:opacity-70 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Credits Display */}
        {user && (currentView === 'studio' || currentView === 'profile' || currentView === 'settings' || currentView === 'billing') && (
          <div className={`fixed bottom-4 right-4 backdrop-blur-sm rounded-xl p-3 shadow-lg border ${
            user.is_admin 
              ? 'bg-gradient-to-r from-purple-500/90 to-pink-500/90 border-purple-300 dark:border-purple-600' 
              : 'bg-white/90 dark:bg-gray-800/90 border-gray-200 dark:border-gray-700'
          }`}>
            <div className="text-sm">
              {user.is_admin ? (
                <>
                  <div className="flex items-center space-x-2">
                    <span className="text-white font-bold">👑 ADMIN</span>
                  </div>
                  <div className="text-white/90 text-xs">Unlimited Credits</div>
                </>
              ) : (
                <>
                  <span className="text-gray-600 dark:text-gray-400">Credits: </span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {user.credits_remaining}
                  </span>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    4 credits per download
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Navigation Fab */}
        {user && currentView !== 'landing' && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setCurrentView('landing')}
            className="fixed bottom-4 left-4 w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all flex items-center justify-center"
            title="Back to Home"
          >
            ←
          </motion.button>
        )}
      </div>
    </div>
  );
}

export default App;