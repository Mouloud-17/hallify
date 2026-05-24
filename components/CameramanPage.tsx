
import React, { useState, useEffect, useContext } from 'react';
import { CheckCircleIcon, StarIcon, LocationIcon, VideoCameraIcon, ClockIcon } from './Icons';
import { AppContext } from '../contexts/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { PAYMENT_WALLETS, MOCK_PROVIDERS } from '../constants';
import { PaymentWallet, Provider, ServicePackage } from '../types';

const EVENT_TYPES = ['Mariage', 'Anniversaire', 'Conférence', 'Clip Vidéo', 'Shooting Photo', 'Autre'];

const ProviderServicesModal = ({ provider, onClose, onBook }: { provider: Provider, onClose: () => void, onBook: (pkg: ServicePackage) => void }) => {
    // Close modal on click outside
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm overflow-hidden" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl shadow-2xl animate-fade-in relative flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-slate-500 hover:text-slate-900 z-10 bg-white/70 rounded-full p-2 transition hover:bg-white"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
                 
                 <div className="h-48 relative flex-shrink-0">
                    <img src={provider.image} alt={provider.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent flex items-end p-8">
                        <div className="text-white">
                            <h2 className="text-3xl font-bold">{provider.name}</h2>
                            <p className="text-blue-300 font-medium">{provider.specialty}</p>
                        </div>
                    </div>
                 </div>

                 <div className="p-8 overflow-y-auto">
                    <div className="mb-8">
                        <p className="text-slate-600 leading-relaxed">{provider.description}</p>
                        <div className="mt-4 flex items-center text-sm text-slate-500">
                             <span className="flex items-center mr-6 bg-slate-100 px-3 py-1 rounded-full"><StarIcon className="w-4 h-4 text-yellow-500 mr-2"/> {provider.rating} ({provider.reviews} avis)</span>
                             <span className="flex items-center"><LocationIcon className="w-4 h-4 mr-2"/> Région Centre</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                        <VideoCameraIcon className="w-6 h-6 mr-2 text-blue-600" />
                        Forfaits & Services
                    </h3>
                    
                    <div className="space-y-4">
                        {provider.packages.map((pkg, idx) => (
                            <div key={idx} className="border border-slate-200 rounded-lg p-5 hover:border-blue-400 hover:shadow-md transition-all bg-slate-50 group">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex-grow">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-lg text-slate-800 group-hover:text-blue-600 transition">{pkg.name}</h4>
                                            <span className="md:hidden font-bold text-slate-900 bg-white px-2 py-1 rounded border border-slate-200">${pkg.price}</span>
                                        </div>
                                        <p className="text-sm text-slate-500 mt-1">{pkg.description}</p>
                                    </div>
                                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                                        <span className="hidden md:block font-bold text-xl text-slate-900">${pkg.price}</span>
                                        <button 
                                            onClick={() => onBook(pkg)}
                                            className="w-full md:w-auto bg-slate-900 text-white text-sm px-6 py-2.5 rounded-lg hover:bg-blue-600 transition font-medium"
                                        >
                                            Réserver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    )
}

const CameramanPage: React.FC = () => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    const { currentUser, openAuthModal, addBooking } = context!;

    const [selectedProviderId, setSelectedProviderId] = useState<string>('');
    const [viewingProvider, setViewingProvider] = useState<Provider | null>(null);
    const [formData, setFormData] = useState({
        name: currentUser ? currentUser.name : '',
        email: currentUser ? currentUser.email : '',
        phone: '',
        eventType: '',
        location: '',
        date: '',
        needs: '',
    });
    
    // Booking steps: 'form' -> 'payment' -> 'processing' -> 'success'
    const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
    const [selectedWallet, setSelectedWallet] = useState<PaymentWallet | null>(null);
    const [price, setPrice] = useState<number>(0);


    // Update form data name/email if user logs in
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({ ...prev, name: currentUser.name, email: currentUser.email }));
        }
    }, [currentUser]);

    const handleBookClick = (providerId: string) => {
        if (!currentUser) {
            openAuthModal('login');
            return;
        }
        
        setSelectedProviderId(providerId);
        if (providerId) {
             const provider = MOCK_PROVIDERS.find(p => p.id === providerId);
             if (provider) setPrice(parseInt(provider.priceStart));
        } else {
             setPrice(0);
        }
        setBookingStep('form');

        const formElement = document.getElementById('camera-booking-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handlePackageBooking = (pkg: ServicePackage) => {
        if (!currentUser) {
            openAuthModal('login');
            return;
        }

        if (viewingProvider) {
            setSelectedProviderId(viewingProvider.id);
            setPrice(parseInt(pkg.price));
            // Pre-fill needs with the selected package
            setFormData(prev => ({
                ...prev,
                needs: `[Forfait Sélectionné: ${pkg.name} - $${pkg.price}] ${prev.needs}`
            }));
            setBookingStep('form');
            setViewingProvider(null);
            
            const formElement = document.getElementById('camera-booking-form');
            if (formElement) {
                setTimeout(() => formElement.scrollIntoView({ behavior: 'smooth' }), 100);
            }
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setBookingStep('payment');
    };

    const handlePayment = () => {
        if (!selectedWallet) return;
        setBookingStep('processing');
        // Simulate API call
        setTimeout(() => {
             const selectedProvider = MOCK_PROVIDERS.find(p => p.id === selectedProviderId);
             if (currentUser && selectedProvider) {
                addBooking({
                    userId: currentUser.id,
                    serviceType: 'cameraman',
                    serviceId: selectedProvider.id,
                    serviceName: selectedProvider.name,
                    date: formData.date,
                    startTime: "00:00", // Default or extract if added to form
                    totalPrice: price,
                    status: 'Confirmed',
                    paymentMethod: selectedWallet,
                    notes: `Type: ${formData.eventType}. Lieu: ${formData.location}. Besoins: ${formData.needs}`
                });
            }
            setBookingStep('success');
        }, 2000);
    }
    
    const resetForm = () => {
        setBookingStep('form');
        setFormData({
            name: currentUser ? currentUser.name : '',
            email: currentUser ? currentUser.email : '',
            phone: '',
            eventType: '',
            location: '',
            date: '',
            needs: '',
        });
        setSelectedWallet(null);
        setSelectedProviderId('');
        setPrice(0);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const selectedProvider = MOCK_PROVIDERS.find(p => p.id === selectedProviderId);

    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            {/* Hero Banner */}
            <div className="relative h-[50vh] bg-slate-900 flex items-center justify-center overflow-hidden">
                <img src="https://images.unsplash.com/photo-1533134486753-c833f0ed4866?w=1600&q=80" alt="Camera Lens" className="absolute inset-0 w-full h-full object-cover opacity-30" />
                <div className="relative z-10 text-center px-4">
                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg tracking-tight">NOS EXPERTS DE L'IMAGE</h1>
                    <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto font-light">
                        Vidéastes et photographes professionnels prêts à sublimer vos projets.
                    </p>
                    <button 
                        onClick={() => handleBookClick('')}
                        className="mt-8 px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition duration-300"
                    >
                        Trouver un prestataire
                    </button>
                </div>
            </div>

            {/* Providers Grid */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-900 mb-2">Nos Prestataires Certifiés</h2>
                    <p className="text-slate-500">Choisissez l'expert qui correspond à votre style et votre budget</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_PROVIDERS.map((provider) => (
                        <div key={provider.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-slate-100 hover:shadow-2xl transition-all duration-300 group flex flex-col">
                            <div className="h-48 overflow-hidden relative">
                                <img src={provider.image} alt={provider.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-800 shadow-sm flex items-center">
                                    <StarIcon className="w-4 h-4 text-yellow-500 mr-1" />
                                    {provider.rating} <span className="text-slate-400 font-normal ml-1">({provider.reviews})</span>
                                </div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow">
                                <div className="flex justify-between items-start mb-2">
                                    <div>
                                        <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition">{provider.name}</h3>
                                        <p className="text-sm text-blue-500 font-medium mb-1">{provider.specialty}</p>
                                    </div>
                                </div>
                                <p className="text-slate-500 text-sm mb-4 line-clamp-2 flex-grow">{provider.description}</p>
                                
                                <div className="flex items-center text-slate-400 text-xs mb-6">
                                    <LocationIcon className="w-4 h-4 mr-1" />
                                    <span>Disponible Région Centre</span>
                                    <span className="mx-2">•</span>
                                    <VideoCameraIcon className="w-4 h-4 mr-1" />
                                    <span>Photo & Vidéo</span>
                                </div>

                                <div className="pt-4 border-t border-slate-100 mt-auto">
                                    <div className="text-slate-900 font-bold mb-3">
                                        À partir de ${provider.priceStart}
                                    </div>
                                    <div className="flex gap-2">
                                         <button 
                                            onClick={() => setViewingProvider(provider)}
                                            className="flex-1 py-2 bg-slate-100 text-slate-700 text-sm rounded-lg hover:bg-slate-200 transition duration-300 font-medium border border-slate-200"
                                        >
                                            Voir plus
                                        </button>
                                        <button 
                                            onClick={() => handleBookClick(provider.id)}
                                            className="flex-1 py-2 bg-slate-900 text-white text-sm rounded-lg hover:bg-blue-600 transition duration-300 font-medium"
                                        >
                                            Réserver
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Form Section */}
            <div id="camera-booking-form" className="bg-slate-900 text-white py-20 relative overflow-hidden">
                {/* Decorative circles */}
                <div className="absolute top-0 left-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

                <div className="container mx-auto px-4 max-w-4xl relative z-10">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold">Réservez votre Prestataire</h2>
                        <p className="text-slate-400 mt-2">Dites-nous en plus sur votre événement pour recevoir un devis personnalisé.</p>
                    </div>

                    {bookingStep === 'success' ? (
                         <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-12 text-center shadow-2xl border border-slate-700 animate-fade-in">
                            <CheckCircleIcon className="w-24 h-24 text-green-500 mx-auto mb-6" />
                            <h3 className="text-3xl font-bold text-white mb-4">{t('paymentSuccessful')}</h3>
                            <p className="text-slate-300 text-lg mb-8">
                                Votre demande pour 
                                <span className="text-blue-400 font-bold"> {selectedProvider ? selectedProvider.name : 'un de nos experts'} </span>
                                a bien été payée et confirmée.
                            </p>
                            <button onClick={resetForm} className="px-8 py-3 bg-blue-600 rounded-lg hover:bg-blue-700 transition">{t('makeAnotherBooking')}</button>
                        </div>
                    ) : bookingStep === 'processing' ? (
                             <div className="text-center py-12 bg-slate-800/80 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-700">
                                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto"></div>
                                 <h3 className="text-xl font-semibold mt-4 text-white">{t('processingPayment')}</h3>
                                 <p className="text-slate-400">{t('pleaseWait')}</p>
                             </div>
                    ) : bookingStep === 'payment' ? (
                         <div className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-700 animate-fade-in">
                            <h3 className="text-xl font-semibold mb-6 text-center text-white">{t('selectPaymentMethod')}</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {PAYMENT_WALLETS.map(wallet => (
                                        <button 
                                            key={wallet.id} 
                                            onClick={() => setSelectedWallet(wallet.id)} 
                                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition hover:bg-slate-700 ${selectedWallet === wallet.id ? 'border-blue-500 ring-2 ring-blue-500 bg-slate-700' : 'border-slate-600 bg-slate-800'}`}
                                        >
                                            <img src={wallet.logo} alt={wallet.name} className="h-10 object-contain"/>
                                            <span className="mt-2 text-sm font-medium text-white">{wallet.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-slate-700/50 p-6 rounded-md mb-8 border border-slate-600">
                                    <h4 className="font-bold text-lg mb-4 border-b border-slate-600 pb-2 text-white">{t('bookingSummary')}</h4>
                                    <div className="space-y-2 text-sm text-slate-300">
                                        <div className="flex justify-between">
                                            <span>Type d'événement:</span>
                                            <span className="font-semibold text-white">{formData.eventType}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span className="font-semibold text-white">{formData.date}</span>
                                        </div>
                                         <div className="flex justify-between pt-2 border-t border-slate-600 mt-2 text-lg font-bold text-blue-400">
                                            <span>{t('total')} (Estimation)</span>
                                            <span>${price}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePayment} 
                                    disabled={!selectedWallet}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('confirmAndPay')} ${price}
                                </button>
                                <button onClick={() => setBookingStep('form')} className="w-full mt-4 text-slate-400 text-sm hover:text-white underline">{t('backToSelection')}</button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="bg-slate-800/80 backdrop-blur-md rounded-2xl p-8 md:p-12 shadow-2xl border border-slate-700">
                            
                            {/* Provider Selection Display */}
                            <div className="mb-8 p-4 bg-slate-700/50 rounded-lg border border-slate-600 flex flex-col md:flex-row items-center justify-between">
                                <div className="mb-4 md:mb-0 w-full md:w-auto">
                                    <label className="block text-sm font-medium text-slate-400 mb-1">Prestataire Sélectionné</label>
                                    <select 
                                        value={selectedProviderId} 
                                        onChange={(e) => {
                                            setSelectedProviderId(e.target.value);
                                            // Set price based on selected provider start price
                                            const provider = MOCK_PROVIDERS.find(p => p.id === e.target.value);
                                            if (provider) setPrice(parseInt(provider.priceStart));
                                            else setPrice(0);
                                        }}
                                        className="bg-transparent text-xl font-bold text-white focus:outline-none cursor-pointer border-b border-dashed border-slate-500 hover:border-blue-400 transition w-full md:w-auto"
                                    >
                                        <option value="" className="bg-slate-800 text-slate-400">-- Choisir un prestataire --</option>
                                        {MOCK_PROVIDERS.map(p => (
                                            <option key={p.id} value={p.id} className="bg-slate-800 text-white">{p.name} - {p.specialty}</option>
                                        ))}
                                    </select>
                                </div>
                                {selectedProvider && (
                                    <div className="flex items-center">
                                        <img src={selectedProvider.image} alt={selectedProvider.name} className="w-10 h-10 rounded-full object-cover mr-3 border-2 border-blue-500"/>
                                        <div className="text-sm">
                                            <div className="font-bold text-white">{selectedProvider.name}</div>
                                            <div className="text-slate-400">À partir de ${selectedProvider.priceStart}</div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Nom Complet</label>
                                    <input 
                                        type="text" 
                                        name="name" 
                                        required 
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
                                        placeholder="Votre nom"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Email</label>
                                    <input 
                                        type="email" 
                                        name="email" 
                                        required 
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
                                        placeholder="votre@email.com"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Type d'Événement</label>
                                    <select 
                                        name="eventType" 
                                        value={formData.eventType} 
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    >
                                        <option value="" disabled className="text-slate-500">Sélectionnez le type</option>
                                        {EVENT_TYPES.map(type => <option key={type} value={type}>{type}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-400 mb-2">Date Prévue</label>
                                    <input 
                                        type="date" 
                                        name="date" 
                                        required 
                                        value={formData.date}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition"
                                    />
                                </div>
                            </div>
                            
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Lieu de l'événement</label>
                                <div className="relative">
                                    <LocationIcon className="absolute top-3.5 left-3 w-5 h-5 text-slate-500" />
                                    <input 
                                        type="text" 
                                        name="location" 
                                        required 
                                        value={formData.location}
                                        onChange={handleInputChange}
                                        className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
                                        placeholder="Ville, Adresse ou Salle..."
                                    />
                                </div>
                            </div>

                            <div className="mb-8">
                                <label className="block text-sm font-medium text-slate-400 mb-2">Besoins Spécifiques</label>
                                <textarea 
                                    name="needs" 
                                    rows={4}
                                    value={formData.needs}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-700 border border-slate-600 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none transition placeholder-slate-500"
                                    placeholder="Décrivez votre vision, la durée souhaitée, ou le forfait qui vous intéresse..."
                                ></textarea>
                            </div>
                            
                             {price > 0 && (
                                     <div className="bg-slate-700/50 p-4 rounded text-center mb-6 border border-slate-600">
                                        <span className="text-slate-300 uppercase text-xs font-bold tracking-wide mr-2">Montant estimé:</span>
                                        <span className="text-2xl font-bold text-blue-400">${price}</span>
                                    </div>
                            )}

                            {currentUser ? (
                                <button type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold py-4 rounded-lg hover:shadow-lg hover:from-blue-500 hover:to-indigo-500 transition duration-300 transform hover:-translate-y-1">
                                    {t('proceedToPayment')}
                                </button>
                            ) : (
                                <button 
                                    type="button" 
                                    onClick={() => openAuthModal('login')}
                                    className="w-full bg-slate-600 text-white font-bold py-4 rounded-lg hover:bg-slate-700 transition duration-300 flex justify-center items-center"
                                >
                                    {t('loginToBookAction')}
                                </button>
                            )}
                        </form>
                    )}
                </div>
            </div>

            {/* Modal */}
            {viewingProvider && (
                <ProviderServicesModal 
                    provider={viewingProvider} 
                    onClose={() => setViewingProvider(null)} 
                    onBook={handlePackageBooking}
                />
            )}
        </div>
    );
};

export default CameramanPage;
