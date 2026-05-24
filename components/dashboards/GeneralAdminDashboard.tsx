
import React, { useContext, useMemo, useState } from 'react';
import { AppContext } from '../../contexts/AppContext';
import { Booking, Hall } from '../../types';
import { MOCK_USERS } from '../../constants';

type AdminTab = 'stats' | 'bookings' | 'halls' | 'users';

const GeneralAdminDashboard: React.FC = () => {
    const context = useContext(AppContext);
    const [activeTab, setActiveTab] = useState<AdminTab>('stats');
    
    const stats = useMemo(() => {
        const totalBookings = context?.bookings.length || 0;
        const totalRevenue = context?.bookings.reduce((sum, b) => b.status === 'Confirmed' || b.status === 'Completed' ? sum + b.totalPrice : sum, 0) || 0;
        const pendingBookings = context?.bookings.filter(b => b.status === 'Pending Confirmation').length || 0;
        return { totalBookings, totalRevenue, pendingBookings };
    }, [context?.bookings]);

    const renderContent = () => {
        switch (activeTab) {
            case 'stats':
                return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-surface p-6 rounded-lg shadow-md">
                            <h4 className="text-secondary text-sm font-semibold uppercase">Total Revenue</h4>
                            <p className="text-3xl font-bold text-accent">${stats.totalRevenue.toLocaleString()}</p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg shadow-md">
                            <h4 className="text-secondary text-sm font-semibold uppercase">Total Bookings</h4>
                            <p className="text-3xl font-bold text-primary">{stats.totalBookings}</p>
                        </div>
                        <div className="bg-surface p-6 rounded-lg shadow-md">
                            <h4 className="text-secondary text-sm font-semibold uppercase">Pending Confirmations</h4>
                            <p className="text-3xl font-bold text-yellow-500">{stats.pendingBookings}</p>
                        </div>
                    </div>
                );
            case 'bookings':
                return (
                     <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-primary">
                            <thead className="text-xs text-primary uppercase bg-background">
                                <tr>
                                    <th className="px-6 py-3">Service</th>
                                    <th className="px-6 py-3">Type</th>
                                    <th className="px-6 py-3">User</th>
                                    <th className="px-6 py-3">Date</th>
                                    <th className="px-6 py-3">Status</th>
                                    <th className="px-6 py-3">Amount</th>
                                    <th className="px-6 py-3">Transaction ID</th>
                                </tr>
                            </thead>
                            <tbody>
                                {context?.bookings.map(b => {
                                    const user = MOCK_USERS.find(u => u.id === b.userId);
                                    return (
                                        <tr key={b.id} className="border-b hover:bg-background/50">
                                            <td className="px-6 py-4 font-medium">{b.serviceName}</td>
                                            <td className="px-6 py-4 capitalize">{b.serviceType}</td>
                                            <td className="px-6 py-4">{user?.name}</td>
                                            <td className="px-6 py-4">{b.date}</td>
                                            <td className="px-6 py-4">{b.status}</td>
                                            <td className="px-6 py-4">${b.totalPrice.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-xs text-secondary">{b.transactionId}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                );
            case 'halls':
                return (
                     <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-primary">
                             <thead className="text-xs text-primary uppercase bg-background">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Location</th>
                                    <th className="px-6 py-3">Capacity</th>
                                    <th className="px-6 py-3">Price/hr</th>
                                </tr>
                            </thead>
                            <tbody>
                                {context?.halls.map(h => (
                                    <tr key={h.id} className="border-b hover:bg-background/50">
                                        <td className="px-6 py-4 font-medium">{h.name}</td>
                                        <td className="px-6 py-4">{h.location}</td>
                                        <td className="px-6 py-4">{h.capacity}</td>
                                        <td className="px-6 py-4">${h.pricePerHour}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            case 'users':
                return (
                    <div className="bg-surface rounded-lg shadow-md overflow-x-auto">
                        <table className="w-full text-sm text-left text-primary">
                             <thead className="text-xs text-primary uppercase bg-background">
                                <tr>
                                    <th className="px-6 py-3">Name</th>
                                    <th className="px-6 py-3">Email</th>
                                    <th className="px-6 py-3">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_USERS.map(u => (
                                    <tr key={u.id} className="border-b hover:bg-background/50">
                                        <td className="px-6 py-4 font-medium">{u.name}</td>
                                        <td className="px-6 py-4">{u.email}</td>
                                        <td className="px-6 py-4">{u.role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default: return null;
        }
    }

    const TabButton: React.FC<{tabId: AdminTab; label: string}> = ({tabId, label}) => (
        <button
            onClick={() => setActiveTab(tabId)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition ${activeTab === tabId ? 'bg-accent text-white' : 'text-primary hover:bg-background'}`}
        >
            {label}
        </button>
    )

    return (
        <div className="space-y-6">
            <div className="flex space-x-2 p-1 bg-background rounded-lg">
                <TabButton tabId="stats" label="Statistics" />
                <TabButton tabId="bookings" label="All Bookings" />
                <TabButton tabId="halls" label="Manage Halls" />
                <TabButton tabId="users" label="Manage Users" />
            </div>
            <div>{renderContent()}</div>
        </div>
    );
};

export default GeneralAdminDashboard;
