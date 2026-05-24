
import { useContext } from 'react';
import { AppContext } from '../contexts/AppContext';

export const languages: Record<string, string> = {
    'Français': 'fr',
    'Arabe': 'ar',
    'Afar': 'aa',
    'Somali': 'so',
};

const allTranslations = {
    // General
    close: { fr: 'Fermer', ar: 'إغلاق', aa: 'Xidh', so: 'Xidh' },
    // Header
    hallReserve: { fr: 'Hallify', ar: 'Hallify', aa: 'Hallify', so: 'Hallify' },
    browseHalls: { fr: 'Parcourir les Salles', ar: 'تصفح القاعات', aa: 'Hoolal Eeg', so: 'Daawo Hoolalka' },
    salon: { fr: 'Coiffure & Beauté', ar: 'صالون تجميل', aa: 'Salon', so: 'Saloon' },
    cameraman: { fr: 'Caméraman', ar: 'مصور فيديو', aa: 'Kaamirada', so: 'Duube' },
    dashboard: { fr: 'Tableau de bord', ar: 'لوحة التحكم', aa: 'Dashboard', so: 'Guddiga' },
    welcome: { fr: 'Bienvenue,', ar: 'أهلاً بك،', aa: 'Soo Dhawow,', so: 'Soo Dhawow,' },
    logout: { fr: 'Déconnexion', ar: 'تسجيل الخروج', aa: 'Ka Bax', so: 'Ka Bax' },
    login: { fr: 'Connexion', ar: 'تسجيل الدخول', aa: 'Soo Gal', so: 'Soo Gal' },
    signUp: { fr: 'Inscription', ar: 'التسجيل', aa: 'Is-diiwaangeli', so: 'Is-diiwaangeli' },
    // HallListingPage
    findYourPerfectVenue: { fr: 'Trouvez Votre Lieu Idéal', ar: 'ابحث عن مكانك المثالي', aa: 'Hel Goobtaada Gaarka ah', so: 'Hel Goobtaada Ku Haboon' },
    browseExclusiveCollection: { fr: 'Parcourez notre collection exclusive de lieux et trouvez le cadre idéal pour votre journée spéciale. Utilisez les filtres ci-dessous pour affiner votre recherche.', ar: 'تصفح مجموعتنا الحصرية من الأماكن وابحث عن الخلفية المثالية ليومك الخاص. استخدم الفلاتر أدناه لتضييق نطاق البحث.', aa: 'Eeg ururintayada gaarka ah ee goobaha oo hel meesha ku habboon maalintaada gaarka ah. Adeegso filtarrada hoose si aad u yareeyso raadintaada.', so: 'Daawo ururintayada gaarka ah ee goobaha oo hel meesha ugu habboon maalintaada khaaska ah. Isticmaal filtarrada hoose si aad u xulato raadintaada.' },
    searchByLocation: { fr: 'Rechercher par lieu...', ar: 'البحث حسب الموقع...', aa: 'Goobta ku Raadi...', so: 'Goob ku Raadi...' },
    minCapacity: { fr: 'Capacité minimale', ar: 'الحد الأدنى للسعة', aa: 'Awoodda Ugu Yar', so: 'Awoodda Ugu Yar' },
    maxPricePerHour: { fr: 'Prix max par heure', ar: 'السعر الأقصى للساعة', aa: 'Qiimaha Ugu Badan Saacaddii', so: 'Qiimaha Saacaddii Ugu Badan' },
    // HallCard
    bookNow: { fr: 'Réserver Maintenant', ar: 'احجز الآن', aa: 'Hadda Boos Qabso', so: 'Hadda Ballanso' },
    guests: { fr: 'invités', ar: 'ضيوف', aa: 'martida', so: 'martida' },
    upTo: { fr: 'Jusqu\'à', ar: 'حتى', aa: 'Ilaa', so: 'Ilaa' },
    perHour: { fr: '/heure', ar: '/ساعة', aa: '/saacaddii', so: '/saacaddii' },
    loginToBook: { fr: 'Veuillez vous connecter en tant qu\'utilisateur pour réserver', ar: 'يرجى تسجيل الدخول كمستخدم للحجز', aa: 'Fadlan soo gal si aad u ballansato', so: 'Fadlan soo gal si aad u ballansato' },
    loginToBookAction: { fr: 'Connectez-vous pour réserver', ar: 'سجل الدخول للحجز', aa: 'Soo gal si aad u ballansato', so: 'Soo gal si aad u ballansato' },
    bookThisHall: { fr: 'Réserver cette salle', ar: 'احجز هذه القاعة', aa: 'Hoolkan Ballanso', so: 'Hoolkan Ballanso' },
    // AuthModal
    userAuth: { fr: 'Authentification Utilisateur', ar: 'توثيق المستخدم', aa: 'Xaqiijinta Isticmaalaha', so: 'Xaqiijinta Isticmaalaha' },
    fullName: { fr: 'Nom complet', ar: 'الاسم الكامل', aa: 'Magaca oo Dhamaystiran', so: 'Magaca oo Dhamaystiran' },
    email: { fr: 'Email', ar: 'البريد الإلكتروني', aa: 'Email', so: 'Email' },
    password: { fr: 'Mot de passe', ar: 'كلمة المرور', aa: 'Furaha', so: 'Furaha' },
    createAccount: { fr: 'Créer un compte', ar: 'إنشاء حساب', aa: 'Samee Koonto', so: 'Abuur Akoon' },
    invalidCredentials: { fr: 'Email ou mot de passe invalide.', ar: 'البريد الإلكتروني أو كلمة المرور غير صالحة.', aa: 'Email ama furaha sirta ah oo khaldan.', so: 'Email ama erayga sirta ah oo khaldan.' },
    allFieldsRequired: { fr: 'Tous les champs sont requis.', ar: 'جميع الحقول مطلوبة.', aa: 'Dhammaan meelaha waa loo baahan yahay.', so: 'Dhammaan meelaha waa loo baahan yahay.' },
    emailExists: { fr: 'L\'email existe déjà.', ar: 'البريد الإلكتروني موجود بالفعل.', aa: 'Email-kan horey ayuu u jiray.', so: 'Email-kan horey ayuu u jiray.' },
    registrationSuccess: { fr: 'Inscription réussie ! Veuillez vous connecter.', ar: 'تم التسجيل بنجاح! يرجى تسجيل الدخول.', aa: 'Diiwaangelintu way guulaysatay! Fadlan soo gal.', so: 'Diiwaangelintu way guulaysatay! Fadlan soo gal.' },
    // Booking Modal
    book: { fr: 'Réserver :', ar: 'حجز :', aa: 'Ballanso :', so: 'Ballanso :' },
    date: { fr: 'Date', ar: 'التاريخ', aa: 'Taariikh', so: 'Taariikh' },
    startTime: { fr: 'Heure de début', ar: 'وقت البدء', aa: 'Waqtiga Bilowga', so: 'Waqtiga Bilowga' },
    endTime: { fr: 'Heure de fin', ar: 'وقت الانتهاء', aa: 'Waqtiga Dhamaadka', so: 'Waqtiga Dhamaadka' },
    totalDuration: { fr: 'Durée totale :', ar: 'المدة الإجمالية :', aa: 'Wadarta Muddada :', so: 'Wadarta Muddada :' },
    hours: { fr: 'heures', ar: 'ساعات', aa: 'saacadood', so: 'saacadood' },
    totalPrice: { fr: 'Prix total :', ar: 'السعر الإجمالي :', aa: 'Qiimaha Guud :', so: 'Qiimaha Guud :' },
    proceedToPayment: { fr: 'Passer au paiement', ar: 'الانتقال إلى الدفع', aa: 'U gudub Bixinta', so: 'U gudub Bixinta' },
    selectPaymentMethod: { fr: 'Sélectionnez le mode de paiement', ar: 'اختر طريقة الدفع', aa: 'Dooro Qaabka Bixinta', so: 'Dooro Habka Bixinta' },
    bookingSummary: { fr: 'Résumé de la réservation', ar: 'ملخص الحجز', aa: 'Soo Koobid Ballan', so: 'Soo Koobid Ballan' },
    time: { fr: 'Heure :', ar: 'الوقت :', aa: 'Waqti :', so: 'Waqti :' },
    total: { fr: 'Total :', ar: 'المجموع :', aa: 'Wadar :', so: 'Wadar :' },
    payNow: { fr: 'Payer maintenant', ar: 'ادفع الآن', aa: 'Hadda Bixi', so: 'Hadda Bixi' },
    backToSelection: { fr: 'Retour à la sélection', ar: 'العودة إلى الاختيار', aa: 'Ku Laabo Xulashada', so: 'Ku Laabo Xulashada' },
    processingPayment: { fr: 'Traitement du paiement...', ar: 'جاري معالجة الدفع...', aa: 'Bixinta waa socotaa...', so: 'Bixinta waa la baarayaa...' },
    pleaseWait: { fr: 'Veuillez patienter, nous traitons votre transaction en toute sécurité.', ar: 'يرجى الانتظار، نحن نعالج معاملتك بأمان.', aa: 'Fadlan sug, si ammaan ah ayaan u habaynaynaa macaamilkaaga.', so: 'Fadlan sug, waxaan si nabadgelyo ah u socodsiineynaa macaamilkaaga.' },
    bookingRequestSent: { fr: 'Demande de réservation envoyée !', ar: 'تم إرسال طلب الحجز!', aa: 'Codsiga Ballanta waa la diray!', so: 'Codsiga Ballanta waa la diray!' },
    bookingPendingConfirmation: { fr: 'Votre réservation est en attente de confirmation par l\'administrateur de la salle. Vous recevrez une notification une fois qu\'elle sera confirmée.', ar: 'حجزك في انتظار التأكيد من مسؤول القاعة. ستتلقى إشعارًا بمجرد تأكيده.', aa: 'Ballantaada waxay sugaysaa xaqiijin ka timid maamulaha hoolka. Waxaad heli doontaa ogeysiis marka la xaqiijiyo.', so: 'Ballantaada waxay sugaysaa xaqiijin ka timid maamulaha hoolka. Waxaad heli doontaa ogeysiis marka la xaqiijiyo.' },
    checkDashboard: { fr: 'Consultez votre tableau de bord pour les mises à jour.', ar: 'تحقق من لوحة التحكم الخاصة بك للحصول على التحديثات.', aa: 'Ka eeg dashboardkaaga wixii cusub.', so: 'Ka eeg dashboardkaaga wixii cusub.' },
    welcomeBack: { fr: "Content de vous revoir, {name}. Voici votre aperçu.", ar: "مرحبًا بعودتك، {name}. إليك نظرة عامة.", aa: "Soo laabasho wacan, {name}. Halkan waxaa ah dulmarkaaga.", so: "Soo laabasho wacan, {name}. Waa kan guudmarkaaga." },
    // Payment Additions
    confirmAndPay: { fr: "Confirmer et Payer", ar: "تأكيد ودفع", aa: "Xaqiiji oo Bixi", so: "Xaqiiji oo Bixi" },
    paymentSuccessful: { fr: "Paiement Réussi !", ar: "تم الدفع بنجاح!", aa: "Lacag-bixintu way guulaysatay!", so: "Lacag-bixintu way guulaysatay!" },
    makeAnotherBooking: { fr: "Faire une autre réservation", ar: "إجراء حجز آخر", aa: "Samee ballan kale", so: "Samee ballan kale" },

};

export type TranslationKey = keyof typeof allTranslations;

export function useTranslations() {
    const context = useContext(AppContext);
    const lang = context?.language || 'Français';
    const langCode = languages[lang] || 'fr';

    const t = (key: TranslationKey, params?: Record<string, string>): string => {
        const translation = allTranslations[key];
        if (!translation) {
            console.warn(`Translation key "${key}" not found.`);
            return key;
        }
        let text = translation[langCode] || translation['fr'];
        if (params) {
            Object.keys(params).forEach(pKey => {
                text = text.replace(`{${pKey}}`, params[pKey]);
            });
        }
        return text;
    };

    return { t };
}
