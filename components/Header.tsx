
import React, { useContext, useState, useRef, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { GlobeIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface HeaderProps {
    setActiveView: (view: 'halls' | 'dashboard' | 'salon' | 'cameraman') => void;
    openAuthModal: (tab: 'login' | 'signup') => void;
}

const LanguageSelector: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const languages = ['Français', 'Arabe', 'Afar', 'Somali'];
    const context = useContext(AppContext);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [dropdownRef]);
    
    if (!context) return null;

    const { language, setLanguage } = context;

    const handleSelectLanguage = (lang: string) => {
        setLanguage(lang);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button 
                onClick={() => setIsOpen(!isOpen)} 
                className="flex items-center space-x-1 p-2 rounded-md hover:bg-background transition duration-300"
                aria-haspopup="true"
                aria-expanded={isOpen}
            >
                <GlobeIcon className="w-5 h-5 text-primary"/>
                <span className="text-sm font-medium hidden md:inline">{language}</span>
                <svg className="w-4 h-4 text-secondary hidden md:inline" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>
            {isOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-surface rounded-md shadow-lg py-1 z-50 ring-1 ring-black ring-opacity-5">
                    {languages.map(lang => (
                         <a 
                            href="#" 
                            key={lang} 
                            onClick={(e) => { e.preventDefault(); handleSelectLanguage(lang); }} 
                            className={`block px-4 py-2 text-sm text-primary hover:bg-background ${language === lang ? 'font-bold bg-background' : ''}`}
                            role="menuitem"
                        >
                            {lang}
                         </a>
                    ))}
                </div>
            )}
        </div>
    )
};


const Header: React.FC<HeaderProps> = ({ setActiveView, openAuthModal }) => {
    const context = useContext(AppContext);
    const { t } = useTranslations();

    return (
        <header className="bg-surface shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 md:px-8 py-4 flex justify-between items-center">
                <div 
                    className="text-2xl font-serif font-bold text-accent cursor-pointer"
                    onClick={() => setActiveView('halls')}
                >
                    {t('hallReserve')}
                </div>
                <nav className="flex items-center space-x-2 md:space-x-4">
                    <button 
                        onClick={() => setActiveView('halls')} 
                        className="hidden md:block text-primary hover:text-accent transition duration-300 font-medium"
                    >
                        {t('browseHalls')}
                    </button>
                    <button 
                        onClick={() => setActiveView('salon')} 
                        className="hidden md:block text-primary hover:text-accent transition duration-300 font-medium"
                    >
                        {t('salon')}
                    </button>
                    <button 
                        onClick={() => setActiveView('cameraman')} 
                        className="hidden md:block text-primary hover:text-accent transition duration-300 font-medium"
                    >
                        {t('cameraman')}
                    </button>

                    {context?.currentUser && (
                         <button 
                            onClick={() => setActiveView('dashboard')} 
                            className="hidden md:block text-primary hover:text-accent transition duration-300 font-medium"
                        >
                            {t('dashboard')}
                        </button>
                    )}

                    <LanguageSelector />

                    {context?.currentUser ? (
                        <div className="flex items-center space-x-3">
                            <span className="text-sm hidden md:inline">{t('welcome')} <span className="font-bold">{context.currentUser.name}</span></span>
                            <button
                                onClick={context.logout}
                                className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-80 transition duration-300 text-sm font-semibold"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-2">
                             <button
                                onClick={() => openAuthModal('login')}
                                className="text-primary px-4 py-2 rounded-md hover:bg-background transition duration-300 text-sm font-semibold"
                            >
                                {t('login')}
                            </button>
                            <button
                                onClick={() => openAuthModal('signup')}
                                className="bg-accent text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition duration-300 text-sm font-semibold"
                            >
                                {t('signUp')}
                            </button>
                        </div>
                    )}
                </nav>
            </div>
            {/* Mobile Menu Bar for smaller screens */}
            <div className="md:hidden border-t border-gray-100 flex justify-around py-2">
                <button onClick={() => setActiveView('halls')} className="text-xs font-medium text-primary p-2">Salles</button>
                <button onClick={() => setActiveView('salon')} className="text-xs font-medium text-primary p-2">Coiffure</button>
                <button onClick={() => setActiveView('cameraman')} className="text-xs font-medium text-primary p-2">Vidéo</button>
            </div>
        </header>
    );
};

export default Header;
