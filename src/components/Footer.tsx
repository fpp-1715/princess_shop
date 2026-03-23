import { Link } from 'react-router-dom';
import AppLogo from './ui/AppLogo';
import Icon from './ui/AppIcon';

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-white/60 backdrop-blur-sm mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start gap-1.5">
            <div className="flex items-center gap-2">
              <AppLogo size={28} />
              <span className="font-display font-semibold text-lg text-foreground">
                Princess<span className="text-gradient-rose">Shop</span>
              </span>
            </div>
            <p className="text-xs text-foreground-subtle font-medium">Skincare de lujo para tu ritual diario</p>
          </div>
          <nav className="flex items-center gap-6">
            <Link to="/" className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">Inicio</Link>
            <Link to="/shop" className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">Tienda</Link>
            <Link to="/contact" className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors duration-200">Contacto</Link>
            <Link to="/admin" className="text-sm font-medium text-primary hover:text-primary-dark transition-colors duration-200 flex items-center gap-1">
              <Icon name="LockClosedIcon" size={14} /> Admin
            </Link>
          </nav>
          <div className="flex flex-col items-center md:items-end gap-2">
            <p className="text-xs text-foreground-subtle">
              © 2026 PrincessShop · <Link to="#" className="hover:text-primary transition-colors">Privacidad</Link>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}