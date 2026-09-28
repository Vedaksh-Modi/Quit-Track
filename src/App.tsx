import React, { useState } from 'react';
import { QuitTrackProvider, useQuitTrack } from './context/QuitTrackContext';
import { Navigation } from './components/Navigation';
import { OnboardingFlow } from './components/OnboardingFlow';
import { HomeDashboard } from './components/HomeDashboard';
import { CigaretteTracker } from './components/CigaretteTracker';
import { CravingCoach } from './components/CravingCoach';
import { InsightsView } from './components/InsightsView';
import { ProfileSettings } from './components/ProfileSettings';
import { CommunityFeed } from './components/CommunityFeed';
import { MoneySavedDashboard } from './components/MoneySavedDashboard';
import { RewardsDashboard } from './components/RewardsDashboard';
import { EmergencyCravingScreen } from './components/EmergencyCravingScreen';
import { AICoachModal } from './components/AICoachModal';
import { RelapseModal } from './components/RelapseModal';
import { QuickLogModal } from './components/QuickLogModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { QRCodeModal } from './components/QRCodeModal';

const AppContent: React.FC = () => {
  const {
    profile,
    updateProfile,
    activeTab,
    emergencyActive,
    quickLogModalActive,
    setQuickLogModalActive,
  } = useQuitTrack();

  const [aiCoachOpen, setAiCoachOpen] = useState(false);
  const [installModalOpen, setInstallModalOpen] = useState(false);
  const [qrModalOpen, setQrModalOpen] = useState(false);

  // If user hasn't finished onboarding, display the onboarding flow
  if (!profile.onboardingCompleted) {
    return <OnboardingFlow onComplete={() => updateProfile({ onboardingCompleted: true })} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors selection:bg-emerald-200 selection:text-emerald-950">
      {/* Top Header Navigation */}
      <Navigation
        onOpenAICoach={() => setAiCoachOpen(true)}
        onOpenInstall={() => setInstallModalOpen(true)}
        onOpenQRCode={() => setQrModalOpen(true)}
      />

      {/* Main View Area */}
      <main className="flex-1 max-w-lg w-full mx-auto px-4 pt-4 sm:pt-6">
        {activeTab === 'home' && (
          <HomeDashboard
            onOpenQuickLog={() => setQuickLogModalActive(true)}
            onOpenAICoach={() => setAiCoachOpen(true)}
            onOpenInstall={() => setInstallModalOpen(true)}
            onOpenQRCode={() => setQrModalOpen(true)}
          />
        )}
        {activeTab === 'rewards' && (
          <RewardsDashboard onOpenInstall={() => setInstallModalOpen(true)} />
        )}
        {activeTab === 'track' && <CigaretteTracker />}
        {activeTab === 'craving' && <CravingCoach />}
        {activeTab === 'insights' && <InsightsView />}
        {activeTab === 'profile' && (
          <ProfileSettings
            onOpenInstall={() => setInstallModalOpen(true)}
            onOpenQRCode={() => setQrModalOpen(true)}
          />
        )}
        {activeTab === 'community' && <CommunityFeed />}
        {activeTab === 'money' && <MoneySavedDashboard />}

        {/* Responsible Medical Safety Footer */}
        <footer className="mt-8 mb-20 pt-4 border-t border-slate-200/60 dark:border-slate-800/80 text-[11px] text-slate-400 dark:text-slate-500 text-center leading-relaxed space-y-1">
          <p>
            QuitTrack is a supportive behavioral and habit tracking tool, not a medical diagnostic device.
          </p>
          <p>
            Health timelines represent general public health research (WHO, CDC). For clinical treatment or nicotine replacement therapy, please consult a qualified healthcare professional.
          </p>
        </footer>
      </main>

      {/* Floating or Full-Screen Overlays */}
      {emergencyActive && <EmergencyCravingScreen />}
      <AICoachModal isOpen={aiCoachOpen} onClose={() => setAiCoachOpen(false)} />
      <RelapseModal />
      <QuickLogModal
        isOpen={quickLogModalActive}
        onClose={() => setQuickLogModalActive(false)}
      />
      <PWAInstallModal
        isOpen={installModalOpen}
        onClose={() => setInstallModalOpen(false)}
      />
      <QRCodeModal
        isOpen={qrModalOpen}
        onClose={() => setQrModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <QuitTrackProvider>
      <AppContent />
    </QuitTrackProvider>
  );
}
