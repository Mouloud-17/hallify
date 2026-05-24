
import React, { useContext, useState, useMemo, useEffect } from 'react';
import { AppContext } from '../contexts/AppContext';
import HallCard from './HallCard';
import BookingModal from './BookingModal';
import { Hall } from '../types';
import { useTranslations } from '../hooks/useTranslations';
import { StarIcon, LocationIcon, CheckCircleIcon, UsersIcon } from './Icons';

const HallDetailsModal = ({ hall, onClose, onBook }: { hall: Hall, onClose: () => void, onBook: () => void }) => {
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
                className="bg-white w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-lg shadow-2xl animate-fade-in relative flex flex-col md:flex-row" 
                onClick={e => e.stopPropagation()}
            >
                 <button 
                    onClick={onClose} 
                    className="absolute top-4 right-4 text-white z-10 bg-black/30 hover:bg-black/60 rounded-full p-2 transition backdrop-blur-md"
                 >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                 </button>
                 
                 {/* Left side: Images */}
                 <div className="w-full md:w-2/5 h-64 md:h-auto relative bg-gray-100">
                    <img src={hall.images[0]} alt={hall.name} className="w-full h-full object-cover" />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 text-white md:hidden">
                        <h2 className="text-2xl font-serif font-bold">{hall.name}</h2>
                        <p className="flex items-center text-sm"><LocationIcon className="w-4 h-4 mr-1"/> {hall.location}</p>
                    </div>
                 </div>

                 {/* Right side: Content */}
                 <div className="w-full md:w-3/5 p-6 md:p-8 overflow-y-auto bg-white">
                    <div className="hidden md:block mb-6 border-b border-gray-100 pb-4">
                         <h2 className="text-3xl font-serif font-bold text-gray-900 mb-1">{hall.name}</h2>
                         <div className="flex items-center text-gray-500">
                            <LocationIcon className="w-4 h-4 mr-1 text-accent"/>
                            {hall.location}
                         </div>
                         {hall.rating && (
                             <div className="flex items-center mt-2 text-sm font-medium">
                                 <StarIcon className="w-4 h-4 text-yellow-400 mr-1"/>
                                 {hall.rating} <span className="text-gray-400 ml-1">({hall.reviews} avis)</span>
                             </div>
                         )}
                    </div>

                    <div className="space-y-6">
                        <div>
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">À propos</h3>
                            <p className="text-gray-600 leading-relaxed">{hall.description}</p>
                        </div>

                        <div>
                            <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-2">Équipements</h3>
                            <div className="flex flex-wrap gap-2">
                                {hall.amenities.map((amenity, idx) => (
                                    <span key={idx} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                        <CheckCircleIcon className="w-3 h-3 mr-1 text-green-500"/>
                                        {amenity}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {hall.packages && hall.packages.length > 0 && (
                            <div>
                                <h3 className="font-bold text-gray-900 uppercase text-xs tracking-wider mb-3">Forfaits & Offres</h3>
                                <div className="space-y-3">
                                    {hall.packages.map((pkg, idx) => (
                                        <div key={idx} className="border border-gray-200 rounded-lg p-4 hover:border-accent transition group bg-gray-50">
                                            <div className="flex justify-between items-start mb-1">
                                                <h4 className="font-bold text-gray-800 group-hover:text-accent transition">{pkg.name}</h4>
                                                <span className="font-bold text-gray-900">${pkg.price}</span>
                                            </div>
                                            <p className="text-xs text-gray-500">{pkg.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        
                        <div className="pt-4 mt-8 border-t border-gray-100 flex items-center justify-between">
                            <div className="flex items-center text-gray-800">
                                <UsersIcon className="w-5 h-5 mr-2 text-gray-400"/>
                                <span className="font-bold">{hall.capacity}</span> <span className="text-sm ml-1 text-gray-500">invités max</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="text-right mr-2 hidden sm:block">
                                    <div className="text-xs text-gray-400 uppercase">Tarif horaire</div>
                                    <div className="font-bold text-xl">${hall.pricePerHour}</div>
                                </div>
                                <button 
                                    onClick={onBook}
                                    className="bg-accent text-white px-8 py-3 rounded shadow-lg hover:bg-black transition font-bold uppercase text-sm tracking-wide"
                                >
                                    Réserver
                                </button>
                            </div>
                        </div>
                    </div>
                 </div>
            </div>
        </div>
    )
}

const HallListingPage: React.FC = () => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    const [filters, setFilters] = useState({
        location: '',
        minCapacity: '',
        maxPrice: ''
    });
    
    // Modal states
    const [viewingHall, setViewingHall] = useState<Hall | null>(null);
    const [bookingHall, setBookingHall] = useState<Hall | null>(null);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFilters(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };

    const filteredHalls = useMemo(() => {
        if (!context?.halls) return [];
        return context.halls.filter(hall => {
            const locationMatch = filters.location ? hall.location.toLowerCase().includes(filters.location.toLowerCase()) : true;
            const capacityMatch = filters.minCapacity ? hall.capacity >= parseInt(filters.minCapacity) : true;
            const priceMatch = filters.maxPrice ? hall.pricePerHour <= parseInt(filters.maxPrice) : true;
            return locationMatch && capacityMatch && priceMatch;
        });
    }, [context?.halls, filters]);

    const handleBook = (hall: Hall) => {
        setViewingHall(null); // Close details if open
        setBookingHall(hall);
    };

    return (
        <div>
            <div className="bg-surface rounded-lg shadow-lg p-6 mb-8 text-center">
                <h1 className="text-4xl font-serif text-accent mb-2">{t('findYourPerfectVenue')}</h1>
                <p className="text-secondary max-w-2xl mx-auto">{t('browseExclusiveCollection')}</p>
            </div>

            <div className="bg-surface rounded-lg shadow p-4 mb-8 flex flex-col md:flex-row gap-4 items-center">
                <input
                    type="text"
                    name="location"
                    placeholder={t('searchByLocation')}
                    value={filters.location}
                    onChange={handleFilterChange}
                    className="w-full md:w-1/3 p-2 border border-secondary/30 rounded-md focus:ring-accent focus:border-accent bg-white"
                />
                <input
                    type="number"
                    name="minCapacity"
                    placeholder={t('minCapacity')}
                    value={filters.minCapacity}
                    onChange={handleFilterChange}
                    className="w-full md:w-1/3 p-2 border border-secondary/30 rounded-md focus:ring-accent focus:border-accent bg-white"
                />
                <input
                    type="number"
                    name="maxPrice"
                    placeholder={t('maxPricePerHour')}
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="w-full md:w-1/3 p-2 border border-secondary/30 rounded-md focus:ring-accent focus:border-accent bg-white"
                />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredHalls.map(hall => (
                    <HallCard 
                        key={hall.id} 
                        hall={hall} 
                        onSeeMore={(h) => setViewingHall(h)}
                        onBook={(h) => handleBook(h)}
                    />
                ))}
            </div>

            {viewingHall && (
                <HallDetailsModal 
                    hall={viewingHall} 
                    onClose={() => setViewingHall(null)} 
                    onBook={() => handleBook(viewingHall)}
                />
            )}

            {bookingHall && (
                <BookingModal 
                    hall={bookingHall} 
                    onClose={() => setBookingHall(null)} 
                />
            )}
        </div>
    );
};

export default HallListingPage;
