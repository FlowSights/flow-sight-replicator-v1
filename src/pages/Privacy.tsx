import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, ShieldCheck, Lock, FileSignature, Mail } from "lucide-react";
import logo from "@/assets/logo.png";

const Privacy = () => {
  return (
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

        <Card className="p-8 glass-card space-y-6 animate-fade-up">
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

          <div className="flex gap-4">
            <span className="w-11 h-11 rounded-xl bg-[hsl(var(--accent-sky)/0.15)] text-[hsl(var(--accent-sky))] grid place-items-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold mb-2">Tus derechos</h2>
              <p className="text-muted-foreground leading-relaxed">
                Puedes solicitar en cualquier momento acceso, rectificación o eliminación de los datos
                que hayas compartido con nosotros. Respondemos a estas solicitudes en un plazo máximo
                de 5 días hábiles.
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
  );
};

export default Privacy;
