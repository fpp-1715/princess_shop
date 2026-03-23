import Icon from '../components/ui/AppIcon';

function ContactInfo() {
  return (
    <div className="bg-white rounded-5xl p-8 md:p-12 shadow-card space-y-8">
      
      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-green-50 text-green-500 flex items-center justify-center shrink-0">
          <Icon name="ChatBubbleLeftEllipsisIcon" size={24} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold mb-2 text-gray-900">WhatsApp</h3>
          <p className="text-gray-500 mb-3 text-sm md:text-base">Escríbenos para consultas, pedidos o asesoría personalizada.</p>
          <a href="https://wa.me/5356968120" target="_blank" rel="noreferrer" className="text-green-600 font-semibold hover:underline flex items-center gap-1">
            +53 5 696-8120 <Icon name="ArrowRightIcon" size={14} />
          </a>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 text-primary flex items-center justify-center shrink-0">
           <Icon name="CameraIcon" size={24} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold mb-2 text-gray-900">Instagram</h3>
          <p className="text-gray-500 mb-3 text-sm md:text-base">Síguenos para ver nuestras últimas novedades, rutinas y tips.</p>
          <a href="https://www.instagram.com/princess.shop.co?igsh=ajJobmo4OWprN2Ro&utm_source=qr" target="_blank" rel="noreferrer" className="text-primary font-semibold hover:underline flex items-center gap-1">
            @Princess-Shop <Icon name="ArrowRightIcon" size={14} />
          </a>
        </div>
      </div>

      <hr className="border-gray-100" />

      <div className="flex items-start gap-5">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
          <Icon name="MapPinIcon" size={24} />
        </div>
        <div>
          <h3 className="font-display text-xl font-semibold mb-2 text-gray-900">Tienda Física</h3>
          <p className="text-gray-500 mb-1 text-sm md:text-base">Visítanos y prueba nuestros productos en persona.</p>
          <p className="text-gray-900 font-medium text-sm md:text-base">Villuendas #3 entre Martha Abreus y Padre Chao</p>
        </div>
      </div>

    </div>
  );
}

export default function Contact() {
  return (
    <div className="min-h-screen">
      {/* Page Header */}
      <section
        className="pt-32 pb-16 px-6 relative overflow-hidden"
        style={{ background: 'linear-gradient(145deg, #FFF8FB 0%, #FCE4EC 50%, #FFF3E8 100%)' }}
      >
        <div className="absolute top-0 left-0 w-96 h-96 bg-blush/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full badge-rose text-xs font-semibold mb-4">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Siempre disponibles para ti
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-semibold text-foreground mb-4 leading-tight">
            Encuéntranos{' '}
            <span className="italic text-gradient-rose">aquí</span>
          </h1>
          <p className="text-lg text-foreground-muted max-w-xl mx-auto leading-relaxed">
            Escríbenos por WhatsApp, síguenos en Instagram o visítanos en nuestra tienda.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-6 bg-gradient-blush min-h-[50vh]" aria-label="Información de contacto">
        <div className="max-w-3xl mx-auto">
          <ContactInfo />
        </div>
      </section>
    </div>
  );
}
