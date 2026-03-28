import { useCartStore } from '../store/cartStore';
import Icon from './ui/AppIcon';

export default function FloatingCartButton() {
  const totalItems = useCartStore((s) => s.getTotalItems());
  const openCart = useCartStore((s) => s.openCart);

  // Opcional: Ocultarlo si no hay items, pero según la sugerencia mejor tenerlo siempre que se pueda, o mostrarlo solo si hay items (elegiré mostrarlo siempre si lo pidieron como algo que siempre esté, o si no que aparezca fijo)
  // "quiero el boton del carrito flotando todo el tiempo en la parte de abajo a la derechad e la pantalla" => todo el tiempo. Por tanto, no haré return null si está en 0.

  return (
    <button
      onClick={openCart}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 bg-primary text-white rounded-full shadow-rose-lg hover:scale-110 hover:shadow-rose-xl transition-all duration-300"
      aria-label="Ver carrito"
    >
      <Icon name="ShoppingBagIcon" size={24} variant="outline" className="text-white" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-[11px] font-bold shadow-md border-2 border-white">
          {totalItems}
        </span>
      )}
    </button>
  );
}
