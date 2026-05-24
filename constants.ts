
import { User, Role, Hall, Booking, PaymentWallet, Salon, Provider } from './types';

export const MOCK_USERS: User[] = [
    { id: 'u1', name: 'John Doe', email: 'john.doe@example.com', role: Role.USER, password: 'password123', language: 'Français' },
    { id: 'ha1', name: 'Alice', email: 'alice@grandhall.com', role: Role.HALL_ADMIN, hallId: 'h1', language: 'Arabe' },
    { id: 'ga1', name: 'Super Admin', email: 'admin@hallreserve.com', role: Role.GENERAL_ADMIN },
];

export const MOCK_HALLS: Hall[] = [
    {
        id: 'h1',
        name: 'City Hall',
        location: 'Downtown, Capital City',
        capacity: 300,
        pricePerHour: 500,
        description: 'An elegant and spacious ballroom perfect for grand weddings and corporate events. Features crystal chandeliers and a classic design.',
        images: ['https://picsum.photos/seed/h1a/800/600', 'https://picsum.photos/seed/h1b/800/600', 'https://picsum.photos/seed/h1c/800/600'],
        amenities: ['Air Conditioning', 'Stage', 'Sound System', 'Projector', 'Valet Parking'],
        rating: 4.8,
        reviews: 156,
        packages: [
            { name: 'Soirée Mariage', price: 3000, description: 'Location salle complète 18h-02h + Nettoyage inclus.' },
            { name: 'Conférence Demi-journée', price: 1500, description: '4 heures de location + équipement AV complet.' },
            { name: 'Gala Prestige', price: 4500, description: 'Journée complète, service de sécurité et valet.' }
        ]
    },
    {
        id: 'h2',
        name: 'Ayla Hotel',
        location: 'Seaside, Coast Town',
        capacity: 150,
        pricePerHour: 350,
        description: 'A beautiful outdoor pavilion with stunning sunset views over the ocean. Ideal for romantic ceremonies and intimate gatherings.',
        images: ['https://picsum.photos/seed/h2a/800/600', 'https://picsum.photos/seed/h2b/800/600', 'https://picsum.photos/seed/h2c/800/600'],
        amenities: ['Outdoor Seating', 'Ocean View', 'Catering Services', 'Bridal Suite'],
        rating: 4.9,
        reviews: 89,
        packages: [
            { name: 'Cérémonie Coucher de Soleil', price: 1200, description: '3 heures en soirée pour la cérémonie et le vin d\'honneur.' },
            { name: 'Réception Intime', price: 2000, description: '6 heures de location avec accès terrasse privée.' }
        ]
    },
    {
        id: 'h3',
        name: 'Kimpenski',
        location: 'Arts District, Metro City',
        capacity: 80,
        pricePerHour: 200,
        description: 'A chic and contemporary loft space with an industrial design. Perfect for modern weddings, art shows, and trendy parties.',
        images: ['https://picsum.photos/seed/h3a/800/600', 'https://picsum.photos/seed/h3b/800/600', 'https://picsum.photos/seed/h3c/800/600'],
        amenities: ['High-Speed WiFi', 'Kitchenette', 'Artistic Decor', 'Flexible Layout'],
        rating: 4.6,
        reviews: 42,
        packages: [
            { name: 'Vernissage Art', price: 600, description: '4 heures de location en soirée.' },
            { name: 'Workshop Journée', price: 1000, description: '8 heures (09h-17h) avec café inclus.' }
        ]
    },
    {
        id: 'h4',
        name: 'Charaton',
        location: 'Old Town, Historic Center',
        capacity: 500,
        pricePerHour: 1000,
        description: 'Experience royalty in this magnificent heritage palace. With sprawling gardens and opulent interiors, it is the ultimate luxury wedding venue.',
        images: ['https://picsum.photos/seed/h4a/800/600', 'https://picsum.photos/seed/h4b/800/600', 'https://picsum.photos/seed/h4c/800/600'],
        amenities: ['Historic Architecture', 'Landscaped Gardens', 'In-house Catering', 'Ample Parking'],
        rating: 5.0,
        reviews: 210,
        packages: [
            { name: 'Mariage Royal', price: 12000, description: 'Accès exclusif au domaine complet pour le week-end.' },
            { name: 'Grande Réception', price: 8000, description: 'Salle de bal principale pour la soirée.' }
        ]
    },
    {
        id: 'h5',
        name: 'Emely Hall',
        location: 'Garden District, Suburbia',
        capacity: 120,
        pricePerHour: 280,
        description: 'A charming hall surrounded by lush gardens, perfect for daytime events and receptions.',
        images: ['https://picsum.photos/seed/h5a/800/600', 'https://picsum.photos/seed/h5b/800/600', 'https://picsum.photos/seed/h5c/800/600'],
        amenities: ['Garden Access', 'Natural Light', 'Catering Kitchen', 'Free Parking'],
        rating: 4.5,
        reviews: 78,
         packages: [
            { name: 'Garden Party', price: 1200, description: 'Après-midi complet dans les jardins et le hall.' },
            { name: 'Anniversaire', price: 800, description: 'Soirée festive 19h-00h.' }
        ]
    },
    {
        id: 'h6',
        name: 'Turkish Hall',
        location: 'Cultural Center, Metro City',
        capacity: 250,
        pricePerHour: 450,
        description: 'An exquisitely decorated hall with authentic Turkish design elements, creating a unique and memorable atmosphere.',
        images: ['https://picsum.photos/seed/h6a/800/600', 'https://picsum.photos/seed/h6b/800/600', 'https://picsum.photos/seed/h6c/800/600'],
        amenities: ['Ornate Decor', 'Stage', 'Sound System', 'Dance Floor'],
        rating: 4.7,
        reviews: 134,
        packages: [
            { name: 'Henné Traditionnel', price: 2000, description: 'Décoration spéciale et espace danse inclus.' },
            { name: 'Soirée Culturelle', price: 1800, description: 'Location salle et équipement sonore.' }
        ]
    },
    {
        id: 'h7',
        name: 'Ahmed Salah Hall',
        location: 'Business District, Downtown',
        capacity: 400,
        pricePerHour: 700,
        description: 'A modern and versatile conference hall, equipped with state-of-the-art technology for corporate events and large gatherings.',
        images: ['https://picsum.photos/seed/h7a/800/600', 'https://picsum.photos/seed/h7b/800/600', 'https://picsum.photos/seed/h7c/800/600'],
        amenities: ['AV Equipment', 'High-Speed WiFi', 'Breakout Rooms', 'On-site Support'],
        rating: 4.6,
        reviews: 112,
        packages: [
            { name: 'Convention Tech', price: 5000, description: 'Journée complète, accès internet fibre dédié.' },
            { name: 'Séminaire', price: 3000, description: 'Demi-journée avec salles de pause.' }
        ]
    },
];

export const MOCK_SALONS: Salon[] = [
    {
        id: 's1',
        name: "L'Élégance Dorée",
        location: "Centre Ville, Quartier Chic",
        rating: 4.9,
        reviews: 215,
        image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&q=80",
        description: "Le summum du luxe. Spécialistes en coloration et soins profonds.",
        openHours: "10:00 - 20:00",
        services: [
            { name: 'Coupe Prestige Homme', price: 35, duration: '45 min' },
            { name: 'Coupe & Brushing Femme', price: 65, duration: '60 min' },
            { name: 'Coloration Signature', price: 90, duration: '120 min' },
            { name: 'Soin Capillaire Or', price: 50, duration: '45 min' }
        ]
    },
    {
        id: 's2',
        name: "Urban Cuts & Style",
        location: "Quartier des Arts",
        rating: 4.7,
        reviews: 180,
        image: "https://images.unsplash.com/photo-1521590832896-7ea20ade7336?w=800&q=80",
        description: "Moderne et branché. Les meilleures coupes pour hommes et femmes.",
        openHours: "09:00 - 21:00",
        services: [
            { name: 'Coupe Urbaine', price: 25, duration: '30 min' },
            { name: 'Design Barbe', price: 20, duration: '30 min' },
            { name: 'Décoloration / Flash', price: 55, duration: '90 min' },
            { name: 'Styling Express', price: 30, duration: '30 min' }
        ]
    },
    {
        id: 's3',
        name: "Natural Beauty Haven",
        location: "Banlieue Verte",
        rating: 4.8,
        reviews: 96,
        image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&q=80",
        description: "Produits 100% naturels pour le soin de vos cheveux texturés.",
        openHours: "09:00 - 18:00",
        services: [
            { name: 'Soin Hydratant Profond', price: 45, duration: '60 min' },
            { name: 'Coupe Cheveux Texturés', price: 40, duration: '50 min' },
            { name: 'Coiffure Protectrice', price: 60, duration: '120 min' },
            { name: 'Massage Crânien', price: 30, duration: '20 min' }
        ]
    },
    {
        id: 's4',
        name: "The Barber's Club",
        location: "Vieux Port",
        rating: 4.9,
        reviews: 310,
        image: "https://images.unsplash.com/photo-1503951914875-452162b7f304?w=800&q=80",
        description: "L'expérience barbier traditionnelle avec une touche moderne.",
        openHours: "08:00 - 20:00",
        services: [
            { name: 'Coupe Classique', price: 25, duration: '30 min' },
            { name: 'Rasage à l\'Ancienne', price: 30, duration: '40 min' },
            { name: 'Taille Barbe & Contours', price: 20, duration: '20 min' },
            { name: 'Formule Complète (Coupe+Barbe)', price: 45, duration: '60 min' }
        ]
    },
    {
        id: 's5',
        name: "Glamour Studio",
        location: "Centre Commercial",
        rating: 4.6,
        reviews: 150,
        image: "https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&q=80",
        description: "Pour vos événements spéciaux, mariages et soirées de gala.",
        openHours: "10:00 - 19:00",
        services: [
            { name: 'Chignon Mariée', price: 120, duration: '90 min' },
            { name: 'Maquillage Soirée', price: 60, duration: '45 min' },
            { name: 'Coiffure de Gala', price: 80, duration: '60 min' },
            { name: 'Essai Mariage', price: 50, duration: '60 min' }
        ]
    },
    {
        id: 's6',
        name: "Zen Hair Spa",
        location: "Quartier Résidentiel",
        rating: 4.8,
        reviews: 112,
        image: "https://images.unsplash.com/photo-1596462502278-27bfdd403348?w=800&q=80",
        description: "Détente absolue et soins capillaires régénérants.",
        openHours: "10:00 - 19:00",
        services: [
            { name: 'Rituel Zen (Soin + Massage)', price: 70, duration: '75 min' },
            { name: 'Coupe Énergétique', price: 45, duration: '50 min' },
            { name: 'Soin Détox Cuir Chevelu', price: 40, duration: '40 min' },
            { name: 'Brushing Relaxant', price: 35, duration: '30 min' }
        ]
    }
];

export const MOCK_PROVIDERS: Provider[] = [
    {
        id: 'p1',
        name: 'Studio Lumière',
        specialty: 'Mariage & Émotion',
        priceStart: '800',
        rating: 4.9,
        reviews: 124,
        image: 'https://images.unsplash.com/photo-1554048612-387768052bf7?w=800&q=80',
        description: 'Nous capturons l’essence de votre amour avec une touche cinématographique unique. Spécialistes des grands mariages.',
        packages: [
            { name: 'Cérémonie Essentielle', price: '800', description: 'Couverture de la cérémonie civile et religieuse (4h).' },
            { name: 'Journée Complète', price: '1500', description: 'Des préparatifs jusqu’à la pièce montée (12h).' },
            { name: 'Pack Cinéma Drone', price: '2000', description: 'Vidéo 4K avec prises de vue aériennes par drone.' }
        ]
    },
    {
        id: 'p2',
        name: 'Ahmed Vision',
        specialty: 'Corporate & Publicité',
        priceStart: '500',
        rating: 4.8,
        reviews: 89,
        image: 'https://images.unsplash.com/photo-1552642986-cca945d96e8e?w=800&q=80',
        description: 'Une approche dynamique pour vos événements d\'entreprise et vos clips promotionnels. Qualité 4K garantie.',
        packages: [
            { name: 'Clip Promo Réseaux', price: '500', description: 'Vidéo dynamique de 30-60 sec pour Instagram/TikTok.' },
            { name: 'Couverture Conférence', price: '1200', description: 'Demi-journée de tournage + montage résumé.' },
            { name: 'Interview Corporate', price: '800', description: 'Setup lumière pro, son haute qualité et montage.' }
        ]
    },
    {
        id: 'p3',
        name: 'Sarah Lens',
        specialty: 'Portraits & Mode',
        priceStart: '400',
        rating: 5.0,
        reviews: 65,
        image: 'https://images.unsplash.com/photo-1551184496-fa5f0fd9f921?w=800&q=80',
        description: 'L’art du portrait sublimé. Idéal pour book photo, anniversaires intimes et shootings mode.',
        packages: [
            { name: 'Shooting Solo', price: '200', description: '1h de séance en extérieur, 10 photos retouchées.' },
            { name: 'Book Mode Complet', price: '400', description: '3h de séance, 3 tenues, 30 photos HD.' },
            { name: 'Anniversaire Intime', price: '600', description: 'Reportage photo de votre soirée (4h).' }
        ]
    },
    {
        id: 'p4',
        name: 'Epic Frames',
        specialty: 'Événementiel & Sport',
        priceStart: '600',
        rating: 4.7,
        reviews: 210,
        image: 'https://images.unsplash.com/photo-1605647540924-852290f6b0d5?w=800&q=80',
        description: 'Pour les événements qui bougent. Une équipe réactive capable de capturer l\'action sous tous les angles.',
        packages: [
            { name: 'Aftermovie Event', price: '600', description: 'Vidéo récapitulative punchy de votre événement.' },
            { name: 'Live Streaming', price: '1000', description: 'Diffusion en direct multi-caméra sur internet.' },
            { name: 'Pack Sport', price: '500', description: 'Photos et vidéos d\'action pour athlètes.' }
        ]
    },
    {
        id: 'p5',
        name: 'Prestige Productions',
        specialty: 'Luxe & VIP',
        priceStart: '1500',
        rating: 4.9,
        reviews: 42,
        image: 'https://images.unsplash.com/photo-1537639622086-73570d4564bd?w=800&q=80',
        description: 'Service haut de gamme pour une clientèle exigeante. Discrétion et rendu hollywoodien.',
        packages: [
            { name: 'Wedding Luxury', price: '3500', description: 'Équipe de 3 vidéastes, drone, montage same-day edit.' },
            { name: 'Documentaire VIP', price: '2500', description: 'Suivi style documentaire pour personnalités.' },
            { name: 'Publicité TV', price: '5000', description: 'Production complète de spot publicitaire haut de gamme.' }
        ]
    },
];


export const MOCK_BOOKINGS: Booking[] = [
    {
        id: 'b1',
        userId: 'u1',
        serviceType: 'hall',
        serviceId: 'h2',
        serviceName: 'Ayla Hotel',
        hallId: 'h2',
        date: '2024-09-15',
        startTime: '16:00',
        endTime: '22:00',
        totalPrice: 2100,
        status: 'Confirmed',
        paymentMethod: PaymentWallet.WAAFI,
        transactionId: 'T123456789',
        notes: 'Cérémonie Coucher de Soleil'
    },
    {
        id: 'b2',
        userId: 'u1',
        serviceType: 'hall',
        serviceId: 'h1',
        serviceName: 'City Hall',
        hallId: 'h1',
        date: '2024-10-20',
        startTime: '18:00',
        endTime: '23:00',
        totalPrice: 2500,
        status: 'Completed',
        paymentMethod: PaymentWallet.DMONEY,
        transactionId: 'T987654321',
        notes: 'Soirée Mariage'
    },
    {
        id: 'b3',
        userId: 'u1',
        serviceType: 'hall',
        serviceId: 'h3',
        serviceName: 'Kimpenski',
        hallId: 'h3',
        date: '2024-08-25',
        startTime: '10:00',
        endTime: '14:00',
        totalPrice: 800,
        status: 'Pending Confirmation',
        paymentMethod: PaymentWallet.CACPAY,
        transactionId: 'T543216789',
        notes: 'Vernissage Art'
    },
];

export const PAYMENT_WALLETS = [
    { id: PaymentWallet.WAAFI, name: 'Waafi', logo: 'https://via.placeholder.com/100x40.png?text=Waafi' },
    { id: PaymentWallet.DMONEY, name: 'D-Money', logo: 'https://via.placeholder.com/100x40.png?text=D-Money' },
    { id: PaymentWallet.CACPAY, name: 'CAC Pay', logo: 'https://via.placeholder.com/100x40.png?text=CAC+Pay' },
    { id: PaymentWallet.EXIMPAY, name: 'Exim Pay', logo: 'https://via.placeholder.com/100x40.png?text=Exim+Pay' },
];
