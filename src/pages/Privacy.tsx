import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, Lock, FileSignature, Mail, Database, Eye, Share2, Info, Cookie, Trash2, UserCheck } from "lucide-react";
import logo from "@/assets/logo.png";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <>
      <SEO 
        title="Política de Privacidad" 
        description="Conoce cómo FlowSights protege tu información. Acuerdos de confidencialidad obligatorios, almacenamiento cifrado y divulgación completa de manejo de datos."
        url="/privacidad"
      />
      <div className="min-h-screen">
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl bg-background/70 border-b border-border/50">
        <nav className="container flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-xl">
            <img src={logo} alt="FlowSights logo" width={48} height={48} className="w-12 h-12 object-contain" />
            <span>FlowSights</span>
          </Link>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/"><ArrowLeft className="w-4 h-4" /> Volver al inicio</Link>
          </Button>
        </nav>
      </header>

      <main className="container max-w-3xl pt-32 pb-24 space-y-8">
        <div className="text-center space-y-4 animate-fade-up">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm">
            <ShieldCheck className="w-4 h-4" /> Centro de Privacidad
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Transparencia y <span className="text-gradient">seguridad total</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            Esta política detalla cómo recopilamos, usamos y protegemos tus datos personales y empresariales.
          </p>
        </div>

        <Card className="p-8 glass-card space-y-12 animate-fade-up">
          {/* Section 1: Introduction & Personal Info */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3 border-b border-border/50 pb-4">
              <Info className="w-6 h-6 text-primary" /> 
              Información que recopilamos
            </h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
                  <UserCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Datos de registro</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Recopilamos tu nombre, dirección de correo electrónico y detalles de tu empresa para crear y gestionar tu cuenta en FlowSights. Estos datos son esenciales para identificarte como usuario y brindarte soporte técnico.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-[hsl(var(--accent-sky)/0.15)] text-[hsl(var(--accent-sky))] grid place-items-center shrink-0">
                  <Cookie className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Cookies y Tecnologías Similares</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Utilizamos cookies técnicas para mantener tu sesión activa y recordar tus preferencias. No utilizamos cookies de rastreo de terceros con fines publicitarios dentro de nuestro dashboard.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 2: NDA & Confidentiality */}
          <section className="space-y-6 bg-primary/5 -mx-8 px-8 py-8 border-y border-primary/10">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3">
              <FileSignature className="w-6 h-6 text-primary" /> 
              Confidencialidad Empresarial (NDA)
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              <strong className="text-foreground">FlowSights no analiza datos empresariales sensibles sin un acuerdo de confidencialidad (NDA) previo.</strong> Este compromiso legal asegura que cualquier base de datos, archivo o acceso a sistemas que compartas esté protegido bajo las más estrictas normativas de secreto profesional.
            </p>
          </section>

          {/* Section 3: Google Data Disclosure (CRITICAL FOR VERIFICATION) */}
          <section className="space-y-6 pt-4">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3 border-b border-border/50 pb-4">
              <Database className="w-6 h-6 text-primary" /> 
              Integración con Google Ads
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Al conectar tu cuenta de Google Ads, FlowSights accede a información específica necesaria para la gestión de publicidad. Nuestra aplicación cumple estrictamente con la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Política de Datos de Usuario de los Servicios de API de Google</a>.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Eye className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold mb-1">¿Qué datos vemos?</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Únicamente leemos la estructura de tus campañas (presupuestos, grupos de anuncios y anuncios) mediante el permiso <code className="bg-muted px-1 rounded text-xs">adwords</code>. Jamás accedemos a tu Gmail, Drive o información personal no relacionada con anuncios.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-violet)/0.15)] text-[hsl(var(--accent-violet))] grid place-items-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </span>
                <div>
                  <h4 className="font-bold mb-1">¿Cómo los usamos?</h4>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Nuestra IA procesa los datos para generar sugerencias de optimización y automatizar la creación de anuncios. Estos datos nunca se transfieren a terceros ni se utilizan para entrenar modelos de IA de forma que comprometan tu ventaja competitiva.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 4: Security & Rights */}
          <section className="space-y-6">
            <h2 className="font-display text-2xl font-bold flex items-center gap-3 border-b border-border/50 pb-4">
              <Lock className="w-6 h-6 text-primary" /> 
              Seguridad y Control
            </h2>
            <div className="grid gap-6">
              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-[hsl(var(--accent-sky)/0.15)] text-[hsl(var(--accent-sky))] grid place-items-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Tus derechos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Tienes derecho a acceder, rectificar o eliminar tus datos en cualquier momento. Respondemos a solicitudes de derechos ARCO en menos de 5 días hábiles. También puedes revocar el acceso a Google desde tu configuración de cuenta.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <span className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive grid place-items-center shrink-0">
                  <Trash2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Retención de datos</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Conservamos tus datos mientras tu cuenta esté activa o sea necesario para prestarte el servicio. Si decides cerrar tu cuenta, eliminaremos tus datos personales en un plazo de 30 días, salvo que la ley nos obligue a conservarlos.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </Card>

        <Card className="p-8 glass-card text-center bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 animate-fade-up">
          <h3 className="font-display text-2xl font-bold mb-2">¿Necesitas una aclaración adicional?</h3>
          <p className="text-muted-foreground mb-5">Nuestro oficial de privacidad está disponible para responderte personalmente.</p>
          <Button variant="hero" size="lg" asChild>
            <a href="mailto:contacto@flowsights.it.com">
              <Mail className="w-4 h-4" /> contacto@flowsights.it.com
            </a>
          </Button>
        </Card>

        <p className="text-xs text-muted-foreground text-center">
          Última actualización: {new Date().toLocaleDateString("es-CR", { year: "numeric", month: "long", day: "numeric" })}
        </p>
      </main>
    </div>
    </>
  );
};

export default Privacy;


