import { db, isFirebaseConfigured } from '../lib/firebase';
import { collection, addDoc, getDocs, doc, updateDoc, query, where } from 'firebase/firestore';
import { Appointment, AppointmentStatus } from '../types';

const APPOINTMENTS_COLLECTION = 'appointments';
const LOCAL_STORAGE_KEY = 'smilefree_appointments_backup';

// --- LOCAL STORAGE HELPERS (Fallback) ---
const getLocalAppointments = (): Appointment[] => {
  try {
    const data = localStorage.getItem(LOCAL_STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    return [];
  }
};

const saveLocalAppointment = (appt: Appointment) => {
  const current = getLocalAppointments();
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([...current, appt]));
};

const updateLocalStatus = (id: string, status: AppointmentStatus) => {
  const current = getLocalAppointments();
  const updated = current.map(a => a.id === id ? { ...a, status } : a);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
};

// --- MAIN EXPORTS ---

// Fetch all appointments
export const getAppointments = async (): Promise<Appointment[]> => {
  // 1. Live Mode
  if (isFirebaseConfigured && db) {
    try {
      const querySnapshot = await getDocs(collection(db, APPOINTMENTS_COLLECTION));
      const appointments: Appointment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Omit<Appointment, 'id'>;
        appointments.push({ id: doc.id, ...data });
      });
      return appointments;
    } catch (error) {
      console.error("Error fetching from Firebase:", error);
      return [];
    }
  } 
  
  // 2. Demo Mode
  return new Promise((resolve) => {
    setTimeout(() => resolve(getLocalAppointments()), 500); // Simulate network delay
  });
};

// Save a new appointment
export const saveAppointment = async (appointmentData: Omit<Appointment, 'id'>): Promise<string> => {
  // 1. Live Mode
  if (isFirebaseConfigured && db) {
    try {
      const docRef = await addDoc(collection(db, APPOINTMENTS_COLLECTION), appointmentData);
      return docRef.id;
    } catch (error) {
      console.error("Error saving to Firebase:", error);
      throw error;
    }
  }

  // 2. Demo Mode
  return new Promise((resolve) => {
    const newId = 'local-' + Math.random().toString(36).substr(2, 9);
    const newAppt: Appointment = { id: newId, ...appointmentData };
    saveLocalAppointment(newAppt);
    setTimeout(() => resolve(newId), 500);
  });
};

// Update status
export const updateAppointmentStatus = async (id: string, status: AppointmentStatus): Promise<void> => {
  // 1. Live Mode
  if (isFirebaseConfigured && db) {
    try {
      const appointmentRef = doc(db, APPOINTMENTS_COLLECTION, id);
      await updateDoc(appointmentRef, { status: status });
      return;
    } catch (error) {
      console.error("Error updating in Firebase:", error);
      throw error;
    }
  }

  // 2. Demo Mode
  return new Promise((resolve) => {
    updateLocalStatus(id, status);
    setTimeout(() => resolve(), 300);
  });
};

// Get available slots
export const getAvailableSlots = async (date: string): Promise<string[]> => {
  const allSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', 
    '11:00 AM', '11:30 AM', '02:00 PM', '02:30 PM', 
    '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM'
  ];

  // 1. Live Mode
  if (isFirebaseConfigured && db) {
    try {
      const q = query(
        collection(db, APPOINTMENTS_COLLECTION), 
        where("date", "==", date)
      );
      const querySnapshot = await getDocs(q);
      
      const takenSlots: string[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data() as Appointment;
        if (data.status !== AppointmentStatus.CANCELLED) {
          takenSlots.push(data.timeSlot);
        }
      });
      return allSlots.filter(slot => !takenSlots.includes(slot));
    } catch (error) {
      console.error("Firebase slot error, falling back", error);
    }
  }

  // 2. Demo Mode
  return new Promise((resolve) => {
    const appointments = getLocalAppointments();
    const taken = appointments
      .filter(a => a.date === date && a.status !== AppointmentStatus.CANCELLED)
      .map(a => a.timeSlot);
    
    setTimeout(() => resolve(allSlots.filter(s => !taken.includes(s))), 400);
  });
};