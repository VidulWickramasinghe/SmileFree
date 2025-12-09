import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { getAppointments, updateAppointmentStatus } from '../services/db';
import { notifyPatientStatusChange } from '../services/email';
import { Appointment, AppointmentStatus } from '../types';
import { Check, X, Clock, Calendar, Phone, Search, Download, TrendingUp, Users } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filter, setFilter] = useState<AppointmentStatus | 'ALL'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const refreshData = () => {
    setAppointments(getAppointments().reverse()); // Newest first
  };

  useEffect(() => {
    refreshData();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const handleStatusChange = async (appt: Appointment, status: AppointmentStatus) => {
    setLoading(true);
    updateAppointmentStatus(appt.id, status);
    await notifyPatientStatusChange(appt, status);
    refreshData();
    setLoading(false);
  };

  const exportCSV = () => {
    const headers = ["Patient Name", "Phone", "Date", "Time", "Status", "Description"];
    const rows = appointments.map(a => [
        a.patient.name, 
        a.patient.phone, 
        a.date, 
        a.timeSlot, 
        a.status, 
        `"${a.problemDescription}"`
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.map(e => e.join(",")).join("\n");
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `smilefree_appointments_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredAppointments = appointments.filter(a => {
    const matchesFilter = filter === 'ALL' || a.status === filter;
    const matchesSearch = a.patient.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          a.patient.phone.includes(searchTerm);
    return matchesFilter && matchesSearch;
  });

  // Stats
  const today = new Date().toISOString().split('T')[0];
  const todayCount = appointments.filter(a => a.date === today && a.status === AppointmentStatus.CONFIRMED).length;
  const pendingCount = appointments.filter(a => a.status === AppointmentStatus.PENDING).length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">Doctor Dashboard</h1>
          <p className="text-lg text-teal-600 font-medium">Welcome back, {user?.name}</p>
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
            <div className="bg-teal-50 dark:bg-teal-900/20 px-6 py-3 rounded-xl border border-teal-100 dark:border-teal-800 text-center">
                <span className="block text-2xl font-bold text-teal-700 dark:text-teal-400">{todayCount}</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Today</span>
            </div>
            <div className="bg-orange-50 dark:bg-orange-900/20 px-6 py-3 rounded-xl border border-orange-100 dark:border-orange-800 text-center">
                <span className="block text-2xl font-bold text-orange-700 dark:text-orange-400">{pendingCount}</span>
                <span className="text-sm font-medium text-slate-600 dark:text-slate-400">Pending</span>
            </div>
        </div>
      </div>

      {loading && <div className="fixed top-0 left-0 w-full h-1.5 bg-teal-500 animate-pulse z-50"></div>}

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
            <Search className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input 
                type="text" 
                placeholder="Search patient name or phone..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 outline-none"
            />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
          {['ALL', 'PENDING', 'CONFIRMED', 'CANCELLED'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-5 py-3 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${
                filter === f 
                  ? 'bg-teal-600 text-white shadow-md' 
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
              }`}
            >
              {f.charAt(0) + f.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
        <button 
            onClick={exportCSV}
            className="flex items-center px-5 py-3 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition-colors font-medium whitespace-nowrap"
        >
            <Download className="w-5 h-5 mr-2" /> Export
        </button>
      </div>

      {/* List */}
      <div className="space-y-4">
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-20 bg-slate-50 dark:bg-slate-800 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700">
            <p className="text-xl text-slate-500">No appointments found.</p>
          </div>
        ) : (
          filteredAppointments.map((appt) => (
            <div key={appt.id} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 transition-all hover:shadow-md">
              <div className="flex flex-col lg:flex-row justify-between gap-6 items-center">
                
                {/* Info */}
                <div className="flex-1 w-full">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {appt.patient.name}
                    </h3>
                    <span className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wide ${
                        appt.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                        appt.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                        appt.status === 'CANCELLED' ? 'bg-red-100 text-red-800' : 'bg-slate-100'
                    }`}>
                      {appt.status}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-8 text-lg text-slate-600 dark:text-slate-400">
                    <div className="flex items-center"><Phone className="w-5 h-5 mr-3 text-slate-400"/> {appt.patient.phone}</div>
                    <div className="flex items-center"><Calendar className="w-5 h-5 mr-3 text-slate-400"/> {appt.date}</div>
                    <div className="flex items-center font-semibold text-teal-700 dark:text-teal-400"><Clock className="w-5 h-5 mr-3"/> {appt.timeSlot}</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-row gap-3 w-full lg:w-auto justify-end">
                  {appt.status === AppointmentStatus.PENDING && (
                    <>
                      <button 
                        onClick={() => handleStatusChange(appt, AppointmentStatus.CONFIRMED)}
                        className="flex-1 lg:flex-none bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl text-lg font-bold transition-colors flex items-center justify-center shadow-md"
                      >
                        <Check className="w-5 h-5 mr-2" /> Accept
                      </button>
                      <button 
                        onClick={() => handleStatusChange(appt, AppointmentStatus.CANCELLED)}
                        className="flex-1 lg:flex-none bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-600 px-6 py-3 rounded-xl text-lg font-bold transition-colors flex items-center justify-center"
                      >
                        <X className="w-5 h-5 mr-2" /> Decline
                      </button>
                    </>
                  )}
                  {appt.status === AppointmentStatus.CONFIRMED && (
                    <button 
                      onClick={() => handleStatusChange(appt, AppointmentStatus.COMPLETED)}
                      className="w-full lg:w-auto bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition-colors"
                    >
                      Mark Completed
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};