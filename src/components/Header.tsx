import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import AppLogo from './ui/AppLogo';
import Icon from './ui/AppIcon';
import CartDrawer from './CartDrawer';
import { useCartStore } from '../store/cartStore';

const navLinks = [
  { label: 'Inicio', href: '/' },
  { label: 'Tienda', href: '/shop' },
  { label: 'Contacto', href: '/contact' },
];

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const totalItems = useCartStore((s) => s.getTotalItems());
  const isCartOpen = useCartStore((s) => s.isCartOpen);
  const openCart = useCartStore((s) => s.openCart);
  const closeCart = useCartStore((s) => s.closeCart);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`fixed top-0 w-full z-50 transition-all duration-500 ${scrolled ? 'py-2' : 'py-4'}`}>
      <div className={`mx-4 md:mx-8 lg:mx-12 rounded-2xl transition-all duration-500 ${scrolled ? 'glass shadow-rose-sm px-6 py-3' : 'bg-transparent px-6 py-3'}`}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <AppLogo size={36} />
            <span className="font-display font-semibold text-xl text-foreground tracking-tight group-hover:text-primary transition-colors duration-300">
              Princess<span className="text-gradient-rose">Shop</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link key={link.href} to={link.href} className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.href ? 'bg-primary/10 text-primary font-semibold' :'text-foreground-muted hover:text-foreground hover:bg-blush-light/60'}`}>
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <button 
              onClick={openCart}
              className="relative w-10 h-10 flex items-center justify-center rounded-xl text-foreground-muted hover:text-primary hover:bg-blush-light/60 transition-all duration-300"
            >
              <Icon name="ShoppingBagIcon" size={20} variant="outline" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </button>
            <Link to="/shop" className="btn-primary px-6 py-2.5 rounded-xl text-sm font-semibold inline-flex items-center gap-2">
              <span>Comprar</span>
              <Icon name="SparklesIcon" size={14} variant="solid" />
            </Link>
          </div>

          <button className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl text-foreground-muted hover:text-primary hover:bg-blush-light/60 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
            <Icon name={mobileOpen ? 'XMarkIcon' : 'Bars3Icon'} size={22} variant="outline" />
          </button>
          
          <button 
            className="md:hidden relative w-10 h-10 flex items-center justify-center rounded-xl text-foreground-muted hover:text-primary hover:bg-blush-light/60 transition-all ml-1" 
            onClick={openCart}
          >
            <Icon name="ShoppingBagIcon" size={22} variant="outline" />
            {totalItems > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </div>
      <div className={`md:hidden mx-4 rounded-2xl glass shadow-rose-md overflow-hidden transition-all duration-500 ${mobileOpen ? 'max-h-80 opacity-100 mt-2' : 'max-h-0 opacity-0 mt-0 pointer-events-none'}`}>
        <nav className="p-4 flex flex-col gap-1">
          {navLinks.map((link) => (
            <Link key={link.href} to={link.href} onClick={() => setMobileOpen(false)} className={`px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${location.pathname === link.href ? 'bg-primary/10 text-primary font-semibold' :'text-foreground-muted hover:text-foreground hover:bg-blush-light/60'}`}>
              {link.label}
            </Link>
          ))}
          <Link to="/shop" onClick={() => setMobileOpen(false)} className="btn-primary mt-2 px-6 py-3 rounded-xl text-sm font-semibold text-center">
            Comprar Ahora
          </Link>
        </nav>
      </div>

      <CartDrawer isOpen={isCartOpen} onClose={closeCart} />
    </header>
  );
}