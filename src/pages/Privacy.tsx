import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, Lock, FileSignature, Mail, Database, Eye, Share2 } from "lucide-react";
import logo from "@/assets/logo.png";
import SEO from "@/components/SEO";

const Privacy = () => {
  return (
    <>
      <SEO 
        title="Política de Privacidad" 
        description="Conoce cómo FlowSights protege tu información. Acuerdos de confidencialidad obligatorios, almacenamiento cifrado y divulgación de uso de datos de Google."
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
            <ShieldCheck className="w-4 h-4" /> Política de Privacidad
          </span>
          <h1 className="font-display text-4xl md:text-5xl font-bold">
            Tu información, <span className="text-gradient">protegida siempre</span>
          </h1>
          <p className="text-muted-foreground text-lg">
            En FlowSights la confidencialidad de tu información es nuestro principio fundamental.
          </p>
        </div>

        <Card className="p-8 glass-card space-y-8 animate-fade-up">
          <div className="flex gap-4">
            <span className="w-11 h-11 rounded-xl bg-primary/15 text-primary grid place-items-center shrink-0">
              <FileSignature className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Acuerdo de confidencialidad obligatorio</h2>
              <p className="text-muted-foreground leading-relaxed">
                <strong className="text-foreground">No analizamos datos sin firmar previamente un acuerdo de confidencialidad (NDA)</strong> con
                el cliente. Este paso es obligatorio antes de recibir cualquier archivo, base de datos o
                acceso a sistemas, y garantiza que tu información esté protegida legalmente desde el primer
                contacto.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <span className="w-11 h-11 rounded-xl bg-[hsl(var(--accent-violet)/0.15)] text-[hsl(var(--accent-violet))] grid place-items-center shrink-0">
              <Lock className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Manejo seguro de la información</h2>
              <p className="text-muted-foreground leading-relaxed">
                Almacenamos los datos en entornos cifrados, con acceso restringido únicamente al equipo
                asignado a tu proyecto. No compartimos, vendemos ni transferimos información a terceros.
                Una vez finalizado el proyecto, los datos pueden ser devueltos o eliminados de forma
                permanente según lo acuerdes con nosotros.
              </p>
            </div>
          </div>

          <div className="border-t border-border/50 pt-8 mt-4">
            <h2 className="font-display text-2xl font-bold mb-6 flex items-center gap-3">
              <Database className="w-6 h-6 text-primary" /> 
              Uso de Datos de Usuario de Google
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              FlowSights utiliza los Servicios de API de Google para permitir la gestión de campañas publicitarias. Nuestra aplicación cumple con la <a href="https://developers.google.com/terms/api-services-user-data-policy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline font-medium">Política de Datos de Usuario de los Servicios de API de Google</a>, incluyendo los requisitos de Uso Limitado.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-lg bg-primary/10 text-primary grid place-items-center shrink-0">
                  <Eye className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Datos accedidos</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Accedemos a su cuenta de Google Ads (vía el scope <code className="bg-muted px-1 rounded text-xs">adwords</code>) para leer la configuración de sus campañas, grupos de anuncios y anuncios. No accedemos a sus correos electrónicos, contactos ni otros archivos personales de su cuenta de Google.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-sky)/0.15)] text-[hsl(var(--accent-sky))] grid place-items-center shrink-0">
                  <ShieldCheck className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Uso de los datos</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    Utilizamos esta información exclusivamente para facilitar la creación, optimización y publicación de campañas publicitarias directamente desde nuestro dashboard. La inteligencia artificial de FlowSights procesa estos datos para sugerir mejoras y automatizar la publicación de anuncios bajo su consentimiento explícito.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <span className="w-10 h-10 rounded-lg bg-[hsl(var(--accent-violet)/0.15)] text-[hsl(var(--accent-violet))] grid place-items-center shrink-0">
                  <Share2 className="w-5 h-5" />
                </span>
                <div>
                  <h3 className="font-bold text-lg mb-1">Intercambio de datos</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    No compartimos sus datos de usuario de Google con terceros, excepto cuando sea necesario para cumplir con los servicios que usted solicita activamente (por ejemplo, enviar la campaña a Google Ads). Los tokens de acceso se almacenan de forma cifrada y segura en nuestra infraestructura de base de datos.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex gap-4 border-t border-border/50 pt-8">
            <span className="w-11 h-11 rounded-xl bg-[hsl(var(--accent-sky)/0.15)] text-[hsl(var(--accent-sky))] grid place-items-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Tus derechos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Puedes solicitar en cualquier momento acceso, rectificación o eliminación de los datos
                que hayas compartido con nosotros. Respondemos a estas solicitudes en un plazo máximo
                de 5 días hábiles. Puedes revocar el acceso de FlowSights a tu cuenta de Google en cualquier momento desde la configuración de seguridad de tu cuenta de Google.
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-8 glass-card text-center bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20 animate-fade-up">
          <h3 className="font-display text-2xl font-bold mb-2">¿Tienes dudas sobre nuestra política?</h3>
          <p className="text-muted-foreground mb-5">Escríbenos directamente y te responderemos personalmente.</p>
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

