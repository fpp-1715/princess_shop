import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import AppImage from '../components/ui/AppImage';
import Icon from '../components/ui/AppIcon';
import { supabase } from '../lib/supabase';
import { useCartStore } from '../store/cartStore';

function ProductSkeleton() {
  return (
    <div className="bg-white rounded-5xl overflow-hidden shadow-card border border-primary/5">
      <div className="skeleton aspect-[4/5]" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-4 rounded-full w-1/3" />
        <div className="skeleton h-5 rounded-full w-3/4" />
        <div className="skeleton h-4 rounded-full w-full" />
        <div className="skeleton h-4 rounded-full w-2/3" />
        <div className="flex justify-between mt-4">
          <div className="skeleton h-6 rounded-full w-1/4" />
          <div className="skeleton h-9 rounded-xl w-1/3" />
        </div>
      </div>
    </div>
  );
}

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([{ id: 'all', name: 'Todos' }]);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [addedItems, setAddedItems] = useState<Record<string, boolean>>({});
  const addItem = useCartStore((s) => s.addItem);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'all');
  }, [searchParams]);

  useEffect(() => {
    async function fetchData() {
      const [catsRes, prodsRes] = await Promise.all([
        supabase.from('categories').select('*'),
        supabase.from('products').select('*, categories(name)')
      ]);
      if (catsRes.data) setCategories([{ id: 'all', name: 'Todos' }, ...catsRes.data]);
      if (prodsRes.data) {
        setProducts(prodsRes.data.map((prod: any) => ({
          ...prod,
          category_name: prod.categories?.name,
          rating: 4.8,
          reviews: Math.floor(Math.random() * 200) + 50
        })));
      }
      setLoading(false);
    }
    fetchData();
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = selectedCategory === 'all' || p.category_id === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.category_name && p.category_name.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCat && matchSearch;
  });

  const handleAddToCart = useCallback((product: any) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.discount_price || product.price,
      image_url: product.image_url,
      quantity: 1
    });
    setAddedItems((prev) => ({ ...prev, [product.id]: true }));
    setTimeout(() => {
      setAddedItems((prev) => ({ ...prev, [product.id]: false }));
    }, 2000);
  }, [addItem]);

  return (
    <main className="bg-gradient-blush min-h-screen">
      <section className="pt-28 md:pt-32 pb-10 md:pb-12 px-6 relative overflow-hidden" style={{ background: 'linear-gradient(145deg, #FFF8FB 0%, #FCE4EC 50%, #FFF3E8 100%)' }}>
        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-blush/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-rose text-xs font-semibold mb-4">
            <Icon name="ShoppingBagIcon" size={12} variant="outline" className="text-primary" />
            Colección Completa
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl font-semibold text-foreground mb-4 leading-tight">
            Nuestra <span className="italic text-gradient-rose">Tienda</span>
          </h1>
        </div>
      </section>
      <section className="sticky top-16 md:top-20 z-30 bg-white/80 backdrop-blur-md border-b border-primary/8 px-4 sm:px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap justify-center md:justify-start gap-2 w-full md:w-auto">
            {categories.map((cat) => (
              <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`category-pill px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${selectedCategory === cat.id ? 'bg-primary text-white shadow-rose-sm' : 'bg-blush-light/60 text-foreground-muted hover:bg-primary hover:text-white'}`}>
                {cat.name}
              </button>
            ))}
          </div>
          <div className="relative flex-shrink-0 w-full md:w-auto">
            <Icon name="MagnifyingGlassIcon" size={16} variant="outline" className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground-subtle" />
            <input type="search" placeholder="Buscar productos..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="form-input pl-9 pr-4 py-2.5 rounded-xl text-sm w-full md:w-64 text-foreground" />
          </div>
        </div>
      </section>
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => <ProductSkeleton key={i} />)}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filtered.map((product, idx) => (
                <article key={product.id} className="product-card bg-white rounded-5xl overflow-hidden shadow-card border border-primary/5 group" style={{ animationDelay: `${idx * 60}ms` }}>
                  <div className="relative aspect-[4/5] overflow-hidden bg-blush-light/30">
                    <AppImage src={product.image_url} alt={product.name} fill className="object-cover product-img" />
                    {product.is_bestseller && (
                      <div className="absolute top-3 left-3 bg-yellow-400 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        ⭐ Top
                      </div>
                    )}
                    {product.discount_price && (
                      <div className="absolute top-3 right-3 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        Oferta
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="px-2.5 py-0.5 rounded-full badge-rose text-[10px] font-semibold">{product.category_name}</span>
                    </div>
                    <h2 className="font-display text-base font-semibold text-foreground mb-1.5 leading-snug">{product.name}</h2>
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
          )}
        </div>
      </section>
    </main>
  );
}
