import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { ProgramsSection } from './components/ProgramsSection';
import { AiFaqSection } from './components/AiFaqSection';
import { CoachDashboard } from './components/CoachDashboard';
import { RegistrationModal } from './components/RegistrationModal';
import { InstructorLoginModal } from './components/InstructorLoginModal';
import { Footer } from './components/Footer';
import { MessageSquare, Lock, ShieldCheck } from 'lucide-react';

import { 
  INITIAL_COACH, 
  INITIAL_PROGRAMS, 
  INITIAL_REGISTRATIONS 
} from './data/initialData';
import { 
  TraineeRegistration, 
  RegistrationStatus, 
  ProgramTrack, 
  CoachProfile,
  AppUser
} from './types';

export default function App() {
  // Navigation active tab: 'home' or 'coach-dashboard'
  const [activeTab, setActiveTab] = useState<'home' | 'coach-dashboard'>('home');

  // Mode Selection: 'online' (default) or 'offline'
  const [selectedMode, setSelectedMode] = useState<'online' | 'offline'>('online');

  // Coach and Programs state
  const [coach] = useState<CoachProfile>(INITIAL_COACH);
  const [programs] = useState<ProgramTrack[]>(INITIAL_PROGRAMS);

  // Owner Authentication State (persisted securely on owner's browser)
  const [isOwnerLoggedIn, setIsOwnerLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('alfasih_owner_auth') === 'true';
    } catch {
      return false;
    }
  });

  const [isOwnerLoginModalOpen, setIsOwnerLoginModalOpen] = useState(false);

  const currentUser: AppUser | null = isOwnerLoggedIn ? {
    id: 'owner-osama',
    fullName: 'Osama Alkhatib',
    email: 'osama7252t@gmail.com',
    role: 'instructor'
  } : null;

  // Secret Owner Access Listeners:
  // 1. Secret URL check: ?instructor, ?admin, ?portal=osama, #instructor, etc.
  useEffect(() => {
    const checkSecretTriggers = () => {
      const search = window.location.search.toLowerCase();
      const hash = window.location.hash.toLowerCase();
      if (
        search.includes('instructor') ||
        search.includes('admin') ||
        search.includes('portal') ||
        hash.includes('instructor') ||
        hash.includes('admin')
      ) {
        if (isOwnerLoggedIn) {
          setActiveTab('coach-dashboard');
        } else {
          setIsOwnerLoginModalOpen(true);
        }
      }
    };

    checkSecretTriggers();
    window.addEventListener('hashchange', checkSecretTriggers);
    return () => window.removeEventListener('hashchange', checkSecretTriggers);
  }, [isOwnerLoggedIn]);

  // 2. Secret Keyboard Shortcut: Ctrl + Shift + I or Alt + I
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'i')) ||
        (e.altKey && (e.key === 'I' || e.key === 'i'))
      ) {
        e.preventDefault();
        if (isOwnerLoggedIn) {
          setActiveTab(prev => (prev === 'coach-dashboard' ? 'home' : 'coach-dashboard'));
        } else {
          setIsOwnerLoginModalOpen(true);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOwnerLoggedIn]);

  // Registrations state with LocalStorage persistence
  const [registrations, setRegistrations] = useState<TraineeRegistration[]>(() => {
    try {
      const saved = localStorage.getItem('alfasih_trainee_registrations');
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load registrations from storage', e);
    }
    return INITIAL_REGISTRATIONS;
  });

  // Save to LocalStorage whenever registrations change
  useEffect(() => {
    try {
      localStorage.setItem('alfasih_trainee_registrations', JSON.stringify(registrations));
    } catch (e) {
      console.error('Failed to persist registrations', e);
    }
  }, [registrations]);

  // Registration Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [preselectedProgramId, setPreselectedProgramId] = useState<string | undefined>(undefined);

  // Success Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Owner Authentication Handlers
  const handleOwnerLoginSuccess = () => {
    setIsOwnerLoggedIn(true);
    try {
      localStorage.setItem('alfasih_owner_auth', 'true');
    } catch {}
    setIsOwnerLoginModalOpen(false);
    setActiveTab('coach-dashboard');
    showToast('Selamat datang kembali, Osama Alkhatib! Panel Instruktur telah dibuka.');
  };

  const handleLogout = () => {
    setIsOwnerLoggedIn(false);
    try {
      localStorage.removeItem('alfasih_owner_auth');
    } catch {}
    setActiveTab('home');
    showToast('Anda telah keluar dari Panel Instruktur.');
  };

  // Protected Tab Navigation
  const handleSelectTab = (tab: 'home' | 'coach-dashboard') => {
    if (tab === 'coach-dashboard' && !isOwnerLoggedIn) {
      setIsOwnerLoginModalOpen(true);
      return;
    }
    setActiveTab(tab);
  };

  // Trainee Registration handler
  const handleAddRegistration = (newReg: TraineeRegistration) => {
    setRegistrations(prev => [newReg, ...prev]);
    showToast(`Pendaftaran berhasil dikirim atas nama: ${newReg.fullName}`);
  };

  // Status Updater from Coach Dashboard
  const handleUpdateRegistrationStatus = (id: string, newStatus: RegistrationStatus) => {
    setRegistrations(prev =>
      prev.map(item => (item.id === id ? { ...item, status: newStatus } : item))
    );
    showToast('Status pendaftaran peserta berhasil diperbarui');
  };

  // Notes Updater from Coach Dashboard
  const handleUpdateRegistrationNotes = (id: string, notes: string) => {
    setRegistrations(prev =>
      prev.map(item => (item.id === id ? { ...item, coachNotes: notes } : item))
    );
    showToast('Catatan bimbingan instruktur berhasil disimpan');
  };

  // Delete Trainee (Soft Delete so data can be restored anytime)
  const handleDeleteRegistration = (id: string) => {
    setRegistrations(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isDeleted: true, deletedAt: new Date().toISOString() }
          : item
      )
    );
    showToast('Data peserta berhasil dipindahkan ke kotak sampah (bisa dikembalikan kapan saja)');
  };

  // Restore Trainee from Trash
  const handleRestoreRegistration = (id: string) => {
    setRegistrations(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, isDeleted: false, deletedAt: undefined }
          : item
      )
    );
    showToast('Data peserta berhasil dipulihkan / dikembalikan');
  };

  // Permanent Delete Trainee
  const handlePermanentDeleteRegistration = (id: string) => {
    setRegistrations(prev => prev.filter(item => item.id !== id));
    showToast('Data peserta telah dihapus permanen dari sistem');
  };

  // Trigger registration with preselected program
  const handleSelectProgramFromCatalog = (programId: string) => {
    setPreselectedProgramId(programId);
    setIsRegisterModalOpen(true);
  };

  const scrollToPrograms = () => {
    if (activeTab !== 'home') {
      setActiveTab('home');
      setTimeout(() => {
        document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      document.getElementById('programs-section')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Count new registrations for coach badge
  const newRegistrationsCount = registrations.filter(r => r.status === 'new').length;

  return (
    <div className="min-h-screen bg-[#0B0F17] flex flex-col font-['Plus_Jakarta_Sans',sans-serif] text-stone-100 antialiased selection:bg-amber-500/30 selection:text-amber-200">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-[#141B2B] text-amber-300 px-5 py-2.5 rounded-xl shadow-2xl text-xs sm:text-sm font-bold border border-amber-500/30 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={handleSelectTab}
        onOpenRegister={() => {
          setPreselectedProgramId(undefined);
          setIsRegisterModalOpen(true);
        }}
        newRegistrationsCount={newRegistrationsCount}
        currentUser={currentUser}
        onLogout={handleLogout}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'coach-dashboard' ? (
          /* Coach Management View - Restricted to Owner */
          currentUser?.role === 'instructor' ? (
            <CoachDashboard
              registrations={registrations}
              programs={programs}
              coach={coach}
              onUpdateRegistrationStatus={handleUpdateRegistrationStatus}
              onUpdateRegistrationNotes={handleUpdateRegistrationNotes}
              onDeleteRegistration={handleDeleteRegistration}
              onRestoreRegistration={handleRestoreRegistration}
              onPermanentDeleteRegistration={handlePermanentDeleteRegistration}
              onAddRegistration={handleAddRegistration}
              onLogout={handleLogout}
            />
          ) : (
            <div className="max-w-md mx-auto my-16 px-4">
              <div className="bg-[#121826] border border-amber-500/30 rounded-3xl p-8 text-center shadow-2xl">
                <div className="w-14 h-14 bg-stone-950 text-white rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-2xl border border-amber-500/40 shadow-lg shadow-amber-950/40">
                  <span className="font-['Amiri',serif] text-amber-400">أ</span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 text-[11px] font-bold mb-3">
                  <Lock className="w-3 h-3 text-amber-400" />
                  <span>Akses Terproteksi Khusus Pemilik</span>
                </div>
                <h2 className="text-xl font-black text-stone-100 mb-6">
                  Portal Khusus Pemilik
                </h2>
                <div className="flex flex-col sm:flex-row gap-2.5 justify-center">
                  <button
                    onClick={() => setActiveTab('home')}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-stone-300 hover:bg-stone-800 border border-stone-700 transition-colors"
                  >
                    Kembali ke Beranda
                  </button>
                  <button
                    onClick={() => setIsOwnerLoginModalOpen(true)}
                    className="px-5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 active:scale-95 text-stone-950 shadow-lg shadow-amber-950/40 transition-all flex items-center justify-center gap-2"
                  >
                    <ShieldCheck className="w-4 h-4 text-stone-950" />
                    <span>Login Pemilik (Gmail)</span>
                  </button>
                </div>
              </div>
            </div>
          )
        ) : (
          /* Clean, focused public landing page */
          <>
            {/* 1. Hero with exact requested heading & subtitle and 2 mode buttons */}
            <HeroSection
              coach={coach}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              onScrollToPrograms={scrollToPrograms}
            />
            
            {/* 2. Programs Section with the selected mode packages (4 online or offline with Bogor notice) */}
            <ProgramsSection
              programs={programs}
              registrations={registrations}
              selectedMode={selectedMode}
              onSelectMode={setSelectedMode}
              onSelectProgram={handleSelectProgramFromCatalog}
            />

            {/* 3. AI Question Answering & Common FAQs Service */}
            <AiFaqSection />
          </>
        )}
      </main>

      {/* Trainee Registration Modal */}
      <RegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => {
          setIsRegisterModalOpen(false);
        }}
        programs={programs}
        registrations={registrations}
        preselectedProgramId={preselectedProgramId}
        onAddRegistration={handleAddRegistration}
        currentUser={currentUser}
      />

      {/* Secret Instructor / Owner Login Modal */}
      <InstructorLoginModal
        isOpen={isOwnerLoginModalOpen}
        onClose={() => setIsOwnerLoginModalOpen(false)}
        onLoginSuccess={handleOwnerLoginSuccess}
      />

      {/* Bottom Footer */}
      <Footer
        coach={coach}
        onOpenRegister={() => {
          setPreselectedProgramId(undefined);
          setIsRegisterModalOpen(true);
        }}
        onSelectTab={handleSelectTab}
        currentUser={currentUser}
        onOpenOwnerLogin={() => setIsOwnerLoginModalOpen(true)}
      />

      {/* Floating Quick Inquiry Button (Icon only - No word WhatsApp) */}
      <aside
        id="floating-chat-container"
        className="fixed bottom-5 right-5 z-40"
        aria-label="Kontak Langsung"
      >
        <a
          id="floating-chat-btn"
          href="https://wa.me/6285971641149?text=Halo%20Osama%20Alkhatib,%20saya%20ingin%20bertanya%20seputar%20kursus%20bahasa%20Arab."
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center w-13 h-13 rounded-full bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 active:scale-95 text-stone-950 shadow-2xl border border-amber-300/60 transition-all hover:shadow-amber-500/30"
          title="Hubungi (0859-7164-1149)"
          aria-label="Kirim Pesan"
        >
          <MessageSquare className="w-5 h-5 text-stone-950" />
        </a>
      </aside>

    </div>
  );
}
