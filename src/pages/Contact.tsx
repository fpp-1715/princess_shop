import { useState } from 'react';
import Icon from '../components/ui/AppIcon';
import AppImage from '../components/ui/AppImage';
import { supabase } from '../lib/supabase';

type FormState = 'idle' | 'loading' | 'success' | 'error';
interface FormData { name: string; email: string; subject: string; message: string; }
const subjects = ['Asesoría de skincare personalizada', 'Consulta sobre un producto', 'Estado de mi pedido', 'Devoluciones y cambios', 'Colaboraciones', 'Otro'];

function ContactForm() {
  const [formState, setFormState] = useState<FormState>('idle');
  const [formData, setFormData] = useState<FormData>({ name: '', email: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const validate = (): boolean => {
    const newErrors: Partial<FormData> = {};
    if (!formData.name.trim()) newErrors.name = 'Por favor ingresa tu nombre';
    if (!formData.email.trim()) newErrors.email = 'Por favor ingresa tu email';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.message.trim()) newErrors.message = 'Por favor escribe tu mensaje';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setFormState('loading');
    
    // Using simple approach to insert using Supabase
    try {
      await supabase.from('contact_messages').insert([{
        name: formData.name, email: formData.email, subject: formData.subject, message: formData.message
      }]);
      setFormState('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch {
      setFormState('error');
    }
  };

  if (formState === 'success') {
    return (
      <div className="bg-white rounded-5xl p-10 shadow-card text-center">
        <h2 className="font-display text-2xl font-semibold mb-3">¡Mensaje enviado!</h2>
        <button onClick={() => setFormState('idle')} className="btn-primary px-8 py-3.5 rounded-2xl">Enviar otro mensaje</button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-5xl p-8 md:p-10 shadow-card">
      <h2 className="font-display text-2xl font-semibold mb-2">Escríbenos</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-semibold mb-2">Nombre *</label>
            <input type="text" name="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="form-input w-full px-4 py-3 rounded-xl" />
          </div>
          <div>
            <label className="block text-sm font-semibold mb-2">Email *</label>
            <input type="email" name="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} className="form-input w-full px-4 py-3 rounded-xl" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Asunto</label>
          <select name="subject" value={formData.subject} onChange={(e) => setFormData({...formData, subject: e.target.value})} className="form-input w-full px-4 py-3 rounded-xl">
            <option value="">Selecciona un tema...</option>
            {subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Mensaje *</label>
          <textarea name="message" value={formData.message} onChange={(e) => setFormData({...formData, message: e.target.value})} rows={4} className="form-input w-full px-4 py-3 rounded-xl"></textarea>
        </div>
        <button type="submit" disabled={formState === 'loading'} className="btn-primary w-full py-4 rounded-2xl">{formState === 'loading' ? 'Enviando...' : 'Enviar Mensaje'}</button>
      </form>
    </div>
  );
}

function ContactInfo() {
  return (
    <div className="space-y-6">
      <div className="relative rounded-5xl overflow-hidden h-52 shadow-rose-md">
        <AppImage src="https://img.rocket.new/generatedImages/rocket_gen_img_1892f4fb0-1767450374661.png" alt="Info" fill className="object-cover" />
      </div>
      <div className="bg-white rounded-4xl p-6 shadow-card space-y-4">
        <h3 className="font-display font-semibold mb-4">Contáctanos</h3>
        <div className="flex items-center gap-4">
          <Icon name="EnvelopeIcon" className="text-primary"/> <span>hola@princessshop.com</span>
        </div>
        <div className="flex items-center gap-4">
          <Icon name="PhoneIcon" className="text-primary"/> <span>+1 (305) 555-8492</span>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  return (
    <main className="bg-gradient-blush min-h-screen">
      <section className="pt-28 md:pt-32 pb-10 md:pb-16 px-6 text-center">
        <h1 className="font-display text-4xl md:text-6xl font-semibold mb-4">Hablemos de tu piel</h1>
      </section>
      <section className="py-8 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto flex flex-col lg:grid lg:grid-cols-2 gap-8 md:gap-12">
          <ContactForm />
          <ContactInfo />
        </div>
      </section>
    </main>
  );
}