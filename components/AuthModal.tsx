
import React, { useState, useContext, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslations, TranslationKey } from '../hooks/useTranslations';

interface AuthModalProps {
    onClose: () => void;
    initialTab: 'login' | 'signup';
}

type AuthTab = 'login' | 'signup';

const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialTab }) => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    const [activeTab, setActiveTab] = useState<AuthTab>(initialTab);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setActiveTab(initialTab);
    }, [initialTab]);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        const success = context?.loginUser(email, password);
        if (!success) {
            setError(t('invalidCredentials'));
        }
    };

    const handleSignUp = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMessage('');
        if (!name || !email || !password) {
            setError(t('allFieldsRequired'));
            return;
        }
        const result = context?.registerUser(name, email, password);
        if (result && !result.success) {
            setError(t(result.message as TranslationKey));
        } else if (result) {
            setSuccessMessage(t(result.message as TranslationKey));
            setActiveTab('login');
            setName('');
            setEmail('');
            setPassword('');
        }
    };

    const switchTab = (tab: AuthTab) => {
        setActiveTab(tab);
        setError('');
        setSuccessMessage('');
        setName('');
        setEmail('');
        setPassword('');
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-2xl w-full max-w-md">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-xl font-serif text-accent">{t('userAuth')}</h2>
                    <button onClick={onClose} className="text-primary hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="flex border-b">
                    <button 
                        onClick={() => switchTab('login')}
                        className={`w-1/2 p-4 text-center font-semibold transition ${activeTab === 'login' ? 'text-accent border-b-2 border-accent' : 'text-secondary'}`}
                    >
                        {t('login')}
                    </button>
                    <button 
                        onClick={() => switchTab('signup')}
                        className={`w-1/2 p-4 text-center font-semibold transition ${activeTab === 'signup' ? 'text-accent border-b-2 border-accent' : 'text-secondary'}`}
                    >
                        {t('signUp')}
                    </button>
                </div>

                <div className="p-6">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
                    {successMessage && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4" role="alert">{successMessage}</div>}
                    
                    {activeTab === 'login' && (
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">{t('email')}</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">{t('password')}</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md" required/>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-accent text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition font-semibold">{t('login')}</button>
                        </form>
                    )}

                    {activeTab === 'signup' && (
                        <form onSubmit={handleSignUp} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">{t('fullName')}</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">{t('email')}</label>
                                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md" required/>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-primary mb-1">{t('password')}</label>
                                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md" required/>
                            </div>
                            <button type="submit" className="w-full mt-4 bg-accent text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition font-semibold">{t('createAccount')}</button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AuthModal;