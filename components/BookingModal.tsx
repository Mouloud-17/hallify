
import React, { useState, useContext, useMemo } from 'react';
import { Hall, PaymentWallet, Role } from '../types';
import { AppContext } from '../contexts/AppContext';
import { PAYMENT_WALLETS } from '../constants';
import { CalendarIcon, CheckCircleIcon, ClockIcon, CurrencyDollarIcon, XCircleIcon } from './Icons';
import { useTranslations } from '../hooks/useTranslations';

interface BookingModalProps {
    hall: Hall;
    onClose: () => void;
}

type BookingStep = 'selection' | 'payment' | 'processing' | 'confirmation';

const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'];

const BookingModal: React.FC<BookingModalProps> = ({ hall, onClose }) => {
    const context = useContext(AppContext);
    const { t } = useTranslations();
    const [step, setStep] = useState<BookingStep>('selection');
    const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState<string>('09:00');
    const [endTime, setEndTime] = useState<string>('12:00');
    const [selectedWallet, setSelectedWallet] = useState<PaymentWallet | null>(null);
    const [error, setError] = useState<string>('');

    const duration = useMemo(() => {
        if (!startTime || !endTime) return 0;
        const start = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);
        if (end <= start) return 0;
        return (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    }, [startTime, endTime]);

    const totalPrice = duration * hall.pricePerHour;

    const handleProceedToPayment = () => {
        if (duration <= 0) {
            setError('End time must be after start time.');
            return;
        }
        if (!date) {
            setError('Please select a date.');
            return;
        }
        setError('');
        setStep('payment');
    };

    const handlePayment = () => {
        if (!selectedWallet) {
            setError('Please select a payment wallet.');
            return;
        }
        setError('');
        setStep('processing');
        // Simulate payment processing and webhook
        setTimeout(() => {
            if (context?.currentUser?.role === Role.USER) {
                context.addBooking({
                    userId: context.currentUser.id,
                    serviceType: 'hall',
                    serviceId: hall.id,
                    serviceName: hall.name,
                    hallId: hall.id,
                    date,
                    startTime,
                    endTime,
                    totalPrice,
                    paymentMethod: selectedWallet,
                    notes: `Reservation ${duration}h`
                });
            }
            setStep('confirmation');
        }, 2000);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
            <div className="bg-surface rounded-lg shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="p-6 border-b flex justify-between items-center">
                    <h2 className="text-2xl font-serif text-accent">{t('book')} {hall.name}</h2>
                    <button onClick={onClose} className="text-primary hover:text-red-500">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="p-8">
                    {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}

                    {step === 'selection' && (
                        <div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-primary mb-1">{t('date')}</label>
                                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date().toISOString().split('T')[0]} className="w-full p-2 border border-secondary/30 rounded-md"/>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-1">{t('startTime')}</label>
                                    <select value={startTime} onChange={e => setStartTime(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md">
                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-primary mb-1">{t('endTime')}</label>
                                    <select value={endTime} onChange={e => setEndTime(e.target.value)} className="w-full p-2 border border-secondary/30 rounded-md">
                                        {timeSlots.map(t => <option key={t} value={t}>{t}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="bg-background p-4 rounded-md text-center">
                                <p className="text-secondary">{t('totalDuration')} <span className="font-bold text-primary">{duration} {t('hours')}</span></p>
                                <p className="text-2xl font-bold text-accent">{t('totalPrice')} ${totalPrice.toFixed(2)}</p>
                            </div>
                            <button onClick={handleProceedToPayment} className="w-full mt-6 bg-accent text-white py-3 rounded-md font-semibold hover:bg-opacity-90 transition">{t('proceedToPayment')}</button>
                        </div>
                    )}

                    {step === 'payment' && (
                        <div>
                            <h3 className="text-xl font-semibold mb-4 text-center">{t('selectPaymentMethod')}</h3>
                            <div className="grid grid-cols-2 gap-4 mb-6">
                                {PAYMENT_WALLETS.map(wallet => (
                                    <button key={wallet.id} onClick={() => setSelectedWallet(wallet.id)} className={`p-4 border rounded-lg flex flex-col items-center justify-center transition ${selectedWallet === wallet.id ? 'border-accent ring-2 ring-accent' : 'border-secondary/30'}`}>
                                        <img src={wallet.logo} alt={wallet.name} className="h-10 object-contain"/>
                                        <span className="mt-2 text-sm font-medium">{wallet.name}</span>
                                    </button>
                                ))}
                            </div>
                            <div className="bg-background p-4 rounded-md mb-6">
                                <h4 className="font-bold text-lg mb-2">{t('bookingSummary')}</h4>
                                <div className="text-sm space-y-1">
                                    <p className="flex justify-between"><span><CalendarIcon className="w-4 h-4 inline mr-2"/>{t('date')}:</span> <span>{date}</span></p>
                                    <p className="flex justify-between"><span><ClockIcon className="w-4 h-4 inline mr-2"/>{t('time')}</span> <span>{startTime} - {endTime} ({duration} hrs)</span></p>
                                    <p className="flex justify-between font-bold text-base mt-2"><span><CurrencyDollarIcon className="w-5 h-5 inline mr-2"/>{t('total')}</span> <span>${totalPrice.toFixed(2)}</span></p>
                                </div>
                            </div>
                            <button onClick={handlePayment} className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition">{t('payNow')}</button>
                             <button onClick={() => setStep('selection')} className="w-full mt-2 text-sm text-secondary hover:text-primary transition">{t('backToSelection')}</button>
                        </div>
                    )}
                    
                    {step === 'processing' && (
                        <div className="text-center py-12">
                             <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
                            <h3 className="text-xl font-semibold mt-4">{t('processingPayment')}</h3>
                            <p className="text-secondary">{t('pleaseWait')}</p>
                        </div>
                    )}

                    {step === 'confirmation' && (
                        <div className="text-center py-12">
                            <CheckCircleIcon className="w-20 h-20 text-green-500 mx-auto mb-4"/>
                            <h3 className="text-2xl font-bold text-green-600">{t('bookingRequestSent')}</h3>
                            <p className="text-primary mt-2">{t('bookingPendingConfirmation')}</p>
                            <p className="text-sm text-secondary mt-1">{t('checkDashboard')}</p>
                            <button onClick={onClose} className="mt-8 bg-accent text-white py-2 px-8 rounded-md font-semibold hover:bg-opacity-90 transition">{t('close')}</button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BookingModal;
