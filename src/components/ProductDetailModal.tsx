import { useState } from 'react';
import Icon from './ui/AppIcon';
import AppImage from './ui/AppImage';

export default function ProductDetailModal({ product, onClose, onAddToCart, onCustomize }: { 
  product: any, 
  onClose: () => void, 
  onAddToCart: (product: any) => void, 
  onCustomize: (product: any) => void 
}) {
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    onAddToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-white w-full max-w-2xl rounded-3xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h3 className="font-display font-bold text-xl text-gray-900">Detalles del Producto</h3>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <Icon name="XMarkIcon" size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-shrink-0">
              <div className="relative w-full md:w-64 h-64 rounded-2xl overflow-hidden bg-gray-50">
                <AppImage src={product.image_url} alt={product.name} fill className="object-contain" />
              </div>
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2.5 py-0.5 rounded-full badge-rose text-[10px] font-semibold">{product.category_name}</span>
                {product.is_bestseller && <span className="text-yellow-500 text-lg">⭐</span>}
                {product.discount_price && <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">Oferta</span>}
              </div>
              <h2 className="font-display text-2xl font-semibold text-foreground mb-3">{product.name}</h2>
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{product.description}</p>
              )}
              <div className="flex flex-col gap-2">
                {product.discount_price ? (
                  <>
                    <span className="text-xs text-gray-400 line-through">${product.price} CUP</span>
                    <span className="font-display text-3xl font-bold text-primary">${product.discount_price} CUP</span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-bold text-foreground">${product.price} CUP</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-white rounded-b-3xl flex flex-wrap gap-3">
          <button onClick={handleAddToCart} className={`flex-1 min-w-[150px] flex justify-center items-center text-center px-6 py-3 rounded-2xl font-bold shadow-rose-sm text-sm ${added ? 'bg-green-500 text-white' : 'btn-primary'}`}>
            {added ? "Agregado" : "Agregar al Carrito"}
          </button>
          {product.is_customizable && (
            <button onClick={() => onCustomize(product)} className="flex-1 min-w-[150px] flex justify-center items-center text-center px-6 py-3 rounded-2xl font-bold bg-gray-600 text-white hover:bg-gray-700 text-sm">
              Personalizar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}