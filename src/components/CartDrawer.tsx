import { useEffect } from 'react';
import { useCartStore } from '../store/cartStore';
import Icon from './ui/AppIcon';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();

  // Prevenir scroll en el fondo cuando el carrito está abierto
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCheckout = () => {
    // Generar mensaje para WhatsApp
    const phoneNumber = "5355555555"; // Reemplaza con el número de teléfono real
    let message = "¡Hola! ✨ Estoy interesad@ en realizar la siguiente compra:\n\n";
    
    items.forEach(item => {
      const itemTotal = item.price * item.quantity;
      message += `🛍️ *${item.quantity}x ${item.name}*\n`;
      message += `   Precio: $${item.price} CUP c/u (Subtotal: $${itemTotal} CUP)\n\n`;
    });
    
    message += `💳 *Total a pagar:* $${getTotalPrice()} CUP\n\n`;
    message += "Quedo a la espera para coordinar la entrega. ¡Muchas gracias! 💕";
    
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <>
      {/* Overlay Oscuro */}
      <div 
        className={`fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[70] transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-primary/10">
          <h2 className="text-xl font-display font-bold flex items-center gap-2">
            <Icon name="ShoppingBagIcon" size={24} className="text-primary" variant="solid" />
            Tu Carrito
          </h2>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors">
            <Icon name="XMarkIcon" size={24} />
          </button>
        </div>

        {/* Body (Items) */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
              <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary/30">
                <Icon name="ShoppingBagIcon" size={48} variant="outline" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-800">Tu carrito está vacío</p>
                <p className="text-sm text-gray-500 mt-1">Parece que aún no has agregado nada.</p>
              </div>
              <button onClick={onClose} className="btn-secondary px-6 py-2.5 rounded-xl font-medium mt-4">
                Seguir explorando
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 group">
                  <div className="w-20 h-24 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0 relative border border-gray-100">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-2">
                      <h3 className="font-semibold text-sm leading-tight text-gray-900">{item.name}</h3>
                      <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                        <Icon name="TrashIcon" size={16} />
                      </button>
                    </div>
                    <div className="flex items-end justify-between mt-2">
                      <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1 border border-gray-200">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all">
                          <Icon name="MinusIcon" size={12} />
                        </button>
                        <span className="text-sm font-semibold w-4 text-center">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-6 h-6 flex items-center justify-center text-gray-500 hover:bg-white hover:shadow-sm rounded-md transition-all">
                          <Icon name="PlusIcon" size={12} />
                        </button>
                      </div>
                      <span className="font-bold text-gray-900">${item.price * item.quantity} CUP</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer (Total y Checkout) */}
        {items.length > 0 && (
          <div className="border-t border-primary/10 p-6 bg-gray-50/50">
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Subtotal ({items.length} productos)</span>
                <span>${getTotalPrice()} CUP</span>
              </div>
              <div className="flex justify-between text-gray-600 text-sm">
                <span>Envío</span>
                <span className="text-xs bg-gray-200 px-2 py-0.5 rounded-full">A coordinar</span>
              </div>
              <div className="flex justify-between font-display font-bold text-xl pt-3 border-t border-gray-200 text-gray-900">
                <span>Total Estimado</span>
                <span className="text-primary">${getTotalPrice()} CUP</span>
              </div>
            </div>
            <button 
              onClick={handleCheckout}
              className="btn-primary w-full py-4 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/20 hover:-translate-y-0.5 transition-all"
            >
               Completar pedido por WhatsApp <Icon name="PaperAirplaneIcon" size={18} />
            </button>
            <p className="text-center text-xs text-gray-500 mt-4">
              <Icon name="LockClosedIcon" size={12} className="inline mr-1" /> Sin compromiso. El pago se coordina en WhatsApp.
            </p>
          </div>
        )}
      </div>
    </>
  );
}