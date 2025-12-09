import React, { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, CheckCircle, AlertCircle, ChevronRight, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getAvailableSlots, saveAppointment } from '../services/db';
import { notifyDoctorNewBooking } from '../services/email';
import { AppointmentStatus } from '../types';

export const Booking: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [date, setDate] = useState('');
  const [slots, setSlots] = useState<string[]>([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });
  
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDate = tomorrow.toISOString().split('T')[0];

  useEffect(() => {
    if (date) {
      setLoading(true);
      getAvailableSlots(date).then(available => {
        setSlots(available);
        setLoading(false);
      });
    }
  }, [date]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');

    const newAppointment = {
      patient: {
        name: formData.name,
        age: 0,
        email: formData.email,
        phone: formData.phone
      },
      date: date,
      timeSlot: selectedSlot,
      problemDescription: 'General Consultation',
      status: AppointmentStatus.PENDING,
      createdAt: new Date().toISOString()
    };

    try {
      // Save to Cloud Firestore
      const id = await saveAppointment(newAppointment);
      // Trigger Email
      await notifyDoctorNewBooking({ id, ...newAppointment });
      
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      console.error(err);
      setErrorMsg("Failed to book appointment. Please check your internet connection.");
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-4">
        <div className="bg-green-50 dark:bg-slate-800 p-10 rounded-3xl shadow-xl text-center max-w-lg w-full border-2 border-green-100 dark:border-green-900">
          <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg">
            <CheckCircle className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-4">Appointment Confirmed!</h2>
          <p className="text-xl text-slate-700 dark:text-slate-300 mb-8 leading-relaxed">
            Thank you, <strong>{formData.name}</strong>.<br/>
            Dr. Chandima will see you on <br/>
            <span className="font-bold text-teal-700 dark:text-teal-400">{date} at {selectedSlot}</span>.
          </p>
          <button 
            onClick={() => navigate('/')}
            className="w-full py-4 bg-teal-600 hover:bg-teal-700 text-white rounded-xl font-bold text-xl transition-colors shadow-md"
          >
            Return Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Book Your Visit</h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">Simple 2-step booking process.</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        {/* Simple Progress Indicator */}
        <div className="flex border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
            <div className={`flex-1 py-5 text-center text-lg font-bold ${step === 1 ? 'text-teal-600 bg-white dark:bg-slate-800 border-b-4 border-teal-600' : 'text-slate-400'}`}>1. Date & Time</div>
            <div className={`flex-1 py-5 text-center text-lg font-bold ${step === 2 ? 'text-teal-600 bg-white dark:bg-slate-800 border-b-4 border-teal-600' : 'text-slate-400'}`}>2. Your Details</div>
        </div>

        <div className="p-6 md:p-12">
          {errorMsg && (
             <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100">
               {errorMsg}
             </div>
          )}
          {step === 1 && (
            <div className="space-y-8">
              <div>
                <label className="block text-xl font-bold text-slate-800 dark:text-white mb-4">Pick a Date</label>
                <div className="relative">
                  <CalendarIcon className="absolute left-4 top-4 h-6 w-6 text-slate-500" />
                  <input 
                    type="date" 
                    min={minDate}
                    value={date}
                    onChange={(e) => { setDate(e.target.value); setSelectedSlot(''); }}
                    className="w-full pl-14 pr-4 py-4 text-xl border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none transition-all cursor-pointer"
                  />
                </div>
              </div>

              {date && (
                <div className="animate-fade-in">
                  <label className="block text-xl font-bold text-slate-800 dark:text-white mb-4">Select Time Slot</label>
                  {loading ? (
                    <div className="py-12 text-center text-xl text-slate-500">Loading available times...</div>
                  ) : slots.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {slots.map(slot => (
                        <button
                          key={slot}
                          onClick={() => setSelectedSlot(slot)}
                          className={`py-4 px-4 text-lg font-semibold rounded-xl border-2 transition-all ${
                            selectedSlot === slot 
                              ? 'bg-teal-600 text-white border-teal-600 shadow-lg scale-105' 
                              : 'border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:border-teal-400 hover:bg-teal-50 dark:hover:bg-slate-700'
                          }`}
                        >
                          {slot}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-6 bg-orange-50 dark:bg-orange-900/20 text-orange-800 dark:text-orange-200 rounded-xl flex items-center text-lg">
                      <AlertCircle className="w-6 h-6 mr-3" />
                      No slots available for this date. Please try another day.
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-end pt-8">
                <button 
                  disabled={!selectedSlot}
                  onClick={() => setStep(2)}
                  className="px-10 py-4 bg-teal-600 text-white rounded-xl font-bold text-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-teal-700 transition-colors flex items-center shadow-lg"
                >
                  Continue <ChevronRight className="ml-2 w-6 h-6" />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-8">
              <div>
                <label className="block text-xl font-bold text-slate-800 dark:text-white mb-2">Full Name</label>
                <input 
                  required 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  placeholder="e.g. Mr. Silva"
                />
              </div>

              <div>
                <label className="block text-xl font-bold text-slate-800 dark:text-white mb-2">Phone Number</label>
                <input 
                  required 
                  type="tel" 
                  name="phone"
                  pattern="[0-9]{10}"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  placeholder="07xxxxxxxx"
                />
                <p className="text-slate-500 mt-2 text-sm">We will call you to confirm.</p>
              </div>

              <div>
                <label className="block text-xl font-bold text-slate-800 dark:text-white mb-2">Email (Optional)</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-6 py-4 text-lg border-2 border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-4 focus:ring-teal-500/20 focus:border-teal-500 outline-none"
                  placeholder="name@email.com"
                />
              </div>

              <div className="flex justify-between pt-8 items-center">
                <button 
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center text-lg px-4 py-2"
                >
                  <ArrowLeft className="mr-2 w-5 h-5" /> Back
                </button>
                <button 
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-teal-600 text-white rounded-xl font-bold text-xl hover:bg-teal-700 transition-colors flex items-center shadow-lg disabled:opacity-70"
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};