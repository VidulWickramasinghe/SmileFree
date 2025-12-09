import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Moon, Sun, Stethoscope, LogIn, Phone, Type, Github, AlertTriangle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { isFirebaseConfigured } from '../lib/firebase';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);
  const [largeText, setLargeText] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();

  const toggleTheme = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle('dark');
  };

  const toggleTextSize = () => {
    setLargeText(!largeText);
  };

  const wrapperClass = largeText ? 'text-lg md:text-xl' : 'text-base';

  const NavLink = ({ to, label, mobile = false }: { to: string; label: string; mobile?: boolean }) => {
    const isActive = location.pathname === to;
    const baseClasses = mobile
      ? "block px-4 py-3 rounded-lg text-lg font-medium transition-colors border-l-4"
      : "px-4 py-2 rounded-lg text-base font-medium transition-colors";
    
    const activeClasses = isActive
      ? "bg-teal-100 text-teal-800 border-teal-600 dark:bg-teal-900 dark:text-teal-100"
      : "text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white";

    return (
      <Link to={to} className={`${baseClasses} ${activeClasses}`} onClick={() => mobile && setIsMenuOpen(false)}>
        {label}
      </Link>
    );
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-200 ${wrapperClass}`}>
      
      {/* System Status Banner */}
      {!isFirebaseConfigured && (
        <div className="bg-red-600 text-white text-center py-2 px-4 text-sm font-bold flex items-center justify-center gap-2">
          <AlertTriangle className="w-4 h-4" />
          <span>DEMO MODE: Data is saved locally. Configure Firebase in 'lib/firebase.ts' to go live.</span>
        </div>
      )}

      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-slate-900 shadow-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-teal-600 p-2.5 rounded-xl shadow-lg group-hover:bg-teal-700 transition-colors">
                  <Stethoscope className="h-7 w-7 text-white" />
                </div>
                <div>
                  <span className="block font-bold text-2xl tracking-tight text-slate-800 dark:text-white leading-none">
                    Smile<span className="text-teal-600">Free</span>
                  </span>
                  <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Orthodontics</span>
                </div>
              </Link>
            </div>
            
            {/* Desktop Menu */}
            <div className="hidden md:flex items-center space-x-2">
              <NavLink to="/" label="Home" />
              <NavLink to="/booking" label="Book Appointment" />
              {isAuthenticated && <NavLink to="/dashboard" label="Doctor Dashboard" />}
              
              <div className="h-6 w-px bg-slate-300 mx-4"></div>

              <button 
                onClick={toggleTextSize}
                className="p-3 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 flex items-center gap-1 font-bold"
                title="Increase Text Size"
              >
                <Type className="h-5 w-5" />
                {largeText ? '-' : '+'}
              </button>

              <button onClick={toggleTheme} className="p-3 rounded-full text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800" title="Toggle Dark Mode">
                {isDark ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
              </button>

              <a href="tel:0718385476" className="ml-4 flex items-center px-5 py-3 text-base font-bold text-white bg-teal-600 rounded-xl hover:bg-teal-700 transition-colors shadow-md">
                <Phone className="h-5 w-5 mr-2" />
                071 8385476
              </a>

              {isAuthenticated ? (
                <button 
                  onClick={logout}
                  className="ml-2 flex items-center px-4 py-2 text-sm font-medium text-slate-700 bg-slate-200 rounded-lg hover:bg-slate-300 transition-colors"
                >
                  Logout
                </button>
              ) : (
                <Link 
                  to="/login"
                  className="ml-2 p-3 text-slate-400 hover:text-teal-600 transition-colors"
                  title="Doctor Login"
                >
                  <LogIn className="h-6 w-6" />
                </Link>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center space-x-4">
               <button 
                onClick={toggleTextSize}
                className="p-2 rounded-full text-slate-600 font-bold border border-slate-200"
              >
                A{largeText ? '-' : '+'}
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              >
                {isMenuOpen ? <X className="h-8 w-8" /> : <Menu className="h-8 w-8" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 shadow-xl">
            <div className="px-4 pt-4 pb-6 space-y-2">
              <NavLink to="/" label="Home" mobile />
              <NavLink to="/booking" label="Book Appointment" mobile />
              {isAuthenticated && <NavLink to="/dashboard" label="Doctor Dashboard" mobile /> }
              
              <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col gap-4">
                 <a href="tel:0718385476" className="w-full flex items-center justify-center px-5 py-4 text-lg font-bold text-white bg-teal-600 rounded-xl shadow-md">
                  <Phone className="h-6 w-6 mr-2" />
                  Call Clinic
                </a>
                
                <div className="flex justify-between items-center px-2">
                   <button onClick={toggleTheme} className="flex items-center text-slate-600 dark:text-slate-300 font-medium">
                    {isDark ? <Sun className="h-6 w-6 mr-2" /> : <Moon className="h-6 w-6 mr-2" />}
                    {isDark ? 'Light Mode' : 'Dark Mode'}
                  </button>
                  
                  {!isAuthenticated && (
                     <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-teal-600 font-medium">Doctor Login</Link>
                  )}
                  {isAuthenticated && (
                     <button onClick={() => {logout(); setIsMenuOpen(false)}} className="text-red-600 font-medium">Logout</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      <main className="flex-grow">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Stethoscope className="h-8 w-8 text-teal-400" />
                <span className="font-bold text-2xl tracking-tight text-white">
                  Smile<span className="text-teal-400">Free</span>
                </span>
              </div>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Professional and caring orthodontic treatment for all ages. We make smiles beautiful.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 inline-block">Contact Us</h3>
              <ul className="space-y-4 text-slate-300 text-lg">
                <li className="flex items-start"><span className="opacity-70 mr-3">📍</span> 376/A/2, Meewathura<br/>Peradeniya, Sri Lanka</li>
                <li className="flex items-center"><span className="opacity-70 mr-3">📧</span> vidulexams2@gmail.com</li>
                <li className="flex items-center"><span className="opacity-70 mr-3">📞</span> 071 8385476</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-700 pb-2 inline-block">Visit Hours</h3>
              <ul className="space-y-3 text-slate-300 text-lg">
                <li className="flex justify-between"><span>Mon - Fri:</span> <span>9:00 AM - 6:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday:</span> <span>9:00 AM - 1:00 PM</span></li>
                <li className="flex justify-between text-slate-500"><span>Sunday:</span> <span>Closed</span></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 border-t border-slate-800 pt-8 flex flex-col lg:flex-row justify-between items-center text-sm text-slate-500 gap-4">
            <div className="flex flex-col md:flex-row gap-2 md:gap-8 items-center">
               <p>&copy; {new Date().getFullYear()} Dr. Chandima Weerasekera. All rights reserved.</p>
               <div className="flex space-x-6">
                  <Link to="/login" className="hover:text-teal-400">Admin</Link>
                  <a href="#" className="hover:text-teal-400">Privacy Policy</a>
              </div>
            </div>
            
            <div className="text-center lg:text-right bg-slate-800/50 px-6 py-3 rounded-xl border border-slate-800">
               <p className="font-medium text-slate-400 mb-1">
                 Developed by <a href="https://github.com/stevyOP" target="_blank" rel="noopener noreferrer" className="text-teal-400 hover:text-teal-300 flex items-center justify-center lg:justify-end gap-1 inline-flex">Vidul Wickramasinghe <Github className="w-3 h-3"/></a>
               </p>
               <p className="text-slate-600 text-xs tracking-wider">Dev Contact: 070-7450675</p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};