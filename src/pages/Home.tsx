import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '../components/ui/AppImage';
import Icon from '../components/ui/AppIcon';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

function HeroSection() {
  const heroRef = useRef<HTMLElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('revealed'); });
    }, { threshold: 0.1 });
    const elements = heroRef.current?.querySelectorAll('.reveal-hidden');
    elements?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden bg-gradient-blush noise-overlay">
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-12 gap-12 items-center relative z-10">
        <div className="lg:col-span-6 space-y-6 md:space-y-8 text-center lg:text-left flex flex-col items-center lg:items-start">
          <div className="reveal-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full badge-rose text-xs font-semibold tracking-wide">
            <Icon name="SparklesIcon" size={12} variant="solid" className="text-primary" /> Skincare de Lujo Botánico
          </div>
          <h1 className="reveal-hidden font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-foreground" style={{ transitionDelay: '100ms' }}>
            Tu piel merece<br /><span className="italic text-gradient-rose">lo mejor</span><br />del mundo
          </h1>
          <p className="reveal-hidden text-base sm:text-lg text-foreground-muted leading-relaxed max-w-md" style={{ transitionDelay: '200ms' }}>
            Serums, cremas y rituales formulados con extractos botánicos puros de microfarmas sostenibles. Resultados visibles en 7 días.
          </p>
          <div className="reveal-hidden flex flex-wrap gap-4 justify-center lg:justify-start" style={{ transitionDelay: '400ms' }}>
            <Link to="/shop" className="btn-primary px-8 py-4 rounded-2xl text-sm font-semibold inline-flex items-center gap-2.5 shadow-rose-md">
              <span>Explorar Tienda</span><Icon name="ArrowRightIcon" size={16} variant="outline" />
            </Link>
          </div>
        </div>
        <div className="lg:col-span-6 relative h-[400px] sm:h-[480px] md:h-[620px] reveal-hidden flex justify-center lg:justify-end items-center" style={{ transitionDelay: '150ms' }}>
          <div className="w-[85%] sm:w-[70%] lg:w-[65%] xl:w-[58%] aspect-[4/5] rounded-3xl md:rounded-5xl overflow-hidden img-frame z-10 animate-float lg:absolute lg:right-0 lg:top-1/2 lg:-translate-y-1/2">
            <AppImage src="https://img.rocket.new/generatedImages/rocket_gen_img_13094096f-1772154229875.png" alt="Crema de lujo" className="w-full h-full object-contain product-img" />
          </div>
        </div>
      </div>
    </section>
  );
}

function BestSellersSection() {
  const [bestsellers, setBestsellers] = useState<any[]>([]);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    supabase.from('products').select('*').eq('is_available', true).eq('is_bestseller', true).then(({data}) => { setBestsellers(data || []); });
  }, []);

  const handleAddToCart = (product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url,
      quantity: 1
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => { setAddedItems((prev) => ({ ...prev, [product.id]: false })); }, 2000);
  };

  if (bestsellers.length === 0) return null;

  return (
    <section className="py-20 px-6 bg-white/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 md:mb-12">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground">
            Los Más <span className="italic text-gradient-rose">Vendidos</span>
          </h2>
          <div className="hidden sm:flex gap-2">
            {/* Arrows for scrolling (visual only for pure CSS snap scroll) */}
            <span className="text-sm font-semibold text-gray-500">Desliza para ver más &rarr;</span>
          </div>
        </div>
        
        <div className="flex overflow-x-auto gap-6 pb-8 snap-x snap-mandatory hide-scrollbar" style={{ scrollbarWidth: 'none' }}>
          {bestsellers.map((product, idx) => (
            <article key={product.id} className="min-w-[260px] sm:min-w-[300px] w-full max-w-[300px] snap-center shrink-0 product-card bg-white rounded-4xl overflow-hidden shadow-card border border-primary/5 group" style={{ animationDelay: `${idx * 60}ms` }}>
              <div className="relative aspect-[4/5] overflow-hidden bg-blush-light/30">
                <AppImage src={product.image_url} alt={product.name} fill className="object-contain p-2 product-img" />
                <div className="absolute top-3 left-3 bg-yellow-400 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm flex items-center gap-1">
                  ⭐ Top Ventas
                </div>
                {product.discount_price && (
                  <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm">
                    Oferta
                  </div>
                )}
              </div>
              <div className="p-5">
                <h2 className="font-display text-base font-semibold text-foreground mb-1.5 leading-snug line-clamp-1">{product.name}</h2>
                <div className="flex items-center justify-between mt-4">
                  <div className="flex flex-col">
                    {product.discount_price ? (
                      <>
                        <span className="text-xs text-gray-400 line-through">${product.price} CUP</span>
                        <span className="font-display text-xl font-bold text-primary">${product.discount_price} CUP</span>
                      </>
                    ) : (
                      <span className="font-display text-xl font-bold text-foreground">${product.price} CUP</span>
                    )}
                  </div>
                  <button onClick={() => handleAddToCart(product)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 inline-flex items-center gap-1.5 ${addedItems[product.id] ? 'bg-green-500 text-white shadow-sm' : 'btn-primary shadow-rose-sm'}`}>
                    {addedItems[product.id] ? "Agregado" : "Agregar"}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CombosSection() {
  const [combos, setCombos] = useState<any[]>([]);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    supabase.from('combos').select('*').eq('is_active', true).then(({data}) => { setCombos(data || []); });
  }, []);

  const handleAddToCart = (combo: any) => {
    addItem({
      id: combo.id,
      name: `(COMBO) ${combo.name}`,
      price: combo.price,
      image_url: combo.image_url,
      quantity: 1
    });
    setAddedItems((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => { setAddedItems((prev) => ({ ...prev, [combo.id]: false })); }, 2000);
  };

  if (combos.length === 0) return null;

  return (
    <section className="py-24 px-6 relative overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-10 md:mb-14 text-center">
          Rituales <span className="italic text-gradient-rose">curados</span><br />para ti
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {combos.map(combo => (
            <div key={combo.id} className="bg-white p-4 sm:p-5 rounded-3xl shadow-card transition-all hover:-translate-y-2 flex flex-col h-full border border-primary/5">
              <div className="relative mb-4 rounded-xl overflow-hidden bg-blush-light/30">
                <AppImage src={combo.image_url} alt={combo.name} className="w-full h-56 object-contain p-2 bg-white" />
                <div className="absolute top-3 left-3 bg-primary text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm uppercase tracking-wide">
                  Combo Especial
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <h3 className="font-display font-bold text-lg mb-2 text-gray-900">{combo.name}</h3>
                <p className="text-sm text-gray-500 mb-4 flex-1">{combo.description}</p>
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <p className="font-display text-xl font-bold text-primary">${combo.price} CUP</p>
                  <button onClick={() => handleAddToCart(combo)} className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 inline-flex items-center gap-1.5 ${addedItems[combo.id] ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}>
                    {addedItems[combo.id] ? "Agregado" : "Agregar"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-12 text-center">
           <Link to="/shop" className="btn-secondary px-6 py-3 rounded-xl text-sm font-semibold inline-flex items-center gap-2">Ver todos los productos <Icon name="ArrowRightIcon" size={14} variant="outline" /></Link>
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('categories').select('*').limit(5).then(({data}) => { setCategories(data || []); });
  }, []);

  return (
    <section className="py-16 md:py-24 px-6 bg-white/50">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-10 md:mb-14 text-center">
          Encuentra tu <span className="italic text-gradient-rose">ritual perfecto</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map(cat => (
             <Link key={cat.id} to={`/shop?category=${cat.id}`} className="block relative h-36 md:h-48 rounded-2xl overflow-hidden group shadow-card">
               <div className="absolute inset-0 bg-primary/20 group-hover:bg-primary/40 transition-all z-10" />
               <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20 text-white font-bold text-lg md:text-xl drop-shadow-md text-center px-2 w-full">{cat.name}</div>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-16 md:py-24 px-4 sm:px-6" aria-label="Llamada a la acción">
      <div className="max-w-5xl mx-auto relative rounded-[2rem] md:rounded-5xl overflow-hidden shadow-rose-xl" style={{ background: 'linear-gradient(135deg, #880E4F 0%, #C2185B 40%, #E91E8C 70%, #D4956A 100%)' }}>
        <div className="relative z-10 px-6 py-12 md:px-8 md:py-16 text-center text-white">
          <h2 className="font-display text-3xl sm:text-4xl md:text-6xl font-semibold leading-tight mb-4 md:mb-6">Tu mejor capítulo de<br /><span className="italic">belleza</span> empieza aquí</h2>
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto mb-8 md:mb-10">Únete a más de 2,400 mujeres que ya transformaron su piel.</p>
          <div className="flex gap-4 justify-center">
            <Link to="/shop" className="bg-white text-primary px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all">Explorar Colección</Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <main className="bg-gradient-blush min-h-screen">
      <HeroSection />
      <BestSellersSection />
      <CombosSection />
      <CategoriesSection />
      <CtaSection />
    </main>
  );
}