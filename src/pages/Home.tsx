import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import AppImage from '../components/ui/AppImage';
import Icon from '../components/ui/AppIcon';
import CustomProductModal from '../components/CustomProductModal';
import ProductDetailModal from '../components/ProductDetailModal';
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
    <section ref={heroRef} className="relative min-h-screen flex items-center pt-28 pb-16 overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuA2LfENYLviPQJa4z-wIsDfHstqXizwaEJJSmhBQQ1ft2ZJRJOWI6hb4hCX5NXVqLDTQnXMVmTvy2lF6LKjj-sSUtX1dqpUzs081PAIE8xRk9dev3YwsCAhKY7EvfeRPyISppR3-EYqKBDN3dJTLzAVXxBfQ76yPsv_pAtOQdidfySjBDKd97sJyWQmwB2fMTlxij3lGLuIfG42d6Th-eoIayzFQUsombscvohnTgHtLxmDyiEdkLnAgrMEC4Z0HJ6MD4bRA1SQkL9n" alt="Hero Background" className="w-full h-full object-cover object-[center_20%]" />
        <div className="absolute inset-0 bg-gradient-to-r from-white/90 via-white/70 to-white/30 backdrop-blur-[2px]"></div>
      </div>
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 w-full">
        <div className="space-y-6 md:space-y-8 text-left flex flex-col items-start pt-10 md:pt-0">
          <div className="reveal-hidden inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 border border-rose-200 text-primary text-xs font-semibold tracking-wide shadow-sm">
            <Icon name="SparklesIcon" size={12} variant="solid" /> Skincare de lujo en Santa Clara
          </div>
          <h1 className="reveal-hidden font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold leading-[1.05] tracking-tight text-gray-900" style={{ transitionDelay: '100ms' }}>
            Tu piel merece<br /><span className="italic text-rose-500">lo mejor</span><br />del mundo
          </h1>
          <p className="reveal-hidden text-base sm:text-lg text-gray-700 leading-relaxed max-w-lg" style={{ transitionDelay: '200ms' }}>
            Creemos que la belleza no tiene reglas. Por eso seleccionamos los mejores productos de maquillaje y skincare para que brilles con tu propia esencia. Calidad, tendencia y amor por lo que hacemos… todo en un solo lugar.
          </p>
          <div className="reveal-hidden flex flex-wrap gap-4" style={{ transitionDelay: '400ms' }}>
            <Link to="/shop" className="btn-primary px-8 py-4 rounded-full text-sm font-bold inline-flex items-center gap-2.5 shadow-rose-md hover:scale-105 transition-transform">
              <span>Explorar Tienda</span><Icon name="ArrowRightIcon" size={16} variant="outline" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function FeaturedProductsSection() {
  const [activeTab, setActiveTab] = useState<'popular' | 'new' | 'sale'>('popular');
  const [products, setProducts] = useState<any[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [customizingProduct, setCustomizingProduct] = useState<any | null>(null);
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    let query = supabase.from('products').select('*').eq('is_available', true);
    if (activeTab === 'popular') {
      query = query.eq('is_bestseller', true).limit(8);
    } else if (activeTab === 'new') {
      query = query.order('created_at', { ascending: false }).limit(8);
    } else if (activeTab === 'sale') {
      query = query.not('discount_price', 'is', null).limit(8);
    }
    
    query.then(({data}) => { setProducts(data || []); });
  }, [activeTab]);

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

  return (
    <>
      <section className="py-20 px-6 bg-white/40">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-6">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-foreground text-center md:text-left">
            Descubre <span className="italic text-gradient-rose">Tus Favoritos</span>
          </h2>
          
          <div className="flex flex-wrap justify-center bg-white border border-rose-100 p-1.5 rounded-[2rem] shadow-sm gap-1">
            <button 
              onClick={() => setActiveTab('popular')} 
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'popular' ? 'bg-primary text-white shadow-rose-sm' : 'text-gray-500 hover:text-primary'}`}>
              Más Popular
            </button>
            <button 
              onClick={() => setActiveTab('new')} 
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'new' ? 'bg-primary text-white shadow-rose-sm' : 'text-gray-500 hover:text-primary'}`}>
              Nuevo
            </button>
            <button 
              onClick={() => setActiveTab('sale')} 
              className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all ${activeTab === 'sale' ? 'bg-primary text-white shadow-rose-sm' : 'text-gray-500 hover:text-primary'}`}>
              En Oferta
            </button>
          </div>
        </div>
        
        {products.length === 0 ? (
          <div className="text-center text-gray-500 py-12 bg-white/50 rounded-[2rem] border border-rose-50/50 shadow-sm">
            No hay productos disponibles en esta sección por ahora.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-6">
            {products.map((product, idx) => (
              <article key={product.id} className="product-card bg-white rounded-5xl overflow-hidden shadow-card border border-primary/5 group" style={{ animationDelay: `${idx * 60}ms` }} onClick={() => setSelectedProduct(product)}>
                <div className="relative aspect-[4/5] overflow-hidden bg-blush-light/30">
                  <AppImage src={product.image_url} alt={product.name} fill className="object-contain p-2 product-img" />
                  {product.is_bestseller && activeTab !== 'popular' && (
                    <div className="absolute top-3 left-3 bg-yellow-400 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm">⭐ Top</div>
                  )}
                  {product.discount_price && (
                    <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm">Oferta</div>
                  )}
                  {activeTab === 'new' && (
                    <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] uppercase font-bold px-2 py-1 rounded-full shadow-sm">Nuevo</div>
                  )}
                </div>
                <div className="p-5">
                  <h2 className="font-display text-base font-semibold text-gray-900 mb-1.5 leading-snug line-clamp-1 hover:text-primary transition-colors">{product.name}</h2>
                  <div className="flex items-center justify-between mt-5">
                    <div className="flex flex-col">
                      {product.discount_price ? (
                        <>
                          <span className="text-xs text-gray-400 line-through">${product.price} CUP</span>
                          <span className="font-display text-xl font-bold text-primary">${product.discount_price} CUP</span>
                        </>
                      ) : (
                        <span className="font-display text-xl font-bold text-gray-900">${product.price} CUP</span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {product.is_customizable ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(product);
                          }}
                          className={`flex-1 min-w-[100px] flex items-center justify-center text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 ${addedItems[product.id] ? 'bg-green-500 text-white shadow-sm' : 'btn-primary shadow-rose-sm'}`}
                        >
                          {addedItems[product.id] ? "Agregado" : "Agregar"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setCustomizingProduct(product);
                          }}
                          className="flex-1 min-w-[100px] flex items-center justify-center text-center py-2 px-3 rounded-xl text-xs font-bold transition-all duration-300 bg-gray-800 text-white hover:bg-gray-900 shadow-sm"
                        >
                          Personalizar
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        className={`w-full flex items-center justify-center text-center py-2 px-4 rounded-xl text-xs font-bold transition-all duration-300 ${addedItems[product.id] ? 'bg-green-500 text-white shadow-sm' : 'btn-primary shadow-rose-sm'}`}
                      >
                        {addedItems[product.id] ? "Agregado" : "Agregar"}
                      </button>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
      {customizingProduct && (
        <CustomProductModal
          product={customizingProduct}
          onClose={() => setCustomizingProduct(null)}
          onAddToCart={(item) => {
            addItem(item);
            setCustomizingProduct(null);
          }}
        />
      )}
      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onAddToCart={(item) => {
            addItem({
              id: item.id,
              name: item.name,
              price: item.discount_price || item.price,
              image_url: item.image_url,
              quantity: 1
            });
            setSelectedProduct(null);
          }}
          onCustomize={(product) => {
            setSelectedProduct(null);
            setCustomizingProduct(product);
          }}
        />
      )}
    </>
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
    addItem({ id: combo.id, name: `(COMBO) ${combo.name}`, price: combo.price, image_url: combo.image_url, quantity: 1 });
    setAddedItems((prev) => ({ ...prev, [combo.id]: true }));
    setTimeout(() => { setAddedItems((prev) => ({ ...prev, [combo.id]: false })); }, 2000);
  };

  if (combos.length === 0) return null;

  return (
    <section className="py-24 px-6 relative overflow-hidden bg-rose-50/30 border-t border-b border-rose-100/50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground leading-tight mb-4">
            Rituales <span className="italic text-gradient-rose">Curados</span> para ti
          </h2>
          <p className="text-gray-500 text-sm md:text-base">Conjuntos seleccionados de productos que trabajan en sinergia para maximizar los beneficios en tu piel.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {combos.map(combo => (
            <div key={combo.id} className="bg-white p-5 rounded-[2rem] shadow-card transition-all hover:-translate-y-2 flex flex-col h-full border border-primary/5 group">
              <div className="relative mb-6 rounded-3xl overflow-hidden bg-blush-light/30">
                <AppImage src={combo.image_url} alt={combo.name} className="w-full h-64 object-contain p-4 bg-white transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute top-4 left-4 bg-primary text-white text-[10px] uppercase font-bold px-3 py-1.5 rounded-full shadow-sm tracking-wide">
                  Combo Especial
                </div>
              </div>
              <div className="flex-1 flex flex-col px-2 pb-2">
                <h3 className="font-display font-bold text-xl mb-2 text-gray-900">{combo.name}</h3>
                <p className="text-sm text-gray-500 mb-6 flex-1 leading-relaxed">{combo.description}</p>
                <div className="flex items-center justify-between pt-5 border-t border-gray-100 mt-auto">
                  <p className="font-display text-2xl font-bold text-primary">${combo.price} CUP</p>
                  <button onClick={() => handleAddToCart(combo)} className={`px-5 py-3 rounded-xl text-sm font-bold transition-all duration-300 inline-flex items-center gap-1.5 ${addedItems[combo.id] ? 'bg-green-500 text-white shadow-sm' : 'bg-gray-900 text-white hover:bg-gray-800 shadow-md'}`}>
                    {addedItems[combo.id] ? "Agregado" : "Agregar Combo"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CategoriesSection() {
  const [categories, setCategories] = useState<any[]>([]);
  useEffect(() => {
    supabase.from('categories').select('*').limit(6).then(({data}) => { setCategories(data || []); });
  }, []);

  const categoryImages = [
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCfd9G52r9aA4fJN-Erf4v1JETlkp2dh8zCggCE9-_mPSuDqqJe3CF0J4NOP6mZNeaEw7OaBMOLk1XI7wmNCZkVJSZAgr78fgFBy6Hm-IALK0KjNCurlqAraedA0huaurDZPGgl0V_9bi075INQI9fzv5--A7bpLwZCG9_tGpsT5290ZoYEjOAcYAPEsArRqLKL7dm_e2eir-x-_mz-U2v5VZi28AamdTWPq5vh1kzKB4ulTokjf_rQdSovtwrVImE15QjsI0YzzWEf",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuBK5ppg1sWiy6U0gU842JpZeTUDNIvinP0E9PDM_6gTTXpmIYv68ZpkeQN1ugHGDwmYT2YC6ONQfg0PYCn8LEZbj5ivkCulmn7ws5kObCkmWeKCVU3aTWrK0u02RzJOrluLbRCatxcrJ6VmFBL_qMOQxwMOX875UxEc_8DRCnBJx2m0RkxyU997h1WGzt1YqQdA3FIeAEesCb3IQ1dOU23iPFV8wjPPv6Eq3ovk0GEwBp0uYCA17DjerwK5e_Rq_WhIJdLJLWBqoe3x",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuC8EUyZ0677kVzqvGEGaAgS92TY1YpoEZJ1h1EMXbi5gMtWqZsiFiF-GCdvh3IxgayhqdcfrLV3Uw7b4ixWFkNWPDLKLUS4fGOj7EeDIkyndcCy8nY6OfYDxNgrPQYOCobIT60RSXG6Yil80wkKrVb2klDPKAB_XKGOWORQ5nhlCVbASXrb0R0jukb4GjRo1_qXscTJyyHD5j_EYvdpFm6M-n0NVLDK20i7EU-9LqTi9C9Zs4TAUknmOYZNFhbdAQhIV5Zsal8tfOaD",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuCQJfpa3gwVN_8m2k7bTSVyylyirz-ZCJtz_aryEorykEWl8qHVIHgFBa3nKpYnbQIUX0OM2f6ckLNRwqLra3boJtJ1rgcrx7br9gCw0A6nILf342Ho3fKdsX1Aivobu1N_Hk-e810anvTlLVx8Suy7JocXUlhMl4QF5LdEe5NvJ9ScOcCtzAWkHEet3dGTalxOcQRyDjle-gGl94E08mgJa_wOEgHCizY0jQIRwJVQmaAXFbk3Rc62c5CbyodzhViyTwmcfS8QNtvz",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuDjTQix1DFA-HNtX1pNlRdQoL2wz0bk2w1pB4-2lq4xO0gXaJ6qqiRZGC25o0CKdQ9SR7a4U3vw1xCJTa-UbLbzCNJDZKYilVBB9N645PSWKyF5leYeixLtVK4eDM0ELSMPiXnx6xewL5Yw0hut8_nuXCkcloAyhgxEmOwPRCxUxMDIj2yvLKTXLR5S803gzk6F_2wg4VVyogtNzipeopEzQIzP4cEiRkPCGr4BKvUq0cK50mXnd954dtx5ILh_wj2LlMuGz_6OCQdy",
    "https://lh3.googleusercontent.com/aida-public/AB6AXuAMgRM98i1LVGw0GdOZzF_WMQ_HbimY51BvJrdY-BnFKUNV-_eQYfjNOYZwnvefxJUI20TZ_0R0PbvBxqKuHPnT8V8i27RAOGkBKwy2fqvxMVC1O1xOnyEtFJ_YvbgBgfA84fUFig5DvSTTzaDdtN1XItXmawn0k3w3WyD1c53wlyY2CQl0X_HSSgPozWwfHCKJZS2vDvJCpTaF8xI_UWIF1vFc9tfIf8YKC14TaaVEBu8mT4sE-QOTXTNF5OaS9guy6m1d5DgOhPKv"
  ];

  return (
    <section className="py-24 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-14 text-center">
          Encuentra tu <span className="italic text-gradient-rose">categoría ideal</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 p-4 rounded-[2rem] bg-rose-50/30">
          {categories.map((cat, idx) => (
             <Link key={cat.id} to={`/shop?category=${cat.id}`} className="block relative h-32 md:h-40 rounded-[1.5rem] overflow-hidden group shadow-sm bg-white border border-rose-100/50 transition-all hover:shadow-md hover:-translate-y-1">
               <img src={categoryImages[idx % categoryImages.length]} alt={cat.name} className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" />
               <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity z-10" />
               <div className="absolute inset-0 flex flex-col justify-end p-4 z-20 text-white font-display font-medium text-base md:text-lg text-center w-full">
                 <span className="drop-shadow-md group-hover:-translate-y-1 transition-transform">{cat.name}</span>
               </div>
             </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhilosophySection() {
  return (
    <section className="py-32 px-6 relative overflow-hidden bg-gray-900">
      <div className="absolute inset-0 z-0">
        <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuDbthALabkZThU7BSGI37aE9-H2GjgczoAd22XctLZP84gKsyvI-z5VRV7AXRLXGSjrG_cYtAhO9s2E9ePOmg0YlT0FCY3COO4epO6862nTM9Q69jcP73a-QKtQL9ga8Oxo-LGk5iskb8UwAE6suu_B1FAcmhVvHXMG1RPp5aHuiP9rxIj4zwBDuv8Ux-3kxCJVZPi8M-vxAyTzIvZZeEyIj1RI8NGxl49_u1ERl769dA1bO7-m_H4Pyv2QQTU5Cn1uy54LuChb_J3F" alt="Skincare natural" className="w-full h-full object-cover opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
      </div>
      <div className="max-w-4xl mx-auto text-center space-y-8 relative z-10">
        <Icon name="HeartIcon" variant="solid" size={48} className="text-rose-400 mx-auto" />
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-white">
          Nuestra Filosofía
        </h2>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed max-w-2xl mx-auto">
          Sin filtros, sin reglas, sin miedo. Celebramos la belleza real: la que se divierte, experimenta, se equivoca y aprende. Nuestra filosofía es simple: amamos lo que hacemos y queremos que tú también ames lo que usas. Porque maquillaje y skincare no son rutinas… son momentos para ti.
        </p>
      </div>
    </section>
  );
}

function TestimonialsSection() {
  const testimonials = [
    { name: 'María C.', review: 'Nunca había sentido mi piel tan hidratada. El serum de vitamina C cambió mi rutina por completo.', rating: 5 },
    { name: 'Laura G.', review: 'El envasado es hermoso y la calidad es indiscutible. Recomiendo totalmente los combos especiales.', rating: 5 },
    { name: 'Ana P.', review: 'Estos productos me ayudaron a minimizar las manchas en mi rostro de una forma súper natural.', rating: 4 },
  ];

  return (
    <section className="py-24 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-foreground mb-4 text-center">
          Lo que dicen <span className="italic text-gradient-rose">nuestras clientas</span>
        </h2>
        <p className="text-center text-gray-500 mb-16 max-w-2xl mx-auto">Experiencias reales de mujeres que transformaron su piel con nosotros.</p>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((t, idx) => (
            <div key={idx} className="bg-rose-50/30 p-8 rounded-[2rem] border border-rose-100 flex flex-col items-center text-center shadow-sm">
              <div className="flex gap-1.5 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Icon key={i} name="StarIcon" variant="solid" size={20} className={i < t.rating ? 'text-yellow-400' : 'text-gray-200'} />
                ))}
              </div>
              <p className="italic text-gray-600 mb-8 text-lg flex-1 leading-relaxed">"{t.review}"</p>
              <div className="w-12 h-1 bg-primary/20 rounded-full mb-5"></div>
              <h4 className="font-display font-semibold text-gray-900">— {t.name}</h4>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CtaSection() {
  return (
    <section className="py-24 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden shadow-rose-lg border border-white/60">
        <div className="absolute inset-0 z-0">
          <img src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8BPofG1utkOedxRfg0L6u-mXizAgQJfD3jUiNH--BAJivEHrFLeKQsptg1U8Di5lyf89fYE3Ty96mtOF5e3TZW-aMhQE7Rv0mgoNsB5QxxoJTY57etfxlYpv4_JLGDHYSrDGq5zyxOWNVTIfx5xZBJmyJQHXMLGQ0BKZfNk0AKnHCCgSuHOg88Jy9qEK22TZW0WLXbThxc0ekNocwlGbD01Q61_GKiBmHL7_TtgGux9EZ8FWpssqbrDrbNGhfngz_5uSEsbjHyvzH" alt="Beauty close up" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-r from-rose-200/90 to-blush-light/90 backdrop-blur-sm"></div>
        </div>
        
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-white/40 blur-3xl rounded-full z-0" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-64 h-64 bg-primary/10 blur-3xl rounded-full z-0" />
        
        <div className="relative z-10 space-y-8">
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold text-gray-900 drop-shadow-sm">
            ¿Lista para revelar tu <span className="italic text-rose-600">mejor versión</span>?
          </h2>
          <p className="text-gray-800 font-medium text-lg sm:text-xl max-w-xl mx-auto text-balance drop-shadow-sm">
            Únete a cientos de mujeres que ya han transformado su rutina de belleza con nuestros productos.
          </p>
          <div className="pt-4">
            <Link to="/shop" className="btn-primary px-10 py-4 rounded-full text-base font-bold inline-flex items-center gap-3 shadow-rose-md hover:scale-105 transition-transform">
              <span className="font-bold">Comenzar mi Ritual</span> <Icon name="ArrowRightIcon" size={18} variant="outline" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  return (
    <div className="bg-gradient-blush min-h-screen">
      <HeroSection />
      <FeaturedProductsSection />
      <CombosSection />
      <CategoriesSection />
      <PhilosophySection />
      <TestimonialsSection />
      <CtaSection />
    </div>
  );
}
