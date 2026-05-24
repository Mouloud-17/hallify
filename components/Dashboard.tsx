
import React, { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';
import { Role } from '../types';
import UserDashboard from './dashboards/UserDashboard';
import HallAdminDashboard from './dashboards/HallAdminDashboard';
import GeneralAdminDashboard from './dashboards/GeneralAdminDashboard';
import { useTranslations } from '../hooks/useTranslations';

const Dashboard: React.FC = () => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    
    if (!context || !context.currentUser) {
        return (
            <div className="text-center p-12 bg-surface rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold mb-4">You are not logged in.</h2>
                <p className="text-secondary">Please select a role from the header to simulate logging in and view a dashboard.</p>
            </div>
        );
    }

    const { currentUser } = context;

    const renderDashboard = () => {
        switch (currentUser.role) {
            case Role.USER:
                return <UserDashboard />;
            case Role.HALL_ADMIN:
                return <HallAdminDashboard />;
            case Role.GENERAL_ADMIN:
                return <GeneralAdminDashboard />;
            default:
                return <div className="text-center p-8">Invalid user role.</div>;
        }
    };
    
    return (
        <div>
            <div className="mb-8">
                <h1 className="text-4xl font-serif text-accent">{t('dashboard')}</h1>
                <p className="text-secondary">{t('welcomeBack', { name: currentUser.name })}</p>
            </div>
            {renderDashboard()}
        </div>
    );
};

export default Dashboard;