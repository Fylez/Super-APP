export type Language = 'ES' | 'EN';

export type AuthStep = 'COMMUNITY_CODE' | 'AUTH' | 'APP';

export interface Community {
  id: string;
  name: string;
  code: string;
  logoUrl?: string; // Optional URL for community logo
  backgroundImage?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  handle: string;
  avatarUrl: string;
}

export interface WeatherData {
  temp: number;
  windSpeed: number;
  condition: 'SUNNY' | 'CLOUDY' | 'RAIN';
}

export interface Notice {
  id: string;
  title: string;
  description: string;
  month: string;
  day: string;
  fullDate: string; // ISO String YYYY-MM-DD for expiration logic
  type: 'INFO' | 'ALERT' | 'EVENT';
}

export interface Match {
  id: string;
  sport: string; // e.g., 'Padel'
  level: string; // e.g., 'Intermediate'
  hostName: string;
  hostAvatar: string;
  time: string;
  spotsLeft: number;
  isMine?: boolean; // Helper for UI to allow delete
}

export interface Service {
  id: string;
  name: string;
  description: string;
  iconName: 'CAR' | 'CHEF' | 'COACH';
  bgGradient: string;
}

export interface Activity {
  id: string;
  name: string;
  subtext: string;
  image: string;
  type: 'PADEL' | 'TENNIS' | 'GYM';
}

export type SlotStatus = 'AVAILABLE' | 'BOOKED' | 'MAINTENANCE';

export interface TimeSlot {
  id: string;
  startTime: string; // e.g. "09:00"
  status: SlotStatus;
  bookedBy?: string; // e.g. "Carlos R."
  price?: number;
}

export interface Booking {
  id: string;
  activityName: string; // e.g. Padel
  courtName: string; // e.g. Pista 2
  date: string; // ISO String
  time: string; // e.g. 10:00 - 11:00
  image: string;
  qrCode: string;
  status: 'CONFIRMED' | 'CANCELLED';
}

export interface Incident {
  id: string;
  zone: string;
  description: string;
  status: 'PENDING' | 'RESOLVED';
  date: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string; // "15 Ago"
  time: string; // "19:00"
  location: string;
  description: string;
  attendees: number;
  isAttending: boolean;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number; // positive or negative
  date: string;
  type: 'PAYMENT' | 'TOPUP';
}

export interface GuestKeyPermissions {
  canOpenDoors: boolean;
  canBookSports: boolean;
}

export interface GuestKey {
  id: string;
  guestName: string;
  startDate: string; // ISO YYYY-MM-DD
  endDate: string;   // ISO YYYY-MM-DD
  status: 'ACTIVE' | 'REVOKED' | 'EXPIRED';
  link: string;
  permissions: GuestKeyPermissions;
}