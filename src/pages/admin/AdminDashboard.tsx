import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Icon from '../../components/ui/AppIcon';
import imageCompression from 'browser-image-compression';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'products' | 'combos'>('products');
  
  // Data State
  const [products, setProducts] = useState<any[]>([]);
  const [combos, setCombos] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Modal State para Productos y Combos
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  const initialProductForm = {
    name: '', description: '', price: 0, image_url: '', category_id: '', 
    is_available: true, is_bestseller: false, discount_price: '' as number | string
  };
  const initialComboForm = {
    name: '', description: '', price: 0, image_url: '', is_active: true
  };

  const [formData, setFormData] = useState<any>(initialProductForm);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      navigate('/admin');
    } else {
      fetchData();
    }
  };

  const fetchData = async () => {
    setLoading(true);
    const [catsRes, prodsRes, combosRes] = await Promise.all([
      supabase.from('categories').select('*'),
      supabase.from('products').select('*, categories(name)').order('created_at', { ascending: false }),
      supabase.from('combos').select('*').order('created_at', { ascending: false })
    ]);
    if (catsRes.data) setCategories(catsRes.data);
    if (prodsRes.data) setProducts(prodsRes.data);
    if (combosRes.data) setCombos(combosRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  const handleOpenModal = (item: any = null) => {
    if (item) {
      setEditingId(item.id);
      if (activeTab === 'products') {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          image_url: item.image_url || '',
          category_id: item.category_id || '',
          is_available: item.is_available !== false,
          is_bestseller: item.is_bestseller || false,
          discount_price: item.discount_price || ''
        });
      } else {
        setFormData({
          name: item.name || '',
          description: item.description || '',
          price: item.price || 0,
          image_url: item.image_url || '',
          is_active: item.is_active !== false
        });
      }
    } else {
      setEditingId(null);
      if (activeTab === 'products') {
        setFormData({ ...initialProductForm, category_id: categories[0]?.id || '' });
      } else {
        setFormData({ ...initialComboForm });
      }
    }
    setIsModalOpen(true);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);

    try {
      // Comprimir la imagen antes de subir
      const compressedFile = await imageCompression(file, {
        maxSizeMB: 1, // Máximo 1MB
        maxWidthOrHeight: 1920, // Máximo 1920px de ancho o alto
        useWebWorker: true,
        fileType: 'image/webp' // Convertir a WebP para mejor compresión
      });

      const fileExt = 'webp'; // Forzar WebP
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `product-images/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, compressedFile);

      if (uploadError) {
        alert('Error subiendo imagen: ' + uploadError.message);
      } else {
        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        setFormData((prev: any) => ({ ...prev, image_url: data.publicUrl }));
      }
    } catch (error) {
      alert('Error comprimiendo imagen: ' + (error as Error).message);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const table = activeTab === 'products' ? 'products' : 'combos';
    
    // Preparar el payload - Solo enviamos lo que pertenece a la tabla respectiva
    const payload = { ...formData };
    
    // Si estamos guardando un combo, debemos eliminar las propiedades exclusivas de productos
    if (activeTab === 'combos') {
      delete payload.category_id;
      delete payload.is_available;
      delete payload.is_bestseller;
      delete payload.discount_price;
      delete payload.categories; // <- Eliminar esto si viene del fetch
    } else if (activeTab === 'products') {
      // Y si guardamos un producto, borramos la propiedad de combos
      delete payload.is_active;
      delete payload.categories; // <- supabase select(categories) nos lo puede haber incrustado. No enviarlo.
      
      // Si discount_price es string vacio, enviarlo como null a Supabase
      if (payload.discount_price === '') {
        payload.discount_price = null;
      }
      // Si category_id es string vacio, enviarlo como null
      if (payload.category_id === '') {
        payload.category_id = null;
      }
    }

    try {
      console.log('Payload to save:', payload); // Debug log
      
      let oldImageUrl: string | null = null;
      
      if (editingId) {
        const itemsList = activeTab === 'products' ? products : combos;
        const oldItem = itemsList.find((i: any) => i.id === editingId);
        if (oldItem && oldItem.image_url && oldItem.image_url !== payload.image_url) {
          // The image was changed, schedule the old one for deletion
          oldImageUrl = oldItem.image_url;
        }

        const { error } = await supabase.from(table).update(payload).eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase.from(table).insert([payload]);
        if (error) throw error;
      }

      // Si se subió una foto nueva y reemplazó la vieja, la limpiamos del storage
      if (oldImageUrl) {
        try {
          const path = oldImageUrl.split('/product-images/')[1];
          if (path) {
            await supabase.storage.from('products').remove([`product-images/${path}`]);
            console.log('Foto anterior eliminada correctamente');
          }
        } catch (error) {
          console.warn('Error eliminando foto anterior:', error);
        }
      }

      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      console.error('Save error:', err); // Debug log
      alert(`Error al guardar en ${table}: ` + err.message);
    }
  };

  const handleDelete = async (id: string, isProduct: boolean) => {
    const table = isProduct ? 'products' : 'combos';
    const items = isProduct ? products : combos;
    const item = items.find(i => i.id === id);
    
    if (window.confirm(`¿Estás seguro de eliminar este ${isProduct ? 'producto' : 'combo'}?`)) {
      // Primero eliminar la imagen si existe
      if (item && item.image_url) {
        try {
          const path = item.image_url.split('/product-images/')[1];
          if (path) {
            await supabase.storage.from('products').remove([`product-images/${path}`]);
          }
        } catch (error) {
          console.warn('Error eliminando imagen:', error);
          // No bloquear la eliminación del producto por error en imagen
        }
      }
      
      // Luego eliminar el registro de la base de datos
      await supabase.from(table).delete().eq('id', id);
      fetchData();
    }
  };

  if (loading && products.length === 0) return <div className="p-10 text-center">Cargando panel...</div>;

  return (
    <div className="min-h-screen bg-gray-50 pt-28 pb-10 px-4 md:px-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Admin */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-display font-bold text-foreground">Panel de Administrador</h1>
            <p className="text-sm text-gray-500">Gestiona tus productos y combos de Princess Shop</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => handleOpenModal()} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold flex items-center gap-2">
              <Icon name="PlusIcon" size={16} /> Nuevo {activeTab === 'products' ? 'Producto' : 'Combo'}
            </button>
            <button onClick={handleLogout} className="px-5 py-2.5 rounded-xl text-sm font-semibold border border-red-200 text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2">
              <Icon name="ArrowRightOnRectangleIcon" size={16} /> Salir
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-6 border-b border-gray-200">
          <button 
            onClick={() => setActiveTab('products')} 
            className={`pb-3 px-4 font-semibold transition-colors border-b-2 ${activeTab === 'products' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Productos
          </button>
          <button 
            onClick={() => setActiveTab('combos')} 
            className={`pb-3 px-4 font-semibold transition-colors border-b-2 ${activeTab === 'combos' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
          >
            Combos
          </button>
        </div>

        {/* Tabla principal */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm text-gray-500">
                  <th className="p-4 font-semibold">{activeTab === 'products' ? 'Producto' : 'Combo'}</th>
                  {activeTab === 'products' && <th className="p-4 font-semibold">Categoría</th>}
                  <th className="p-4 font-semibold">Precio (CUP)</th>
                  {activeTab === 'products' && <th className="p-4 font-semibold text-center">Highlight</th>}
                  <th className="p-4 font-semibold text-center">Estado</th>
                  <th className="p-4 font-semibold text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {(activeTab === 'products' ? products : combos).map(item => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {item.image_url ? (
                          <img src={item.image_url} alt={item.name} className="w-10 h-10 rounded-lg object-contain bg-white border border-gray-100" />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 text-xs">Sin img</div>
                        )}
                        <div>
                          <span className="font-medium text-gray-900 block">{item.name}</span>
                          {item.discount_price && <span className="text-xs text-green-600 font-semibold border border-green-200 bg-green-50 px-2 rounded-md">Descuento: ${item.discount_price}</span>}
                        </div>
                      </div>
                    </td>
                    {activeTab === 'products' && (
                      <td className="p-4 text-gray-600">{item.categories?.name || 'Sin categoría'}</td>
                    )}
                    <td className="p-4 font-medium">
                       {item.discount_price ? (
                         <div><span className="line-through text-gray-400 text-xs">${item.price}</span> <span className="text-primary">${item.discount_price}</span></div>
                       ) : (
                         `$${item.price}`
                       )}
                    </td>
                    {activeTab === 'products' && (
                      <td className="p-4 text-center">
                         {item.is_bestseller ? <span className="text-yellow-500 text-lg" title="Más vendido">⭐</span> : <span className="text-gray-300">-</span>}
                      </td>
                    )}
                    <td className="p-4 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${((activeTab === 'products' ? item.is_available : item.is_active) ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600')}`}>
                        {(activeTab === 'products' ? item.is_available : item.is_active) ? 'Activo' : 'Oculto'}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => handleOpenModal(item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                          <Icon name="PencilIcon" size={16} />
                        </button>
                        <button onClick={() => handleDelete(item.id, activeTab === 'products')} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                          <Icon name="TrashIcon" size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(activeTab === 'products' ? products : combos).length === 0 && (
                <div className="p-10 text-center text-gray-500">No hay {activeTab} registrados.</div>
            )}
          </div>
        </div>

      </div>

      {/* Modal Formulario */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-display font-bold">
                {editingId ? `Editar ${activeTab === 'products' ? 'Producto' : 'Combo'}` : `Crear ${activeTab === 'products' ? 'Producto' : 'Combo'}`}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm mb-1 font-medium">Nombre</label>
                  <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="form-input w-full px-3 py-2 rounded-xl text-sm border-gray-200" />
                </div>
                <div className="col-span-2">
                  <label className="block text-sm mb-1 font-medium">Descripción</label>
                  <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="form-input w-full px-3 py-2 rounded-xl text-sm border-gray-200"></textarea>
                </div>
                <div>
                  <label className="block text-sm mb-1 font-medium">Precio Actual (CUP)</label>
                  <input required type="number" step="1" value={formData.price === 0 ? '' : formData.price} onChange={e => setFormData({...formData, price: e.target.value ? parseFloat(e.target.value) : 0})} className="form-input w-full px-3 py-2 rounded-xl text-sm border-gray-200" />
                </div>

                {activeTab === 'products' && (
                  <>
                    <div>
                      <label className="block text-sm mb-1 font-medium">Categoría</label>
                      <select required value={formData.category_id} onChange={e => setFormData({...formData, category_id: e.target.value})} className="form-input w-full px-3 py-2 rounded-xl text-sm border-gray-200">
                        <option value="">Seleccionar...</option>
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                      </select>
                    </div>

                    {/* Precios y Descuentos */}
                    <div className="col-span-2 bg-rose-50 p-4 rounded-2xl border border-rose-100">
                      <div className="flex flex-col gap-3">
                        <label className="text-sm font-medium text-rose-900 border-b border-rose-200 pb-2">Configuración Especial</label>
                        
                        <div>
                          <label className="block text-xs mb-1 font-semibold text-rose-800">Precio en Oferta (CUP)</label>
                          <input type="number" step="1" placeholder="Ej: 500 (Dejar vacio si no hay)" value={formData.discount_price} onChange={e => setFormData({...formData, discount_price: e.target.value ? parseFloat(e.target.value) : ''})} className="form-input w-full px-3 py-2 rounded-xl text-sm border-rose-200 bg-white" />
                          <p className="text-[10px] text-rose-600 mt-1">Si ingresas un monto, aparecerá tachado el precio original y se cobrará este.</p>
                        </div>
                        
                        <label className="flex items-center gap-2 cursor-pointer mt-2">
                          <input type="checkbox" checked={formData.is_bestseller} onChange={e => setFormData({...formData, is_bestseller: e.target.checked})} className="w-5 h-5 text-primary rounded border-rose-300" />
                          <span className="text-sm font-semibold text-rose-900">Marcar como "Más Vendido" ⭐</span>
                        </label>
                        <p className="text-[10px] text-rose-600 -mt-1 ml-7">Estos productos aparecerán en un carrusel especial en la página principal.</p>
                      </div>
                    </div>
                  </>
                )}
                
                {/* Upload Img Component */}
                <div className="col-span-2 mt-2">
                  <label className="block text-sm mb-1 font-medium">Imagen del {activeTab === 'products' ? 'Producto' : 'Combo'} (Desde Galería)</label>
                  <div className="flex items-center gap-4">
                    {formData.image_url && (
                      <img src={formData.image_url} alt="Preview" className="w-[60px] h-[60px] rounded-xl object-contain bg-white border border-gray-200 flex-shrink-0" />
                    )}
                    <input 
                      type="file" 
                      accept="image/*" 
                      onChange={handleImageUpload} 
                      disabled={uploadingImage}
                      className="form-input flex-1 p-2 rounded-xl text-sm border-gray-200 bg-gray-50" 
                    />
                  </div>
                  {uploadingImage && <span className="text-xs font-semibold text-primary mt-1 block">Subiendo imagen, espera un momento...</span>}
                </div>

                <div className="col-span-2 flex items-center mt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={activeTab === 'products' ? formData.is_available : formData.is_active} 
                      onChange={e => {
                        if (activeTab === 'products') setFormData({...formData, is_available: e.target.checked})
                        else setFormData({...formData, is_active: e.target.checked})
                      }} 
                      className="w-4 h-4 text-primary rounded" 
                    />
                    <span className="text-sm font-medium">Visible en la tienda</span>
                  </label>
                </div>
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors">Cancelar</button>
                <button type="submit" disabled={uploadingImage} className="btn-primary px-5 py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}