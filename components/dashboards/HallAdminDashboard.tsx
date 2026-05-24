
import React, { useContext, useMemo } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Booking } from '../../types';
import { MOCK_USERS } from '../../constants';
import { CheckCircleIcon, XCircleIcon } from '../Icons';

const HallAdminDashboard: React.FC = () => {
    const context = useContext(AppContext);
    
    const hallBookings = useMemo(() => {
        if (!context || !context.currentUser || !context.currentUser.hallId) return [];
        return context.bookings
            .filter(b => b.hallId === context.currentUser?.hallId)
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }, [context]);

    const hall = context?.halls.find(h => h.id === context?.currentUser?.hallId);

    const pendingBookings = hallBookings.filter(b => b.status === 'Pending Confirmation');
    const otherBookings = hallBookings.filter(b => b.status !== 'Pending Confirmation');

    return (
        <div className="space-y-8">
            {hall && <h2 className="text-2xl font-semibold font-serif mb-4">Managing Bookings for: <span className="text-accent">{hall.name}</span></h2>}
            
            <div>
                <h3 className="text-xl font-semibold mb-4">Pending Requests ({pendingBookings.length})</h3>
                {pendingBookings.length > 0 ? (
                     <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-primary">
                            <thead className="text-xs text-primary uppercase bg-background">
                                <tr>
                                    <th scope="col" className="px-6 py-3">User</th>
                                    <th scope="col" className="px-6 py-3">Date</th>
                                    <th scope="col" className="px-6 py-3">Time</th>
                                    <th scope="col" className="px-6 py-3">Amount</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pendingBookings.map(booking => {
                                    const user = MOCK_USERS.find(u => u.id === booking.userId);
                                    return (
                                        <tr key={booking.id} className="border-b hover:bg-background/50">
                                            <td className="px-6 py-4 font-medium">{user?.name || 'Unknown User'}</td>
                                            <td className="px-6 py-4">{booking.date}</td>
                                            <td className="px-6 py-4">{booking.startTime} - {booking.endTime}</td>
                                            <td className="px-6 py-4">${booking.totalPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 flex space-x-2">
                                                <button onClick={() => context?.updateBookingStatus(booking.id, 'Confirmed')} className="text-green-500 hover:text-green-700"><CheckCircleIcon className="w-6 h-6"/></button>
                                                <button onClick={() => context?.updateBookingStatus(booking.id, 'Cancelled')} className="text-red-500 hover:text-red-700"><XCircleIcon className="w-6 h-6"/></button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : <p className="text-secondary p-4 bg-background rounded-md">No pending booking requests.</p>}
            </div>

            <div>
                <h3 className="text-xl font-semibold mb-4">All Bookings ({otherBookings.length})</h3>
                <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                    <table className="w-full text-sm text-left text-primary">
                        <thead className="text-xs text-primary uppercase bg-background">
                            <tr>
                                <th scope="col" className="px-6 py-3">User</th>
                                <th scope="col" className="px-6 py-3">Date</th>
                                <th scope="col" className="px-6 py-3">Status</th>
                                <th scope="col" className="px-6 py-3">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {otherBookings.map(booking => {
                                const user = MOCK_USERS.find(u => u.id === booking.userId);
                                return (
                                    <tr key={booking.id} className="border-b hover:bg-background/50">
                                        <td className="px-6 py-4 font-medium">{user?.name || 'Unknown User'}</td>
                                        <td className="px-6 py-4">{booking.date}</td>
                                        <td className="px-6 py-4">{booking.status}</td>
                                        <td className="px-6 py-4">${booking.totalPrice.toFixed(2)}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default HallAdminDashboard;
