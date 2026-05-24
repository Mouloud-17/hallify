
import React from 'react';
import { Hall, Role } from '../types';
import { UsersIcon, LocationIcon, CurrencyDollarIcon, StarIcon } from './Icons';
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { useTranslations } from '../hooks/useTranslations';

interface HallCardProps {
    hall: Hall;
    onSeeMore: (hall: Hall) => void;
    onBook: (hall: Hall) => void;
}

const HallCard: React.FC<HallCardProps> = ({ hall, onSeeMore, onBook }) => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    
    return (
        <div className="bg-surface rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-1 transition-transform duration-300 flex flex-col group">
            <div className="relative h-48 overflow-hidden">
                <img src={hall.images[0]} alt={hall.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-700"/>
                {hall.rating && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-bold flex items-center shadow-sm">
                        <StarIcon className="w-3 h-3 text-yellow-500 mr-1" />
                        {hall.rating}
                    </div>
                )}
            </div>
            <div className="p-6 flex flex-col flex-grow">
                <h3 className="text-2xl font-serif font-bold text-primary mb-2">{hall.name}</h3>
                <div className="flex items-center text-secondary mb-4 text-sm">
                    <LocationIcon className="w-4 h-4 mr-2" />
                    <span>{hall.location}</span>
                </div>
                <p className="text-primary/90 text-sm mb-4 flex-grow line-clamp-2">{hall.description}</p>
                
                <div className="flex justify-between items-center text-sm text-primary border-t border-b border-gray-200 py-3 my-3">
                    <div className="flex items-center">
                        <UsersIcon className="w-5 h-5 mr-2 text-accent"/>
                        <span>{t('upTo')} {hall.capacity} {t('guests')}</span>
                    </div>
                    <div className="flex items-center">
                        <CurrencyDollarIcon className="w-5 h-5 mr-2 text-accent"/>
                        <span>${hall.pricePerHour}{t('perHour')}</span>
                    </div>
                </div>

                <div className="flex gap-2 mt-auto">
                    <button
                        onClick={() => onSeeMore(hall)}
                        className="flex-1 border border-primary text-primary py-2 px-4 rounded-md hover:bg-background transition duration-300 font-semibold"
                    >
                        Voir plus
                    </button>
                    <button 
                        onClick={() => onBook(hall)}
                        className="flex-1 bg-accent text-white py-2 px-4 rounded-md hover:bg-opacity-90 transition duration-300 font-semibold disabled:bg-secondary disabled:cursor-not-allowed"
                        disabled={!context?.currentUser || context.currentUser.role !== Role.USER}
                        title={!context?.currentUser || context.currentUser.role !== Role.USER ? t('loginToBook') : t('bookThisHall')}
                    >
                        {t('bookNow')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default HallCard;
