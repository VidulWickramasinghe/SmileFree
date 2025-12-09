import { send } from '@emailjs/browser';
import { Appointment } from '../types';

// ==============================================================================
// EMAIL CONFIGURATION (REGISTER ON EMAILJS.COM)
// ==============================================================================
const Config = {
  SERVICE_ID: 'YOUR_SERVICE_ID',   // Example: 'service_8x9032'
  TEMPLATE_ID: 'YOUR_TEMPLATE_ID', // Example: 'template_09432'
  PUBLIC_KEY: 'YOUR_PUBLIC_KEY'    // Example: 'user_98s7df897'
};

const DOCTOR_EMAIL = 'vidulexams2@gmail.com';

export const notifyDoctorNewBooking = async (appt: Appointment) => {
  if (Config.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') {
    console.warn("EMAIL NOT SENT: EmailJS keys not configured in services/email.ts");
    return;
  }

  try {
    const templateParams = {
      to_email: DOCTOR_EMAIL,
      subject: `New Booking: ${appt.patient.name}`,
      message: `
        Patient: ${appt.patient.name}
        Phone: ${appt.patient.phone}
        Date: ${appt.date}
        Time: ${appt.timeSlot}
        Description: ${appt.problemDescription}
      `,
      patient_name: appt.patient.name,
      patient_phone: appt.patient.phone,
      appt_date: appt.date,
      appt_time: appt.timeSlot
    };

    await send(Config.SERVICE_ID, Config.TEMPLATE_ID, templateParams, Config.PUBLIC_KEY);
    console.log("Email sent to doctor.");
  } catch (error) {
    console.error("Failed to send email to doctor:", error);
  }
};

export const notifyPatientStatusChange = async (appt: Appointment, status: string) => {
  if (Config.PUBLIC_KEY === 'YOUR_PUBLIC_KEY') return;
  
  if (!appt.patient.email) return;

  let messageBody = '';
  if (status === 'CONFIRMED') {
    messageBody = `Your appointment with Dr. Chandima Weerasekera (SmileFree) is CONFIRMED.\n\nDate: ${appt.date}\nTime: ${appt.timeSlot}\nLocation: 376/A/2, Meewathura, Peradeniya.\nPlease arrive 10 minutes early. Contact: 071 8385476`;
  } else if (status === 'CANCELLED') {
    messageBody = `We regret to inform you that your appointment request for ${appt.date} could not be accommodated. Please contact the clinic at 071 8385476 to reschedule.`;
  } else {
    return;
  }

  try {
    const templateParams = {
      to_email: appt.patient.email,
      subject: `Appointment Update - SmileFree Orthodontics`,
      message: messageBody,
      patient_name: appt.patient.name
    };

    await send(Config.SERVICE_ID, Config.TEMPLATE_ID, templateParams, Config.PUBLIC_KEY);
    console.log("Email sent to patient.");
  } catch (error) {
    console.error("Failed to send email to patient:", error);
  }
};