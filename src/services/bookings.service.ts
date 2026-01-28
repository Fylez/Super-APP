import { supabase } from '../lib/supabase';

export interface CreateBookingParams {
  activity_name: string;
  court_name: string;
  date: string;
  start_time: string;
  end_time: string;
  image: string;
}

export const bookingsService = {
  async getUserBookings(userId: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'CONFIRMED')
      .gte('date', new Date().toISOString().split('T')[0])
      .order('date', { ascending: true })
      .order('start_time', { ascending: true });

    if (error) throw error;
    return data || [];
  },

  async createBooking(userId: string, params: CreateBookingParams) {
    const qrData = `AccessKey-${params.activity_name}-${Date.now()}`;
    const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrData)}`;

    const { data, error } = await supabase
      .from('bookings')
      .insert({
        user_id: userId,
        activity_name: params.activity_name,
        court_name: params.court_name,
        date: params.date,
        start_time: params.start_time,
        end_time: params.end_time,
        status: 'CONFIRMED',
        qr_code: qrCodeUrl,
        image: params.image,
      })
      .select()
      .single();

    if (error) {
      if (error.message.includes('Límite diario excedido')) {
        throw new Error('Has alcanzado el límite de 2 horas por día');
      }
      throw error;
    }

    return data;
  },

  async cancelBooking(bookingId: string) {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'CANCELLED' })
      .eq('id', bookingId);

    if (error) throw error;
  },

  async checkAvailability(date: string, court: string, startTime: string, endTime: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('date', date)
      .eq('court_name', court)
      .eq('status', 'CONFIRMED')
      .or(`start_time.lte.${startTime},end_time.gte.${endTime}`);

    if (error) throw error;
    return data && data.length === 0;
  },

  async getDailyHours(userId: string, date: string) {
    const { data, error } = await supabase
      .from('bookings')
      .select('start_time, end_time')
      .eq('user_id', userId)
      .eq('date', date)
      .eq('status', 'CONFIRMED');

    if (error) throw error;

    if (!data || data.length === 0) return 0;

    const totalMinutes = data.reduce((acc, booking) => {
      const start = booking.start_time.split(':').map(Number);
      const end = booking.end_time.split(':').map(Number);
      const startMinutes = start[0] * 60 + start[1];
      const endMinutes = end[0] * 60 + end[1];
      return acc + (endMinutes - startMinutes);
    }, 0);

    return totalMinutes / 60;
  },
};
