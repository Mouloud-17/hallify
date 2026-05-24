
export enum Role {
    VISITOR = "Visitor",
    USER = "User",
    HALL_ADMIN = "Hall Admin",
    GENERAL_ADMIN = "General Admin",
}

export interface User {
    id: string;
    name: string;
    email: string;
    role: Role;
    hallId?: string; // For Hall Admins
    password?: string; // For User authentication
    language?: string;
}

export interface HallPackage {
    name: string;
    price: number;
    description: string;
}

export interface Hall {
    id: string;
    name: string;
    location: string;
    capacity: number;
    pricePerHour: number;
    description: string;
    images: string[];
    amenities: string[];
    rating?: number;
    reviews?: number;
    packages?: HallPackage[];
}

// Salon Types
export interface Service {
    name: string;
    price: number;
    duration: string;
}

export interface Salon {
    id: string;
    name: string;
    location: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    openHours: string;
    services: Service[];
}

// Cameraman/Provider Types
export interface ServicePackage {
    name: string;
    price: string;
    description: string;
}

export interface Provider {
    id: string;
    name: string;
    specialty: string;
    priceStart: string;
    rating: number;
    reviews: number;
    image: string;
    description: string;
    packages: ServicePackage[];
}

export type ServiceType = 'hall' | 'salon' | 'cameraman';

export interface Booking {
    id: string;
    userId: string;
    
    // Unified service fields
    serviceType: ServiceType;
    serviceId: string; // hallId, salonId, providerId
    serviceName: string; 
    
    // Legacy/Specific support
    hallId?: string; 

    date: string;
    startTime?: string;
    endTime?: string;
    totalPrice: number;
    status: 'Pending Confirmation' | 'Confirmed' | 'Cancelled' | 'Payment Failed' | 'Completed';
    paymentMethod: PaymentWallet;
    transactionId: string;
    
    // Additional details (e.g., "Coupe Homme", "Wedding Package")
    notes?: string;
}

export enum PaymentWallet {
    WAAFI = "Waafi",
    DMONEY = "D-Money",
    CACPAY = "CAC Pay",
    EXIMPAY = "Exim Pay",
}

export interface AppContextType {
    currentUser: User | null;
    loginUser: (email: string, password: string) => boolean;
    registerUser: (name: string, email: string, password: string) => { success: boolean, message: string };
    logout: () => void;
    halls: Hall[];
    bookings: Booking[];
    addBooking: (newBooking: Omit<Booking, 'id' | 'status' | 'transactionId'>) => void;
    updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
    language: string;
    setLanguage: (lang: string) => void;
    openAuthModal: (initialTab: 'login' | 'signup') => void;
}
