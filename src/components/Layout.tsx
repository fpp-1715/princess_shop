import { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="flex flex-col min-h-screen relative pb-20">
      <header className="fixed top-0 w-full z-50 bg-[#f9f9f9]/80 dark:bg-[#2f3334]/80 backdrop-blur-lg shadow-[0_20px_40px_rgba(123,85,86,0.06)]">
        <div className="flex justify-between items-center px-6 py-4 w-full">
          <button className="text-[#7b5556] dark:text-[#f2f4f4] hover:opacity-80 transition-opacity active:scale-95 duration-200">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <h1 className="text-2xl font-['Noto_Serif'] italic font-light tracking-tight text-[#7b5556] dark:text-[#f2f4f4]">
            Princess Shop
          </h1>
          <div className="relative flex items-center gap-2">
            <button className="text-[#7b5556] dark:text-[#f2f4f4] hover:opacity-80 transition-opacity active:scale-95 duration-200">
              <span className="material-symbols-outlined">shopping_bag</span>
            </button>
            <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] text-on-primary font-bold">
              2
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="flex-1 w-full">
        {children}
      </div>

      {/* Bottom NavBar */}
      <nav className="fixed bottom-0 left-0 w-full flex justify-around items-center px-4 pb-6 pt-3 bg-[#ffffff]/90 dark:bg-[#2f3334]/90 backdrop-blur-xl rounded-t-[2rem] z-50 shadow-[0_-10px_30px_rgba(123,85,86,0.04)]">
        <Link 
          to="/" 
          className={`flex flex-col items-center justify-center transition-colors active:transform active:scale-90 duration-300 px-6 py-2 rounded-full ${currentPath === '/' ? 'text-[#7b5556] dark:text-[#f2f4f4] font-bold bg-[#f2f4f4] dark:bg-[#7b5556]/20 scale-90' : 'text-[#7b5556]/50 dark:text-[#f2f4f4]/40 hover:text-[#7b5556] dark:hover:text-[#f2f4f4]'}`}
        >
          <span 
            className="material-symbols-outlined mb-1" 
            style={currentPath === '/' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            auto_awesome
          </span>
          <span className="font-['Manrope'] text-[0.6875rem] uppercase tracking-[0.05em]">Glow</span>
        </Link>
        <Link 
          to="/shop" 
          className={`flex flex-col items-center justify-center transition-colors active:transform active:scale-90 duration-300 px-6 py-2 rounded-full ${currentPath === '/shop' ? 'text-[#7b5556] dark:text-[#f2f4f4] font-bold bg-[#f2f4f4] dark:bg-[#7b5556]/20 scale-90' : 'text-[#7b5556]/50 dark:text-[#f2f4f4]/40 hover:text-[#7b5556] dark:hover:text-[#f2f4f4]'}`}
        >
          <span 
            className="material-symbols-outlined mb-1"
            style={currentPath === '/shop' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            local_mall
          </span>
          <span className="font-['Manrope'] text-[0.6875rem] uppercase tracking-[0.05em]">Shop</span>
        </Link>
        <Link 
          to="/contact" 
          className={`flex flex-col items-center justify-center transition-colors active:transform active:scale-90 duration-300 px-6 py-2 rounded-full ${currentPath === '/contact' ? 'text-[#7b5556] dark:text-[#f2f4f4] font-bold bg-[#f2f4f4] dark:bg-[#7b5556]/20 scale-90' : 'text-[#7b5556]/50 dark:text-[#f2f4f4]/40 hover:text-[#7b5556] dark:hover:text-[#f2f4f4]'}`}
        >
          <span 
            className="material-symbols-outlined mb-1"
            style={currentPath === '/contact' ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            person
          </span>
          <span className="font-['Manrope'] text-[0.6875rem] uppercase tracking-[0.05em]">Me</span>
        </Link>
      </nav>
    </div>
  );
}