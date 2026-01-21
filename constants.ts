import { Community, User, WeatherData, Match, Service, Notice, Activity, TimeSlot, Booking, Incident, CommunityEvent, Transaction, GuestKey } from './types';

export const MOCK_COMMUNITIES: Record<string, Community> = {
  'sierra-blanca': {
    id: 'sb-001',
    name: 'Sierra Blanca Estates',
    code: 'sierra-blanca',
    backgroundImage: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format&fit=crop', // Luxury Villa
  },
  'la-zagaleta': {
    id: 'lz-002',
    name: 'La Zagaleta',
    code: 'la-zagaleta',
    backgroundImage: 'https://images.unsplash.com/photo-1600596542815-6ad4c728fd78?q=80&w=2054&auto=format&fit=crop', // Another Luxury Villa
  },
};

export const DEFAULT_BG = 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop';

export const MOCK_USER: User = {
  id: 'u-123',
  email: 'alex@example.com',
  name: 'Alex Rivera',
  handle: '@arivera',
  avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1887&auto=format&fit=crop',
};

export const MOCK_WEATHER: WeatherData = {
  temp: 24,
  windSpeed: 12,
  condition: 'SUNNY',
};

// Dates set in the future to ensure they appear in the demo
export const MOCK_NOTICES: Notice[] = [
  {
    id: 'n-alert-pool',
    type: 'ALERT',
    title: 'Piscina Fuera de Servicio',
    description: 'Mantenimiento de urgencia en bombas de agua. Disculpen las molestias.',
    month: 'FEB',
    day: '28',
    fullDate: '2026-02-28',
  },
  {
    id: 'n-1',
    type: 'EVENT',
    title: 'Gala Anual',
    description: 'Cóctel anual en la casa club para todos los propietarios. Dress code: Formal.',
    month: 'DIC',
    day: '24',
    fullDate: '2025-12-24', 
  },
  {
    id: 'n-4',
    type: 'ALERT',
    title: 'Corte de Agua',
    description: 'Interrupción programada por mantenimiento de tubería principal. 10:00 AM - 14:00 PM.',
    month: 'DIC',
    day: '28',
    fullDate: '2025-12-28',
  },
  {
    id: 'n-2',
    type: 'ALERT',
    title: 'Mantenimiento Piscina',
    description: 'Piscina Infinity cerrada hasta las 14:00 por tratamiento químico.',
    month: 'ENE',
    day: '15',
    fullDate: '2026-01-15',
  },
  {
    id: 'n-5',
    type: 'EVENT',
    title: 'Torneo Padel',
    description: 'Inscripciones abiertas para el torneo de invierno. Parejas mixtas.',
    month: 'ENE',
    day: '20',
    fullDate: '2026-01-20',
  },
  {
    id: 'n-3',
    type: 'INFO',
    title: 'Nuevo Instructor',
    description: 'Bienvenida a Rafael G., nuevo head coach del equipo de tenis.',
    month: 'FEB',
    day: '01',
    fullDate: '2026-02-01',
  },
  {
    id: 'n-6',
    type: 'EVENT',
    title: 'Sunday Brunch',
    description: 'Música en vivo y menú degustación del Chef Marco en la terraza.',
    month: 'FEB',
    day: '14',
    fullDate: '2026-02-14',
  }
];

export const MOCK_MATCHES: Match[] = [
  {
    id: 'm-1',
    sport: 'Padel',
    level: 'Nivel 4.5',
    hostName: 'Carlos M.',
    hostAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=1887&auto=format&fit=crop',
    time: '18:30 Today',
    spotsLeft: 1,
    isMine: false,
  },
  {
    id: 'm-2',
    sport: 'Tennis',
    level: 'Pro',
    hostName: 'Sarah J.',
    hostAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=1887&auto=format&fit=crop',
    time: '09:00 Tomorrow',
    spotsLeft: 1,
    isMine: false,
  }
];

export const MOCK_SERVICES: Service[] = [
  {
    id: 's-1',
    name: 'Uber Priority',
    description: 'Gate 4 Pickup',
    iconName: 'CAR',
    bgGradient: 'bg-zinc-900',
  },
  {
    id: 's-2',
    name: 'Private Chef',
    description: 'Michelin Exp.',
    iconName: 'CHEF',
    bgGradient: 'bg-orange-900',
  },
  {
    id: 's-3',
    name: 'Tennis Coach',
    description: 'ATP Certified',
    iconName: 'COACH',
    bgGradient: 'bg-indigo-900',
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'act-1',
    name: 'Padel',
    subtext: '4 Pistas Disponibles',
    type: 'PADEL',
    // Updated Image: Imgur direct link for Padel
    image: 'https://i.imgur.com/LOSvoYW.jpeg',
  },
  {
    id: 'act-2',
    name: 'Tenis',
    subtext: '4 Pistas Disponibles',
    type: 'TENNIS',
    // Updated Image: Imgur direct link for Tennis
    image: 'https://i.imgur.com/k4bfaq8.jpeg',
  },
  {
    id: 'act-3',
    name: 'Gimnasio',
    subtext: 'Acceso QR Directo',
    type: 'GYM',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop',
  }
];

export const MOCK_SLOTS: TimeSlot[] = [
  { id: 't1', startTime: '08:00', status: 'AVAILABLE' },
  { id: 't2', startTime: '09:00', status: 'AVAILABLE' },
  { id: 't3', startTime: '10:00', status: 'BOOKED', bookedBy: 'Carlos R.' },
  { id: 't4', startTime: '11:00', status: 'AVAILABLE' },
  { id: 't5', startTime: '12:00', status: 'MAINTENANCE' },
  { id: 't6', startTime: '13:00', status: 'AVAILABLE' },
  { id: 't7', startTime: '16:00', status: 'AVAILABLE' },
  { id: 't8', startTime: '17:00', status: 'BOOKED', bookedBy: 'Ana M.' },
  { id: 't9', startTime: '18:00', status: 'AVAILABLE' },
  { id: 't10', startTime: '19:00', status: 'AVAILABLE' },
  { id: 't11', startTime: '20:00', status: 'AVAILABLE' },
];

export const MOCK_USER_BOOKINGS: Booking[] = [
  {
    id: 'b-001',
    activityName: 'Padel',
    courtName: 'Pista 3',
    date: '2025-02-22', // Example future date
    time: '18:00 - 19:30',
    // Consistent with Activity Image
    image: 'https://i.imgur.com/LOSvoYW.jpeg',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AccessKey-Padel-001',
    status: 'CONFIRMED'
  },
  {
    id: 'b-002',
    activityName: 'Tenis',
    courtName: 'Pista Central',
    date: '2025-02-24',
    time: '09:00 - 10:00',
    // Consistent with Activity Image
    image: 'https://i.imgur.com/k4bfaq8.jpeg',
    qrCode: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=AccessKey-Tenis-002',
    status: 'CONFIRMED'
  }
];

export const MOCK_INCIDENTS: Incident[] = [
  {
    id: 'inc-1',
    zone: 'Garaje Bloque 2',
    description: 'Luz parpadeando en la plaza 45.',
    status: 'RESOLVED',
    date: '20 Oct',
  },
  {
    id: 'inc-2',
    zone: 'Piscina Infinity',
    description: 'Falta una toalla en la tumbona 3.',
    status: 'PENDING',
    date: 'Hoy',
  }
];

export const MOCK_EVENTS: CommunityEvent[] = [
  {
    id: 'ev-1',
    title: 'Fiesta de Verano',
    date: '15 Ago',
    time: '20:00',
    location: 'Casa Club',
    description: 'Música en vivo, catering y cócteles para celebrar el solsticio.',
    attendees: 42,
    isAttending: false,
  },
  {
    id: 'ev-2',
    title: 'Clase Fútbol Infantil',
    date: 'Sábados',
    time: '10:00',
    location: 'Campo de Fútbol',
    description: 'Entrenamiento profesional para niños de 6 a 12 años.',
    attendees: 12,
    isAttending: true,
  }
];

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 't1', title: 'Recarga de Saldo', amount: 20.00, date: '18 Ene', type: 'TOPUP' },
  { id: 't2', title: 'Reserva Padel Pista 1', amount: -4.00, date: 'Ayer', type: 'PAYMENT' },
  { id: 't3', title: 'Servicio Limpieza', amount: -15.00, date: '15 Ene', type: 'PAYMENT' },
  { id: 't4', title: 'Recarga Automática', amount: 50.00, date: '10 Ene', type: 'TOPUP' },
];

export const MOCK_GUEST_KEYS: GuestKey[] = [
  {
    id: 'k-1',
    guestName: 'Familia Johnson (Airbnb)',
    startDate: '2025-10-12',
    endDate: '2025-10-15',
    status: 'ACTIVE',
    link: 'https://accesskey.app/guest/8823h',
    permissions: {
      canOpenDoors: true,
      canBookSports: true,
    }
  },
  {
    id: 'k-2',
    guestName: 'Mantenimiento AC',
    startDate: '2025-09-01',
    endDate: '2025-09-01',
    status: 'REVOKED',
    link: 'https://accesskey.app/guest/9912x',
    permissions: {
      canOpenDoors: true,
      canBookSports: false,
    }
  }
];