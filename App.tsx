
import React, { useState, useMemo } from 'react';
import { AppContext } from './contexts/AppContext';
import { User, Role, Hall, Booking } from './types';
import { MOCK_USERS, MOCK_HALLS, MOCK_BOOKINGS } from './constants';
import Header from './components/Header';
import HallListingPage from './components/HallListingPage';
import Dashboard from './components/Dashboard';
import AuthModal from './components/AuthModal';
import SalonPage from './components/SalonPage';
import CameramanPage from './components/CameramanPage';

type AuthModalTab = 'login' | 'signup';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>(MOCK_USERS);
  const [halls, setHalls] = useState<Hall[]>(MOCK_HALLS);
  const [bookings, setBookings] = useState<Booking[]>(MOCK_BOOKINGS);
  const [activeView, setActiveView] = useState<'halls' | 'dashboard' | 'salon' | 'cameraman'>('halls');
  const [authModal, setAuthModal] = useState<{isOpen: boolean; initialTab: AuthModalTab}>({ isOpen: false, initialTab: 'login' });
  const [language, setLanguageState] = useState<string>(() => localStorage.getItem('language') || 'Français');

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang); // Persist for guest sessions
    if (currentUser) {
        // Persist for logged-in user's profile for next session
        setUsers(prevUsers => prevUsers.map(user => 
            user.id === currentUser.id ? { ...user, language: lang } : user
        ));
    }
  };

  const openAuthModal = (initialTab: AuthModalTab) => {
    setAuthModal({ isOpen: true, initialTab });
  };
  
  const closeAuthModal = () => {
    setAuthModal({ isOpen: false, initialTab: 'login' });
  };
  
  const loginUser = (email: string, password: string):boolean => {
      let userToLogin = users.find(u => u.email === email && u.password === password && u.role === Role.USER);

      if (!userToLogin) {
          userToLogin = users.find(u => u.email === email && u.role !== Role.USER);
      }

      if (userToLogin) {
          setCurrentUser(userToLogin);
          
          // On login, set language from user's profile, or keep current if none is set
          const newLanguage = userToLogin.language || language;
          setLanguageState(newLanguage);
          localStorage.setItem('language', newLanguage); // Explicitly save preference on login

          if (userToLogin.role === Role.USER) {
              setActiveView('halls');
          } else {
              setActiveView('dashboard');
          }
          closeAuthModal();
          return true;
      }
      return false;
  }

  const registerUser = (name: string, email: string, password: string): {success: boolean, message: string} => {
      if (users.find(u => u.email === email)) {
          return { success: false, message: 'emailExists' };
      }
      const newUser: User = {
          id: `u${users.length + 1}${Date.now()}`,
          name,
          email,
          password,
          role: Role.USER,
          language: language, // Assign current language to new user
      };
      setUsers(prev => [...prev, newUser]);
      return { success: true, message: 'registrationSuccess' };
  }

  const logout = () => {
    // Explicitly ensure the current language is saved for the guest session on logout.
    localStorage.setItem('language', language);
    setCurrentUser(null);
    setActiveView('halls');
  };

  const addBooking = (newBooking: Omit<Booking, 'id' | 'status' | 'transactionId'>) => {
    setBookings(prev => [
      ...prev,
      {
        ...newBooking,
        id: `B${prev.length + 1}${Date.now()}`,
        status: 'Pending Confirmation',
        transactionId: `T${Date.now()}`
      }
    ]);
  };
  
  const updateBookingStatus = (bookingId: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status } : b));
  };


  const contextValue = useMemo(() => ({
    currentUser,
    loginUser,
    registerUser,
    logout,
    halls,
    bookings,
    addBooking,
    updateBookingStatus,
    language,
    setLanguage,
    openAuthModal
  }), [currentUser, users, halls, bookings, language]);

  return (
    <AppContext.Provider value={contextValue}>
      <div className="bg-background min-h-screen font-sans text-primary">
        <Header setActiveView={setActiveView} openAuthModal={openAuthModal} />
        <main className={`${activeView === 'halls' || activeView === 'dashboard' ? 'container mx-auto p-4 md:p-8' : ''}`}>
          {activeView === 'halls' && <HallListingPage />}
          {activeView === 'salon' && <SalonPage />}
          {activeView === 'cameraman' && <CameramanPage />}
          {activeView === 'dashboard' && currentUser && <Dashboard />}
          {activeView === 'dashboard' && !currentUser && (
              <div className="text-center p-12 bg-surface rounded-lg shadow-md mt-8">
                  <h2 className="text-2xl font-semibold mb-4">Please log in to view the dashboard.</h2>
                  <p className="text-secondary">Please login to view your dashboard.</p>
              </div>
          )}
        </main>
        { (activeView === 'halls' || activeView === 'dashboard') &&
          <footer className="text-center py-4 border-t border-secondary/20 text-secondary text-sm bg-surface">
              <p>&copy; 2024 Hallify. All rights reserved. This is a prototype for demonstration purposes.</p>
          </footer>
        }
        {authModal.isOpen && <AuthModal onClose={closeAuthModal} initialTab={authModal.initialTab} />}
      </div>
    </AppContext.Provider>
  );
};

export default App;
