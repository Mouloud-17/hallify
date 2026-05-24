
import React, { useState, useEffect, useContext } from 'react';
import { CheckCircleIcon, StarIcon, LocationIcon, ClockIcon, CurrencyDollarIcon } from './Icons';
import { AppContext } from '../contexts/AppContext';
import { useTranslations } from '../hooks/useTranslations';
import { PAYMENT_WALLETS, MOCK_SALONS } from '../constants';
import { PaymentWallet, Salon } from '../types';

const genericServiceOptions = [
    { id: 'cut_m', name: 'Coupe Homme', price: 25 },
    { id: 'cut_w', name: 'Coupe Femme', price: 45 },
    { id: 'braids', name: 'Tresses / Nattes', price: 60 },
    { id: 'color', name: 'Coloration Complète', price: 80 },
    { id: 'treatment', name: 'Soin Keratine', price: 100 },
    { id: 'styling', name: 'Brushing / Coiffure', price: 35 },
];

const SalonServicesModal = ({ salon, onClose, onBook }: { salon: Salon, onClose: () => void, onBook: (serviceName: string, price: number) => void }) => {
    // Close modal on click outside
    useEffect(() => {
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', handleEsc);
        return () => window.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-hidden" onClick={onClose}>
            <div 
                className="bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-fade-in relative flex flex-col" 
                onClick={e => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-black z-10 bg-white/50 rounded-full p-1 transition"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
                 
                 <div className="h-40 relative flex-shrink-0">
                    <img src={salon.image} alt={salon.name} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-6">
                        <div className="text-white">
                            <h2 className="text-3xl font-serif font-bold">{salon.name}</h2>
                            <p className="text-gray-300 flex items-center text-sm"><LocationIcon className="w-4 h-4 mr-1"/> {salon.location}</p>
                        </div>
                    </div>
                 </div>

                 <div className="p-6 md:p-8 overflow-y-auto">
                    <div className="mb-6">
                        <p className="text-gray-600 italic border-l-4 border-accent pl-4 py-1">{salon.description}</p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                             <span className="flex items-center mr-4"><StarIcon className="w-4 h-4 text-accent mr-1"/> {salon.rating} ({salon.reviews} avis)</span>
                             <span className="flex items-center"><ClockIcon className="w-4 h-4 mr-1"/> {salon.openHours}</span>
                        </div>
                    </div>
                    
                    <h3 className="text-xl font-bold uppercase tracking-wide border-b border-gray-200 pb-2 mb-4 text-gray-800 font-serif">Services & Tarifs</h3>
                    
                    <div className="grid gap-4">
                        {salon.services.map((service, idx) => (
                            <div key={idx} className="flex flex-col sm:flex-row justify-between items-center p-4 border border-gray-100 hover:border-accent hover:shadow-md transition bg-gray-50 rounded-lg group">
                                <div className="mb-2 sm:mb-0 text-center sm:text-left">
                                    <p className="font-bold text-lg text-gray-800 group-hover:text-accent transition">{service.name}</p>
                                    <p className="text-sm text-gray-500 flex items-center justify-center sm:justify-start">
                                        <ClockIcon className="w-3 h-3 mr-1"/> {service.duration}
                                    </p>
                                </div>
                                <div className="flex items-center space-x-4">
                                    <p className="text-xl font-bold text-gray-900">${service.price}</p>
                                    <button 
                                        onClick={() => onBook(service.name, service.price)}
                                        className="bg-black text-white text-xs px-5 py-2 uppercase font-bold tracking-widest hover:bg-accent transition rounded-sm shadow-sm"
                                    >
                                        Réserver
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                 </div>
            </div>
        </div>
    )
}

const SalonPage: React.FC = () => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    const { currentUser, openAuthModal, addBooking } = context!;

    const [selectedSalonId, setSelectedSalonId] = useState<string>('');
    const [viewingSalon, setViewingSalon] = useState<Salon | null>(null);
    const [formData, setFormData] = useState({
        name: currentUser ? currentUser.name : '',
        phone: '',
        service: '',
        date: '',
        time: '',
    });
    
    // Booking steps: 'form' -> 'payment' -> 'processing' -> 'success'
    const [bookingStep, setBookingStep] = useState<'form' | 'payment' | 'processing' | 'success'>('form');
    const [selectedWallet, setSelectedWallet] = useState<PaymentWallet | null>(null);
    const [price, setPrice] = useState<number>(0);

    // Update form data name if user logs in
    useEffect(() => {
        if (currentUser) {
            setFormData(prev => ({ ...prev, name: currentUser.name }));
        }
    }, [currentUser]);

    const handleBookClick = (salonId: string) => {
        if (!currentUser) {
            openAuthModal('login');
            return;
        }

        setSelectedSalonId(salonId);
        // Reset service and price if changing salon manually to avoid mismatch
        if (salonId && salonId !== selectedSalonId) {
             setFormData(prev => ({...prev, service: ''}));
             setPrice(0);
        }
        setBookingStep('form');
        const formElement = document.getElementById('salon-booking-form');
        if (formElement) {
            formElement.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const handleServiceBookingFromModal = (serviceName: string, servicePrice: number) => {
        if (!currentUser) {
            openAuthModal('login');
            return;
        }

        if (viewingSalon) {
            setSelectedSalonId(viewingSalon.id);
            setFormData(prev => ({ ...prev, service: serviceName }));
            setPrice(servicePrice);
            setBookingStep('form');
            setViewingSalon(null);
            const formElement = document.getElementById('salon-booking-form');
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
            const selectedSalon = MOCK_SALONS.find(s => s.id === selectedSalonId);
            if (currentUser && selectedSalon) {
                addBooking({
                    userId: currentUser.id,
                    serviceType: 'salon',
                    serviceId: selectedSalon.id,
                    serviceName: selectedSalon.name,
                    date: formData.date,
                    startTime: formData.time,
                    // Salon usually has fixed duration or doesn't track end time strictly like halls
                    totalPrice: price,
                    status: 'Confirmed',
                    paymentMethod: selectedWallet,
                    notes: `Service: ${formData.service}`
                });
            }
            setBookingStep('success');
        }, 2000);
    }
    
    const resetForm = () => {
        setBookingStep('form');
        setFormData({
            name: currentUser ? currentUser.name : '',
            phone: '',
            service: '',
            date: '',
            time: '',
        });
        setSelectedWallet(null);
        setSelectedSalonId('');
        setPrice(0);
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        
        if (name === 'service') {
             // Find price based on service name
             const selectedSalon = MOCK_SALONS.find(s => s.id === selectedSalonId);
             let foundPrice = 0;
             if (selectedSalon) {
                 const service = selectedSalon.services.find(s => s.name === value);
                 if (service) foundPrice = service.price;
             } else {
                 const service = genericServiceOptions.find(s => s.name === value);
                 if (service) foundPrice = service.price;
             }
             setPrice(foundPrice);
        }
    };

    const selectedSalon = MOCK_SALONS.find(s => s.id === selectedSalonId);
    
    // Determine which services to show in the dropdown
    const availableServices = selectedSalon 
        ? selectedSalon.services.map(s => ({ name: s.name, price: s.price }))
        : genericServiceOptions.map(s => ({ name: s.name, price: s.price }));

    return (
        <div className="bg-white min-h-screen font-serif">
            {/* Header Section */}
            <div className="bg-black text-white py-20 px-4 text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-30 bg-[url('https://images.unsplash.com/photo-1522337660859-02fbefca4702?w=1600&q=80')] bg-cover bg-center"></div>
                <div className="relative z-10 container mx-auto">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 tracking-wider text-accent">NOS SALONS DE PRESTIGE</h1>
                    <p className="text-xl md:text-2xl text-gray-300 mb-8 font-light italic">Découvrez les meilleurs coiffeurs et stylistes près de chez vous.</p>
                    <button 
                        onClick={() => handleBookClick('')}
                        className="bg-accent text-white px-8 py-3 rounded-none border border-accent hover:bg-transparent hover:text-accent transition duration-300 uppercase tracking-widest text-sm font-bold"
                    >
                        Trouver un Salon
                    </button>
                </div>
            </div>

            {/* Salons Grid Section */}
            <div className="container mx-auto px-4 py-16">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4 uppercase tracking-wide border-b-2 border-accent inline-block pb-2">Nos Partenaires</h2>
                    <p className="text-gray-500">Une sélection exclusive de salons pour tous vos besoins capillaires.</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {MOCK_SALONS.map(salon => (
                        <div key={salon.id} className="group border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 bg-white flex flex-col">
                            <div className="h-64 overflow-hidden relative">
                                <img src={salon.image} alt={salon.name} className="w-full h-full object-cover transform group-hover:scale-110 transition duration-700" />
                                <div className="absolute top-4 right-4 bg-black/80 text-accent px-3 py-1 text-sm font-bold flex items-center shadow-lg">
                                    <StarIcon className="w-4 h-4 mr-1 fill-current" />
                                    {salon.rating}
                                </div>
                                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition duration-300"></div>
                            </div>
                            <div className="p-6 flex flex-col flex-grow text-center">
                                <h3 className="text-2xl font-bold mb-1 text-gray-800 font-serif">{salon.name}</h3>
                                <div className="flex justify-center items-center text-gray-500 text-sm mb-3">
                                    <LocationIcon className="w-4 h-4 mr-1" />
                                    {salon.location}
                                </div>
                                <p className="text-gray-500 mb-4 text-sm flex-grow line-clamp-3 italic">{salon.description}</p>
                                
                                <div className="border-t border-gray-100 pt-4 mt-auto">
                                    <div className="flex justify-center items-center text-xs text-gray-400 mb-4 uppercase tracking-wider">
                                        <ClockIcon className="w-4 h-4 mr-1" />
                                        {salon.openHours}
                                    </div>
                                    <div className="grid grid-cols-2 gap-2">
                                        <button 
                                            onClick={() => setViewingSalon(salon)}
                                            className="w-full border border-black text-black py-3 hover:bg-gray-100 transition duration-300 uppercase text-xs font-bold tracking-widest"
                                        >
                                            Voir plus
                                        </button>
                                        <button 
                                            onClick={() => handleBookClick(salon.id)}
                                            className="w-full bg-black text-white py-3 hover:bg-accent hover:text-white transition duration-300 uppercase text-xs font-bold tracking-widest"
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

            {/* Booking Form Section */}
            <div id="salon-booking-form" className="bg-gray-50 py-16">
                <div className="container mx-auto px-4 max-w-4xl">
                    <div className="bg-white p-8 md:p-12 shadow-2xl border-t-4 border-accent relative">
                        {/* Golden ornamental border effect */}
                        <div className="absolute top-2 left-2 w-full h-full border border-accent opacity-20 pointer-events-none"></div>

                        <h2 className="text-3xl font-bold text-center mb-2 uppercase tracking-wide font-serif">Réservation</h2>
                        <p className="text-center text-gray-500 mb-8 italic">Votre beauté mérite l'excellence</p>
                        
                        {bookingStep === 'success' ? (
                            <div className="text-center py-12 animate-fade-in bg-gray-50 border border-gray-100">
                                <CheckCircleIcon className="w-20 h-20 text-accent mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-800 mb-2 font-serif">{t('paymentSuccessful')}</h3>
                                <p className="text-gray-600 mb-4">
                                    Merci {formData.name}. Votre rendez-vous chez <span className="font-bold text-accent">{selectedSalon ? selectedSalon.name : 'le salon'}</span> a été confirmé.
                                </p>
                                <p className="text-sm text-gray-400">Un reçu a été envoyé au {formData.phone}.</p>
                                <button onClick={resetForm} className="mt-8 text-accent underline hover:text-black uppercase text-xs font-bold tracking-widest">{t('makeAnotherBooking')}</button>
                            </div>
                        ) : bookingStep === 'processing' ? (
                             <div className="text-center py-12">
                                 <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
                                 <h3 className="text-xl font-semibold mt-4">{t('processingPayment')}</h3>
                                 <p className="text-gray-500">{t('pleaseWait')}</p>
                             </div>
                        ) : bookingStep === 'payment' ? (
                            <div className="animate-fade-in">
                                <h3 className="text-xl font-semibold mb-6 text-center">{t('selectPaymentMethod')}</h3>
                                <div className="grid grid-cols-2 gap-4 mb-8">
                                    {PAYMENT_WALLETS.map(wallet => (
                                        <button 
                                            key={wallet.id} 
                                            onClick={() => setSelectedWallet(wallet.id)} 
                                            className={`p-4 border rounded-lg flex flex-col items-center justify-center transition hover:shadow-md bg-white ${selectedWallet === wallet.id ? 'border-accent ring-2 ring-accent' : 'border-gray-200'}`}
                                        >
                                            <img src={wallet.logo} alt={wallet.name} className="h-10 object-contain"/>
                                            <span className="mt-2 text-sm font-medium text-gray-800">{wallet.name}</span>
                                        </button>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-6 rounded-md mb-8 border border-gray-100">
                                    <h4 className="font-bold text-lg mb-4 border-b border-gray-200 pb-2">{t('bookingSummary')}</h4>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Service:</span>
                                            <span className="font-semibold text-gray-800">{formData.service}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Date:</span>
                                            <span className="font-semibold text-gray-800">{formData.date} à {formData.time}</span>
                                        </div>
                                        <div className="flex justify-between pt-2 border-t border-gray-200 mt-2 text-lg font-bold text-accent">
                                            <span>{t('total')}</span>
                                            <span>${price}</span>
                                        </div>
                                    </div>
                                </div>
                                <button 
                                    onClick={handlePayment} 
                                    disabled={!selectedWallet}
                                    className="w-full bg-accent text-white py-4 font-bold uppercase tracking-widest hover:bg-black transition duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {t('confirmAndPay')} ${price}
                                </button>
                                <button onClick={() => setBookingStep('form')} className="w-full mt-4 text-gray-500 text-sm hover:text-black underline">{t('backToSelection')}</button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6 font-sans">
                                
                                {/* Salon Selector in Form */}
                                <div className="bg-gray-50 p-6 border border-gray-200 mb-8">
                                    <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Salon Sélectionné</label>
                                    <div className="relative">
                                        <select 
                                            value={selectedSalonId} 
                                            onChange={(e) => {
                                                setSelectedSalonId(e.target.value);
                                                setFormData(prev => ({...prev, service: ''})); // Clear service when salon changes
                                                setPrice(0);
                                            }}
                                            className="w-full bg-white border border-gray-300 p-3 pl-4 text-gray-900 focus:outline-none focus:border-accent transition appearance-none cursor-pointer"
                                        >
                                            <option value="">-- Choisissez un Salon (Optionnel) --</option>
                                            {MOCK_SALONS.map(s => (
                                                <option key={s.id} value={s.id}>{s.name} ({s.location})</option>
                                            ))}
                                        </select>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                        </div>
                                    </div>
                                    {selectedSalon && (
                                        <div className="mt-4 flex items-center animate-fade-in">
                                            <img src={selectedSalon.image} alt={selectedSalon.name} className="w-16 h-16 object-cover border border-accent mr-4 shadow-sm" />
                                            <div>
                                                <p className="font-serif font-bold text-lg text-gray-800">{selectedSalon.name}</p>
                                                <p className="text-xs text-gray-500 flex items-center"><StarIcon className="w-3 h-3 text-accent mr-1"/> {selectedSalon.rating}/5</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Nom Complet</label>
                                        <input 
                                            type="text" 
                                            name="name" 
                                            required 
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-accent transition placeholder-gray-400"
                                            placeholder="Ex: Jean Dupont"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Téléphone</label>
                                        <input 
                                            type="tel" 
                                            name="phone" 
                                            required 
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-accent transition placeholder-gray-400"
                                            placeholder="Ex: 06 12 34 56 78"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">
                                        Service Souhaité {selectedSalon ? `chez ${selectedSalon.name}` : ''}
                                    </label>
                                    <select 
                                        name="service" 
                                        value={formData.service} 
                                        onChange={handleInputChange}
                                        required
                                        className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-accent transition cursor-pointer"
                                    >
                                        <option value="" disabled>-- Sélectionnez un service --</option>
                                        {availableServices.map((s, idx) => (
                                            <option key={idx} value={s.name}>{s.name} - À partir de ${s.price}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Date</label>
                                        <input 
                                            type="date" 
                                            name="date" 
                                            required 
                                            value={formData.date}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-accent transition text-gray-700"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 text-xs font-bold mb-2 uppercase tracking-wide">Heure</label>
                                        <input 
                                            type="time" 
                                            name="time" 
                                            required 
                                            value={formData.time}
                                            onChange={handleInputChange}
                                            className="w-full bg-white border-b-2 border-gray-200 p-3 focus:outline-none focus:border-accent transition text-gray-700"
                                        />
                                    </div>
                                </div>
                                
                                {price > 0 && (
                                     <div className="bg-gray-100 p-4 rounded text-center">
                                        <span className="text-gray-600 uppercase text-xs font-bold tracking-wide mr-2">Montant à payer:</span>
                                        <span className="text-2xl font-bold text-accent">${price}</span>
                                    </div>
                                )}

                                {currentUser ? (
                                    <button type="submit" className="w-full bg-accent text-white py-4 mt-8 font-bold uppercase tracking-widest hover:bg-black transition duration-300 shadow-lg">
                                        {t('proceedToPayment')}
                                    </button>
                                ) : (
                                    <button 
                                        type="button" 
                                        onClick={() => openAuthModal('login')}
                                        className="w-full bg-primary text-white py-4 mt-8 font-bold uppercase tracking-widest hover:bg-black transition duration-300 shadow-lg flex justify-center items-center"
                                    >
                                        {t('loginToBookAction')}
                                    </button>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>

            {/* Modal */}
            {viewingSalon && (
                <SalonServicesModal 
                    salon={viewingSalon} 
                    onClose={() => setViewingSalon(null)} 
                    onBook={handleServiceBookingFromModal}
                />
            )}
        </div>
    );
};

export default SalonPage;
