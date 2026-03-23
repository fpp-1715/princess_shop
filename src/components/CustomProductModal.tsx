import { useState, useMemo, useEffect } from 'react';
import Icon from './ui/AppIcon';
import AppImage from './ui/AppImage';
import { supabase } from '../lib/supabase';

export default function CustomProductModal({ product, onClose, onAddToCart }: { product: any, onClose: () => void, onAddToCart: (customizedProduct: any) => void }) {
  // Inicializamos los productos seleccionados basados en included_products
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>(product.included_products || []);
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    supabase.from('products').select('*')
      .eq('is_customizable', false)
      .eq('is_available', true)
      .then(({data}) => {
        if (data) setAllProducts(data);
        setLoading(false);
      });
  }, []);

  // Calculamos el precio total: suma de productos seleccionados + 500 CUP
  const totalPrice = useMemo(() => {
    let total = 0;
    selectedProductIds.forEach(id => {
      const p = allProducts.find(prod => prod.id === id);
      if (p) total += (p.discount_price || p.price);
    });
    total += 500; // adicional por personalización
    return total;
  }, [selectedProductIds, allProducts]);

  const toggleProduct = (id: string) => {
    setSelectedProductIds(prev => 
      prev.includes(id) ? prev.filter(pid => pid !== id) : [...prev, id]
    );
  };

  const handleConfirm = () => {
    const includedProdNames = selectedProductIds.map(id => {
      const p = allProducts.find(prod => prod.id === id);
      return p ? p.name : '';
    }).filter(Boolean);

    // Creamos un producto "virtual" para el carrito
    const customItem = {
      id: `${product.id}-${Date.now()}`, // ID unico para no mezclar con arreglos vacios
      name: `${product.name} (Personalizado: ${includedProdNames.join(', ')})`,
      price: totalPrice,
      image_url: product.image_url,
      quantity: 1
    };
    onAddToCart(customItem);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center bg-black/50 backdrop-blur-sm sm:p-4">
      <div className="bg-white w-full sm:w-auto sm:min-w-[500px] max-w-2xl sm:rounded-3xl rounded-t-3xl max-h-[90vh] flex flex-col shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <div>
            <h3 className="font-display font-bold text-xl text-gray-900">Personaliza tu {product.name}</h3>
            <p className="text-sm text-gray-500 mt-1">Selecciona lo que incluye</p>
          </div>
          <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors">
            <Icon name="XMarkIcon" size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1 bg-gray-50">
          <p className="text-sm font-medium text-gray-700 mb-4">Selecciona los productos que quieres incluir dentro:</p>
          {loading ? (
            <div className="text-center py-10 text-gray-500">Cargando productos...</div>
          ) : (
            <div className="space-y-3">
              {allProducts.map(p => {
              const isSelected = selectedProductIds.includes(p.id);
              const pPrice = p.discount_price || p.price;
              
              return (
                <label key={p.id} className={`flex items-center gap-4 p-3 rounded-2xl border-2 cursor-pointer transition-all ${isSelected ? 'border-primary bg-rose-50/50' : 'border-transparent bg-white hover:border-rose-100 shadow-sm'}`}>
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
                    <AppImage src={p.image_url} alt={p.name} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-gray-900 truncate">{p.name}</h4>
                    <p className="text-primary font-bold text-sm">+${pPrice} CUP</p>
                  </div>
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${isSelected ? 'border-primary bg-primary text-white' : 'border-gray-300'}`}>
                    {isSelected && <Icon name="CheckIcon" size={14} variant="solid" />}
                  </div>
                  <input type="checkbox" checked={isSelected} onChange={() => toggleProduct(p.id)} className="hidden" />
                </label>
              );
            })}
          </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-5 border-t border-gray-100 bg-white sm:rounded-b-3xl flex items-center justify-between gap-4">
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 font-medium">Total Calculado</span>
            <span className="font-display font-bold text-2xl text-primary">${totalPrice} CUP</span>
          </div>
          <button onClick={handleConfirm} className="btn-primary px-8 py-3.5 rounded-2xl font-bold shadow-rose-sm text-sm whitespace-nowrap">
            Agregar al Carrito
          </button>
        </div>
      </div>
    </div>
  );
}