import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Smile, Award, MapPin, Stethoscope, Phone, Clock, HelpCircle } from 'lucide-react';

const UserPlaceholder = () => (
    <svg className="w-full h-full text-slate-400" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
);

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-teal-50 dark:bg-slate-900 py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <span className="inline-block px-4 py-2 rounded-full bg-teal-100 text-teal-800 border border-teal-200 font-bold mb-6">
                 SRI LANKA'S TRUSTED ORTHODONTIST
              </span>
              <h1 className="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white tracking-tight mb-8 leading-tight">
                Welcome to <br/>
                <span className="text-teal-600">SmileFree</span>
              </h1>
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-10 leading-relaxed">
                Gentle, professional dental care for the whole family. We help you achieve the smile you deserve.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start">
                <Link to="/booking" className="inline-flex justify-center items-center px-8 py-5 text-xl font-bold rounded-xl text-white bg-teal-600 hover:bg-teal-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                  <Calendar className="mr-3 h-6 w-6" />
                  Book Appointment
                </Link>
                <a href="tel:+94112345678" className="inline-flex justify-center items-center px-8 py-5 text-xl font-bold rounded-xl text-teal-700 bg-white border-2 border-teal-100 hover:border-teal-300 hover:bg-teal-50 transition-colors">
                  <Phone className="mr-3 h-6 w-6" />
                  Call Clinic
                </a>
              </div>
            </div>
            
            {/* Doctor Card */}
            <div className="lg:w-1/2 w-full">
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-6 mb-6">
                        <div className="w-24 h-24 bg-slate-200 rounded-full flex items-center justify-center overflow-hidden border-4 border-teal-100">
                             <UserPlaceholder />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Dr. Chandima Weerasekera</h3>
                            <p className="text-teal-600 font-medium text-lg">Consultant Orthodontist</p>
                            <div className="flex items-center mt-2 text-slate-500">
                                <MapPin className="w-4 h-4 mr-1" />
                                <span>Peradeniya, Sri Lanka</span>
                            </div>
                        </div>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-lg leading-relaxed italic mb-6">
                        "My goal is to make orthodontic treatment simple, comfortable, and effective for patients of all ages."
                    </p>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-teal-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                            <span className="block text-3xl font-bold text-teal-600 mb-1">15+</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Years Experience</span>
                        </div>
                        <div className="bg-teal-50 dark:bg-slate-700 p-4 rounded-xl text-center">
                            <span className="block text-3xl font-bold text-teal-600 mb-1">5k+</span>
                            <span className="text-sm text-slate-600 dark:text-slate-400">Happy Smiles</span>
                        </div>
                    </div>
                </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section - Simplified */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-6">Our Services</h2>
            <p className="text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
              We offer comprehensive orthodontic care designed for your comfort.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Metal Braces", desc: "Strong and effective for all ages.", icon: Smile },
              { title: "Clear Aligners", desc: "Invisible way to straighten teeth.", icon: Award },
              { title: "Jaw Correction", desc: "Improving bite and comfort.", icon: Stethoscope },
            ].map((service, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-slate-800 p-10 rounded-2xl border-2 border-transparent hover:border-teal-100 transition-colors text-center">
                <div className="w-20 h-20 bg-teal-100 dark:bg-teal-900/50 rounded-full flex items-center justify-center mb-6 mx-auto">
                  {React.createElement(service.icon as any, { className: "h-10 w-10 text-teal-600 dark:text-teal-400" })}
                </div>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{service.title}</h3>
                <p className="text-lg text-slate-600 dark:text-slate-400">
                  {service.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ / Expectation Section */}
      <section className="py-20 bg-teal-50 dark:bg-slate-800/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10 text-center">Common Questions</h2>
            <div className="space-y-6">
                {[
                    { q: "Do braces hurt?", a: "You might feel slight pressure for a few days, but it is very manageable. We ensure your comfort at every step." },
                    { q: "How long does treatment take?", a: "It varies by person, but typically between 12 to 24 months." },
                    { q: "Is there an age limit?", a: "No! We treat children, teenagers, and adults. It's never too late for a healthy smile." }
                ].map((item, i) => (
                    <div key={i} className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm">
                        <h4 className="flex items-center text-xl font-bold text-slate-900 dark:text-white mb-3">
                            <HelpCircle className="w-6 h-6 text-teal-600 mr-3 flex-shrink-0" />
                            {item.q}
                        </h4>
                        <p className="text-lg text-slate-600 dark:text-slate-300 ml-9">{item.a}</p>
                    </div>
                ))}
            </div>
            
            <div className="mt-16 bg-teal-600 rounded-2xl p-8 md:p-12 text-center text-white">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to start?</h3>
                <p className="text-lg mb-8 opacity-90">First consultation is simple and informative.</p>
                 <Link to="/booking" className="inline-block bg-white text-teal-700 font-bold py-4 px-10 rounded-xl hover:bg-teal-50 transition-colors text-lg">
                  Book Now
                </Link>
            </div>
        </div>
      </section>

      {/* Location */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-center text-slate-900 dark:text-white mb-12">Visit SmileFree Clinic</h2>
            
            <div className="flex flex-col md:flex-row gap-8">
                 {/* Clickable Map Card */}
                <a 
                  href="https://maps.app.goo.gl/3cdhDcELigWN2YjR9" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-full md:w-2/3 h-96 bg-slate-200 rounded-3xl overflow-hidden relative group hover:shadow-xl transition-all duration-300 border-4 border-slate-100 dark:border-slate-800"
                >
                    <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&q=80&w=1000')] bg-cover bg-center opacity-60 group-hover:opacity-70 transition-opacity"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/95 dark:bg-slate-900/95 px-8 py-4 rounded-full shadow-lg flex items-center space-x-3 backdrop-blur-sm group-hover:scale-105 transition-transform">
                            <MapPin className="h-6 w-6 text-red-500" />
                            <span className="font-bold text-lg text-slate-900 dark:text-white">Open Google Maps</span>
                        </div>
                    </div>
                </a>

                <div className="w-full md:w-1/3 bg-slate-50 dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 flex flex-col justify-center">
                    <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-6 flex items-center">
                        <Clock className="w-6 h-6 text-teal-600 mr-2" />
                        Opening Hours
                    </h4>
                    <ul className="space-y-4 text-lg text-slate-600 dark:text-slate-300">
                        <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span>Weekdays</span>
                            <span className="font-semibold">9am - 6pm</span>
                        </li>
                        <li className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
                            <span>Saturday</span>
                            <span className="font-semibold">9am - 1pm</span>
                        </li>
                        <li className="flex justify-between text-slate-400">
                            <span>Sunday</span>
                            <span>Closed</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
      </section>
    </div>
  );
};