import { Appointment } from '../types';

// In a real app, this would call a backend endpoint (Node/Firebase) 
// which would then use SendGrid/Nodemailer/Gmail API.
export const sendEmailNotification = async (
  to: string, 
  subject: string, 
  body: string
): Promise<boolean> => {
  console.log(`%c[EMAIL SERVICE] Sending to: ${to}`, 'color: cyan; font-weight: bold;');
  console.log(`Subject: ${subject}`);
  console.log(`Body: ${body}`);
  
  // Simulate network delay
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 1000);
  });
};

export const notifyDoctorNewBooking = async (appt: Appointment) => {
  await sendEmailNotification(
    'vidulexams2@gmail.com',
    `New Booking: ${appt.patient.name}`,
    `SmileFree Appointment System\n\nPatient: ${appt.patient.name}\nPhone: ${appt.patient.phone}\nDate: ${appt.date}\nTime: ${appt.timeSlot}\n`
  );
};

export const notifyPatientStatusChange = async (appt: Appointment, status: string) => {
  const messages: Record<string, string> = {
    'CONFIRMED': `Dear ${appt.patient.name},\n\nYour appointment with Dr. Chandima Weerasekera (SmileFree) is CONFIRMED.\n\nDate: ${appt.date}\nTime: ${appt.timeSlot}\nLocation: 376/A/2, Meewathura, Peradeniya.\n\nPlease arrive 10 minutes early.`,
    'CANCELLED': `Dear ${appt.patient.name},\n\nWe regret to inform you that your appointment request for ${appt.date} could not be accommodated. Please contact the clinic at +94 11 234 5678 to reschedule.`
  };
  
  if (messages[status]) {
    await sendEmailNotification(
      appt.patient.email,
      `Appointment Update - SmileFree Orthodontics`,
      messages[status]
    );
  }
};