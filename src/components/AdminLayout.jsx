import { useState, useEffect } from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Film,
  Tv,
  Users,
  MessageSquare,
  Menu,
  X,
  ArrowLeft
} from 'lucide-react';

export const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false); // Default false for mobile
  const location = useLocation();

  // Screen එක resize වෙද්දී sidebar එකේ තත්ත්වය පාලනය කිරීම
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mobile වලදී link එකක් click කළ විට sidebar එක වැසීමට
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  }, [location.pathname]);

  const menuItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
    { path: '/admin/movies', icon: Film, label: 'Movies' },
    { path: '/admin/tvseries', icon: Tv, label: 'TV Series' },
    { path: '/admin/actors', icon: Users, label: 'Actors' },
    { path: '/admin/reviews', icon: MessageSquare, label: 'Reviews' }
  ];

  const isActive = (path, exact) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-gray-950 flex overflow-x-hidden">
      
      {/* Mobile Overlay - Sidebar එක ඇරිලා තියෙද්දී background එක අඳුරු කිරීමට */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ 
          x: sidebarOpen ? 0 : -300,
          width: sidebarOpen ? "16rem" : "0rem" 
        }}
        className={`fixed lg:sticky top-0 left-0 h-screen bg-gray-900 border-r border-gray-800 z-50 overflow-y-auto overflow-x-hidden transition-all duration-300`}
      >
        <div className="w-64 p-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-extrabold text-white tracking-tight">Admin <span className="text-blue-500">Panel</span></h2>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center gap-2 text-gray-400 hover:text-blue-400 transition-colors mb-8 text-sm font-medium group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Site
          </Link>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const active = isActive(item.path, item.exact);
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    active
                      ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                      : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  <item.icon className={`w-5 h-5 ${active ? 'text-white' : 'group-hover:text-blue-400'}`} />
                  <span className="font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </motion.aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Top Header */}
        <header className="sticky top-0 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 z-30">
          <div className="flex items-center justify-between p-4 px-6">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 -ml-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-all"
              >
                <Menu className="w-6 h-6" />
              </button>
              <h1 className="text-gray-200 font-medium hidden sm:block">
                {menuItems.find(item => isActive(item.path, item.exact))?.label || 'Dashboard'}
              </h1>
            </div>
            
            <div className="flex items-center gap-4">
               {/* මෙතනට Profile icon එකක් වගේ දෙයක් දාන්න පුළුවන් */}
               <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-xs">
                  AD
               </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main className="p-4 sm:p-6 lg:p-8 max-w-[1600px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};