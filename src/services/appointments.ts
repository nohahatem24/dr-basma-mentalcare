import { createClient } from '@supabase/supabase-js';
import { TimeSlot, Appointment, DoctorStatus } from '../types/appointment';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const appointmentService = {
  async getAvailableTimeSlots(doctorId: string, date: Date) {
    try {
      const { data, error } = await supabase
        .from('time_slots')
        .select('*')
        .eq('doctor_id', doctorId)
        .gte('start_time', date.toISOString())
        .lte('start_time', new Date(date.setDate(date.getDate() + 7)).toISOString())
        .eq('is_available', true);

      if (error) throw error;
      return data as TimeSlot[];
    } catch (error) {
      console.error('Error in getAvailableTimeSlots:', error);
      throw error;
    }
  },

  async createAppointment(appointment: Omit<Appointment, 'id'>) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .insert([appointment])
        .select()
        .single();

      if (error) throw error;

      // Update time slot availability
      await supabase
        .from('time_slots')
        .update({ is_available: false })
        .eq('id', appointment.timeSlotId);

      return data as Appointment;
    } catch (error) {
      console.error('Error in createAppointment:', error);
      throw error;
    }
  },

  async getDoctorStatus(doctorId: string) {
    try {
      const { data, error } = await supabase
        .from('doctor_status')
        .select('*')
        .eq('doctor_id', doctorId)
        .single();

      if (error) throw error;
      return data as DoctorStatus;
    } catch (error) {
      console.error('Error in getDoctorStatus:', error);
      throw error;
    }
  },

  async updateDoctorStatus(doctorId: string, status: Partial<DoctorStatus>) {
    try {
      const { data, error } = await supabase
        .from('doctor_status')
        .update(status)
        .eq('doctor_id', doctorId)
        .select()
        .single();

      if (error) throw error;
      return data as DoctorStatus;
    } catch (error) {
      console.error('Error in updateDoctorStatus:', error);
      throw error;
    }
  },

  async getPatientAppointments(patientId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .eq('patient_id', patientId)
        .order('start_time', { ascending: false });

      if (error) throw error;
      return data as Appointment[];
    } catch (error) {
      console.error('Error in getPatientAppointments:', error);
      throw error;
    }
  },

  async cancelAppointment(appointmentId: string) {
    try {
      const { data, error } = await supabase
        .from('appointments')
        .update({ status: 'cancelled' })
        .eq('id', appointmentId)
        .select()
        .single();

      if (error) throw error;

      // Make time slot available again
      await supabase
        .from('time_slots')
        .update({ is_available: true })
        .eq('id', data.timeSlotId);

      return data as Appointment;
    } catch (error) {
      console.error('Error in cancelAppointment:', error);
      throw error;
    }
  },
}; 