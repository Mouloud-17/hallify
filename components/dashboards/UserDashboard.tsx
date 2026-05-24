
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Booking } from '../../types';
import { CalendarIcon, ClockIcon, CurrencyDollarIcon, LocationIcon, CheckCircleIcon, XCircleIcon, VideoCameraIcon } from '../Icons';
import { MOCK_HALLS, MOCK_SALONS, MOCK_PROVIDERS } from '../../constants';

const BookingCard: React.FC<{booking: Booking}> = ({booking}) => {
    const context = useContext(AppContext);

    // Dynamic resource lookup based on service type
    const resourceDetails = useMemo(() => {
        if (booking.serviceType === 'hall') {
            const hall = MOCK_HALLS.find(h => h.id === booking.serviceId);
            return { image: hall?.images[0], location: hall?.location, typeLabel: 'Salle' };
        } else if (booking.serviceType === 'salon') {
            const salon = MOCK_SALONS.find(s => s.id === booking.serviceId);
            return { image: salon?.image, location: salon?.location, typeLabel: 'Salon & Beauté' };
        } else if (booking.serviceType === 'cameraman') {
            const provider = MOCK_PROVIDERS.find(p => p.id === booking.serviceId);
            return { image: provider?.image, location: 'Sur site', typeLabel: 'Photo & Vidéo' };
        }
        return { image: 'https://via.placeholder.com/150', location: 'Unknown', typeLabel: 'Service' };
    }, [booking]);

    const getStatusChip = (status: Booking['status']) => {
        switch(status) {
            case 'Confirmed': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">{status}</span>;
            case 'Pending Confirmation': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-yellow-600 bg-yellow-200">{status}</span>;
            case 'Cancelled': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-red-600 bg-red-200">{status}</span>;
            case 'Completed': return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-200">{status}</span>;
            default: return <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-600 bg-gray-200">{status}</span>;
        }
    }

    return (
        <div className="bg-surface rounded-lg shadow-md overflow-hidden flex flex-col md:flex-row relative">
            <div className="md:absolute top-2 left-2 z-10 hidden md:block">
                 <span className="bg-black/70 text-white text-xs px-2 py-1 rounded shadow">{resourceDetails.typeLabel}</span>
            </div>
            <img src={resourceDetails.image} alt={booking.serviceName} className="w-full md:w-1/3 h-48 md:h-auto object-cover" />
            <div className="p-4 md:p-6 flex-grow flex flex-col">
                <div className="flex justify-between items-start mb-2">
                    <div>
                        <h3 className="text-xl font-bold font-serif text-primary">{booking.serviceName}</h3>
                        <p className="text-sm text-secondary flex items-center"><LocationIcon className="w-4 h-4 mr-1"/>{resourceDetails.location}</p>
                    </div>
                    {getStatusChip(booking.status)}
                </div>
                
                {booking.notes && (
                    <div className="mb-2 bg-background p-2 rounded text-xs text-primary/80 italic border-l-2 border-accent">
                        {booking.notes}
                    </div>
                )}

                <div className="border-t border-b border-gray-200 my-3 py-3 text-sm space-y-2">
                    <p className="flex justify-between">
                        <span className="flex items-center text-secondary"><CalendarIcon className="w-4 h-4 mr-2"/>Date:</span>
                        <span className="font-medium text-primary">{booking.date}</span>
                    </p>
                    <p className="flex justify-between">
                        <span className="flex items-center text-secondary"><ClockIcon className="w-4 h-4 mr-2"/>Time:</span>
                        <span className="font-medium text-primary">
                            {booking.startTime !== "00:00" ? `${booking.startTime} - ${booking.endTime || 'Fin'}` : 'Journée entière'}
                        </span>
                    </p>
                    <p className="flex justify-between">
                        <span className="flex items-center text-secondary"><CurrencyDollarIcon className="w-4 h-4 mr-2"/>Total Paid:</span>
                        <span className="font-medium text-primary">${booking.totalPrice.toFixed(2)}</span>
                    </p>
                </div>
                 <div className="mt-auto flex space-x-2">
                    <button 
                        onClick={() => context?.updateBookingStatus(booking.id, 'Cancelled')}
                        className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-md hover:bg-red-200 transition disabled:opacity-50"
                        disabled={booking.status === 'Cancelled' || booking.status === 'Completed'}>
                        Cancel Booking
                    </button>
                    <button className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-md hover:bg-blue-200 transition">
                        View Receipt
                    </button>
                </div>
            </div>
        </div>
    )
}

const UserDashboard: React.FC = () => {
    const context = useContext(AppContext);

    const userBookings = useMemo(() => {
        return context?.bookings
            .filter(b => b.userId === context?.currentUser?.id)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()) || [];
    }, [context?.bookings, context?.currentUser?.id]);
    
    const todayStr = new Date().toISOString().split('T')[0];
    
    const upcomingBookings = userBookings.filter(b => b.date >= todayStr && b.status !== 'Completed' && b.status !== 'Cancelled');
    const pastBookings = userBookings.filter(b => b.date < todayStr || b.status === 'Completed' || b.status === 'Cancelled');


    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-semibold font-serif mb-4">Upcoming Bookings</h2>
                {upcomingBookings.length > 0 ? (
                    <div className="space-y-4">
                        {upcomingBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                    </div>
                ) : (
                    <p className="text-secondary p-4 bg-background rounded-md">You have no upcoming bookings.</p>
                )}
            </div>
             <div>
                <h2 className="text-2xl font-semibold font-serif mb-4">Booking History</h2>
                 {pastBookings.length > 0 ? (
                    <div className="space-y-4">
                        {pastBookings.map(b => <BookingCard key={b.id} booking={b} />)}
                    </div>
                ) : (
                    <p className="text-secondary p-4 bg-background rounded-md">You have no past bookings.</p>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;
